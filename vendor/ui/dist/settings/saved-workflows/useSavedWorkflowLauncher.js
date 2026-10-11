// 中枢「运行」的直接启动编排。
// 不再合成对话文案：在目标项目里建一个空会话 → 向它发 startSavedWorkflow 命令 →
// accepted 则导航到新会话（启动卡已在顶部）；rejected / 抛错则删掉空会话、把错误回给调用方
// （实参窗行内 / toast），用户留在中枢。「失败在会话存在之前」（不变式 2）：createSession
// 被拒时不发 start、不留会话；start 被拒时立即 deleteSession 收回刚建的空会话。
import { useCallback, useRef, useState } from "react";
import { SAVED_WORKFLOW_START_REJECTED_FAULT_PREFIX, savedWorkflowStartRejectionReasonSchema, } from "@zcode/shared/zcode-protocol-v4";
import { createCommandEnvelope } from "../../v4/commandFactory.js";
import { acquireWorkspaceConnection, } from "../../v4/workspaceConnectionRegistry.js";
import { logger } from "../../logger.js";
// 能力缺席（无 dwf 端口）时 v4 handler 回的 fault code（interaction-background.ts）。
const CAPABILITY_UNSUPPORTED_FAULT = "fault.command.capabilityUnsupported";
/** createSession 的 workspaceId 与 conversation 连接口径一致：identity 优先，否则路径。 */
export function launchWorkspaceId(target) {
    return target.workspaceIdentity?.trim() || target.workspacePath;
}
/**
 * 按目标项目取连接租约（remoteSessionId 决定 endpoint）。直接启动器与「提升为全局」
 * （useSavedWorkflowPromote）共用：两者都在目标项目里建会话，只是首条命令不同。
 */
export function acquireLaunchLease(target, agentService) {
    return acquireWorkspaceConnection({
        workspacePath: target.workspacePath,
        ...(target.workspaceIdentity ? { workspaceIdentity: target.workspaceIdentity } : {}),
        ...(target.remoteSessionId ? { remoteSessionId: target.remoteSessionId } : {}),
    }, agentService);
}
/** 把被拒 ACK 映射成结构化错误：能力缺席 → unsupported；拒绝词表 → 对应 reason；其余 → generic。 */
function mapLaunchError(ack) {
    const code = ack.reasonCode ?? ack.status;
    const message = ack.message;
    if (ack.reasonCode === CAPABILITY_UNSUPPORTED_FAULT) {
        return { reason: "unsupported", code, ...(message ? { message } : {}) };
    }
    if (ack.reasonCode?.startsWith(SAVED_WORKFLOW_START_REJECTED_FAULT_PREFIX)) {
        const suffix = ack.reasonCode.slice(SAVED_WORKFLOW_START_REJECTED_FAULT_PREFIX.length);
        const parsed = savedWorkflowStartRejectionReasonSchema.safeParse(suffix);
        if (parsed.success)
            return { reason: parsed.data, code, ...(message ? { message } : {}) };
    }
    // 未知 fault / 非拒绝词表（含旧客户端遇到的新 code）都按通用错误显示。
    return { reason: "generic", code, ...(message ? { message } : {}) };
}
/**
 * 中枢启动器 hook。载体 `agentService` 由调用组解析（项目组 = 目标项目的解析 service；
 * 全局组 = 本机 base service，目标 = 「运行于」选中的本地项目）。`onNavigate` 在 accepted
 * 后切到新会话（`handleSelectTaskInChat` 镜像，含 `showChatMainView`）。
 */
export function useSavedWorkflowLauncher(params) {
    const { agentService, onNavigate } = params;
    const [pending, setPending] = useState(false);
    const [error, setError] = useState(null);
    // pending 的同步事实源：防同一帧内重复触发（setPending 异步，单靠 state 挡不住）。
    const pendingRef = useRef(false);
    const clearError = useCallback(() => setError(null), []);
    const launch = useCallback(async (target, request) => {
        if (pendingRef.current) {
            return { ok: false, error: { reason: "generic", code: "launch_in_flight" } };
        }
        pendingRef.current = true;
        setPending(true);
        setError(null);
        const workspaceId = launchWorkspaceId(target);
        const lease = acquireLaunchLease(target, agentService);
        const deleteCreatedSession = (sessionId) => {
            void lease.transport
                .sendCommand(createCommandEnvelope({ type: "deleteSession", payload: {}, sessionId }))
                .then((ack) => {
                if (ack.status !== "accepted" && ack.status !== "noop") {
                    logger.warn("[saved-workflow-launch] 回收空会话被拒", {
                        sessionId,
                        status: ack.status,
                        reasonCode: ack.reasonCode ?? null,
                    });
                }
            })
                .catch(() => {
                // 回收失败无碍：内存会话随 CLI 退出消失，转写里也不会出现它（无任何行）。
            });
        };
        let createdSessionId = null;
        try {
            // ① 空会话：无 firstInput、无 config，用 runtime 缺省模型 / 模式（不复用 composer 草稿配置）。
            const createAck = await lease.transport.sendCommand(createCommandEnvelope({
                type: "createSession",
                payload: { workspaceId },
                sessionId: null,
            }));
            if (createAck.status !== "accepted" || createAck.result?.type !== "createSession") {
                // 会话没建成：不发 start、不留会话，通用错误。
                logger.warn("[saved-workflow-launch] createSession 被拒", {
                    workspaceId,
                    status: createAck.status,
                    reasonCode: createAck.reasonCode ?? null,
                });
                const err = {
                    reason: "generic",
                    code: createAck.reasonCode ?? createAck.status,
                    ...(createAck.message ? { message: createAck.message } : {}),
                };
                setError(err);
                return { ok: false, error: err };
            }
            createdSessionId = createAck.result.sessionId;
            // ② startSavedWorkflow：name / scope 定向查找 + 实参；无实参不带 args 键。
            const startAck = await lease.transport.sendCommand(createCommandEnvelope({
                type: "startSavedWorkflow",
                payload: {
                    name: request.name,
                    scope: request.scope,
                    ...(Object.keys(request.args).length > 0 ? { args: request.args } : {}),
                },
                sessionId: createdSessionId,
            }));
            if (startAck.status === "accepted" && startAck.result?.type === "startSavedWorkflow") {
                // accepted：启动卡已在新会话顶部，切过去让它活起来（无导航载体时静默启动，不切页）。
                onNavigate?.(target, createdSessionId);
                return {
                    ok: true,
                    sessionId: createdSessionId,
                    runId: startAck.result.runId,
                    toolCallId: startAck.result.toolCallId,
                };
            }
            // 启动被拒 / 失败：收回刚建的空会话（不变式 2），把原因回给实参窗 / toast。
            deleteCreatedSession(createdSessionId);
            const err = mapLaunchError(startAck);
            setError(err);
            return { ok: false, error: err };
        }
        catch (thrown) {
            if (createdSessionId)
                deleteCreatedSession(createdSessionId);
            const err = {
                reason: "generic",
                code: "exception",
                message: thrown instanceof Error ? thrown.message : String(thrown),
            };
            setError(err);
            return { ok: false, error: err };
        }
        finally {
            lease.release();
            pendingRef.current = false;
            setPending(false);
        }
    }, [agentService, onNavigate]);
    return { launch, pending, error, clearError };
}
//# sourceMappingURL=useSavedWorkflowLauncher.js.map