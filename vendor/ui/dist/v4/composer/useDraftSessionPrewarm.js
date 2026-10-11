/* oxlint-disable eslint(max-lines) -- draft prewarm 的创建、复用、回收和首帧 ModelSelection 必须共享同一 owner 状态机；拆到多文件会让 StrictMode/transport 换代清理时序更难审计。 */
// 草稿态 v4 draft session 预热。
//
// 背景：草稿态没有任何 session 在册时，配置面被迫走 workspace-default 旧 RPC，
// 其回包 buildWorkspaceState 每次临建完整 app（140-798ms/次）；首发也要现场
// createSession。v4 协议本就保留 phase=draft 会话实体（「pane 绑 draft
// session 则服务端已有会话实体」）——本模块在 pane 未绑定会话时后台建一个
// draft session 作预热载体：配置写走 v4 CAS 命令直达会话、首发 sendText 复用、
// 未使用则清理。纯内存不落盘，CLI 重启即消失；gateway isDraftSession 过滤保证
// 它不会以「新任务」漏进 sessions-index 侧栏。
//
// 结构：生命周期收敛在纯控制器 startDraftSessionPrewarm（可单测，无 React 依赖），
// useDraftSessionPrewarm 只做 effect 接线与 owner-scoped binding 暴露。
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { logger } from "../../logger.js";
/** 预热生命周期纯控制器：创建 → onReady 上抛 → dispose 决策清理。 */
export function startDraftSessionPrewarm(params) {
    const { workspaceKey, dispatchCommand, onReady, onSettled, resolveInitialConfig, } = params;
    let disposed = false;
    let promotionState = "draft";
    let createdSessionId = null;
    const deleteCreatedSession = (sessionId) => {
        void dispatchCommand("deleteSession", {}, sessionId)
            .then((ack) => {
            if (ack.status !== "accepted" && ack.status !== "noop") {
                logger.warn("[v4-draft-prewarm] 清理预热会话被拒", {
                    sessionId,
                    status: ack.status,
                    reasonCode: ack.reasonCode ?? null,
                });
            }
        })
            .catch(() => {
            // 清理失败无碍：内存会话随 CLI 退出消失。
        });
    };
    const createPayload = () => {
        const createPayload = { workspaceId: workspaceKey };
        const initialConfig = resolveInitialConfig?.();
        if (initialConfig && Object.keys(initialConfig).length > 0) {
            // 预热会话首帧即用全局模型（CLI 归并 createSession.config），不闪 workspace 缺省。
            createPayload.config = initialConfig;
        }
        return createPayload;
    };
    const dispatchCreateSession = () => {
        const createSessionPayload = createPayload();
        if (disposed) {
            return Promise.resolve(null);
        }
        return dispatchCommand("createSession", createSessionPayload, null);
    };
    const createSessionAck = dispatchCreateSession();
    void createSessionAck
        .then((ack) => {
        if (!ack) {
            return;
        }
        if (ack.status !== "accepted" || ack.result?.type !== "createSession") {
            logger.warn("[v4-draft-prewarm] createSession 被拒，回落无预热路径", {
                status: ack.status,
                reasonCode: ack.reasonCode ?? null,
                workspaceKey,
            });
            return;
        }
        createdSessionId = ack.result.sessionId;
        if (disposed) {
            // 极快切走时创建无法取消：ACK 到达后就地删除，避免遗留内存会话。
            deleteCreatedSession(createdSessionId);
            return;
        }
        logger.info("[v4-draft-prewarm] draft session 预热就绪", {
            sessionId: createdSessionId,
            workspaceKey,
        });
        onReady(createdSessionId);
    })
        .catch((error) => {
        logger.warn("[v4-draft-prewarm] createSession 失败，回落无预热路径", {
            error: error instanceof Error ? error.message : String(error),
            workspaceKey,
        });
    })
        .finally(() => {
        onSettled?.();
    });
    return {
        markPromotionPending() {
            if (promotionState === "draft") {
                promotionState = "pending";
            }
        },
        markPromoted() {
            promotionState = "promoted";
        },
        markDiscarded() {
            if (promotionState !== "promoted") {
                promotionState = "discarded";
            }
        },
        dispose() {
            if (disposed)
                return;
            disposed = true;
            // Agent 可在 MCP 初始化期间先 admission 首发，而 renderer 仍等待 ACK；
            // 此时 owner cleanup 若按普通 draft 删除，会关闭已经运行的 execution adapter。
            // 只有从未开始 promotion 的 draft 才能安全自动回收，pending 必须等待原命令收口。
            if (createdSessionId && promotionState === "draft") {
                deleteCreatedSession(createdSessionId);
            }
        },
    };
}
/**
 * createSession 失败后的退避重试节奏。
 *
 * CUA Helper ready 会触发 workspace-dispose 回收，正在飞的 createSession 被
 * client disposed 打断；只 warn 一次会永久「回落无预热路径」，草稿态从此拿不到
 * sessionId，粘贴的图片永远停在 waitingSession（进度 0%）。回收是瞬态的，隔一会儿重试即可
 * 成功，所以这里做有界退避而不是放弃。
 */
const PREWARM_RETRY_DELAYS_MS = [500, 1000, 2000];
/**
 * 同一逻辑 draft pane 的预热协调器。
 *
 * createSession 不能直接绑在 React effect 实例上。effect cleanup 无法取消已经
 * 发出的协议请求，新 effect 却会立刻再发一个 createSession；Agent 的全局 FIFO 因而被同一草稿
 * 的多个慢创建占满。协调器跨同步重挂保留 owner，并在旧创建 ACK 前阻止下一代创建入队。
 */
class DraftSessionPrewarmCoordinator {
    workspaceKey;
    onEmpty;
    subscribers = new Map();
    current = null;
    blockedInvalidationVersion = null;
    cleanupTimer = null;
    retryTimer = null;
    dispatchCommand;
    resolveInitialConfig;
    constructor(workspaceKey, dispatchCommand, resolveInitialConfig, onEmpty) {
        this.workspaceKey = workspaceKey;
        this.onEmpty = onEmpty;
        this.dispatchCommand = dispatchCommand;
        this.resolveInitialConfig = resolveInitialConfig;
    }
    update(dispatchCommand, resolveInitialConfig) {
        this.dispatchCommand = dispatchCommand;
        this.resolveInitialConfig = resolveInitialConfig;
    }
    acquire(params) {
        if (this.cleanupTimer !== null) {
            clearTimeout(this.cleanupTimer);
            this.cleanupTimer = null;
        }
        const token = Symbol("draft-prewarm-subscriber");
        this.subscribers.set(token, params);
        this.reconcile();
        this.emitBindingTo(params);
        return () => {
            if (!this.subscribers.delete(token) || this.subscribers.size > 0) {
                return;
            }
            // React StrictMode 和同 key 同步重挂会先 cleanup 再重新执行 effect。延迟到下一任务确认
            // 是否真的离开，避免“create → cleanup delete → create”的协议 churn。
            this.cleanupTimer = setTimeout(() => {
                this.cleanupTimer = null;
                if (this.subscribers.size > 0) {
                    return;
                }
                this.retireCurrent();
                if (!this.current) {
                    this.onEmpty();
                }
            }, 0);
        };
    }
    requestedInvalidationVersion() {
        let latest = null;
        for (const subscriber of this.subscribers.values()) {
            latest =
                latest === null
                    ? subscriber.invalidationVersion
                    : Math.max(latest, subscriber.invalidationVersion);
        }
        return latest;
    }
    reconcile() {
        const requestedVersion = this.requestedInvalidationVersion();
        if (requestedVersion === null) {
            return;
        }
        if (this.blockedInvalidationVersion !== null &&
            this.blockedInvalidationVersion !== requestedVersion) {
            this.blockedInvalidationVersion = null;
        }
        if (this.current) {
            if (!this.current.retiring && this.current.invalidationVersion === requestedVersion) {
                return;
            }
            this.retireCurrent();
            // createSession 已经发出时不可取消；onSettled 会在 ACK 后先排 delete，再只启动最新代。
            if (this.current) {
                return;
            }
        }
        if (this.blockedInvalidationVersion === requestedVersion) {
            return;
        }
        this.startCurrent(requestedVersion);
    }
    clearRetryTimer() {
        if (this.retryTimer === null)
            return;
        clearTimeout(this.retryTimer);
        this.retryTimer = null;
    }
    /**
     * createSession 收口却没拿到 binding = 失败（被拒或异常）。回收导致的 client disposed 是
     * 瞬态的，按退避重排一次创建；用尽则维持既有的「回落无预热路径」行为。
     */
    scheduleRetryAfterFailure(failed) {
        const delay = PREWARM_RETRY_DELAYS_MS[failed.retryAttempt];
        if (delay === undefined)
            return;
        this.clearRetryTimer();
        this.retryTimer = setTimeout(() => {
            this.retryTimer = null;
            if (this.current !== failed || failed.retiring || failed.binding !== null)
                return;
            if (this.subscribers.size === 0)
                return;
            const requestedVersion = this.requestedInvalidationVersion();
            if (requestedVersion === null || this.blockedInvalidationVersion === requestedVersion)
                return;
            // 释放失败的一代，让下一代能通过 reconcile 的单飞闸。
            this.current = null;
            this.startCurrent(requestedVersion, failed.retryAttempt + 1);
        }, delay);
    }
    startCurrent(invalidationVersion, retryAttempt = 0) {
        let current;
        const controller = startDraftSessionPrewarm({
            workspaceKey: this.workspaceKey,
            dispatchCommand: (type, payload, targetSessionId) => this.dispatchCommand(type, payload, targetSessionId),
            resolveInitialConfig: () => this.resolveInitialConfig?.(),
            onReady: (sessionId) => {
                if (this.current !== current || current.retiring) {
                    return;
                }
                let binding;
                binding = {
                    workspaceKey: this.workspaceKey,
                    sessionId,
                    beginPromotion: () => {
                        if (this.current !== current || current.binding !== binding) {
                            return false;
                        }
                        current.controller.markPromotionPending();
                        return true;
                    },
                    promote: () => {
                        if (this.current !== current || current.binding !== binding) {
                            return;
                        }
                        current.controller.markPromoted();
                    },
                    discard: () => {
                        if (this.current !== current || current.binding !== binding) {
                            return;
                        }
                        current.controller.markDiscarded();
                        current.binding = null;
                        this.blockedInvalidationVersion = current.invalidationVersion;
                        this.emitBindings();
                    },
                };
                current.binding = binding;
                this.emitBindings();
            },
            onSettled: () => {
                current.settled = true;
                if (this.current !== current || !current.retiring) {
                    // 未被 retire 却没拿到 binding = createSession 失败；瞬态回收可退避重试。
                    if (this.current === current && !current.retiring && current.binding === null) {
                        this.scheduleRetryAfterFailure(current);
                    }
                    return;
                }
                this.current = null;
                if (this.subscribers.size > 0) {
                    this.reconcile();
                }
                else {
                    this.onEmpty();
                }
            },
        });
        current = {
            invalidationVersion,
            controller,
            binding: null,
            settled: false,
            retiring: false,
            retryAttempt,
        };
        this.current = current;
    }
    retireCurrent() {
        const current = this.current;
        if (!current || current.retiring) {
            return;
        }
        this.clearRetryTimer();
        current.retiring = true;
        current.binding = null;
        current.controller.dispose();
        this.emitBindings();
        if (current.settled) {
            this.current = null;
        }
    }
    emitBindings() {
        for (const subscriber of this.subscribers.values()) {
            this.emitBindingTo(subscriber);
        }
    }
    emitBindingTo(subscriber) {
        const current = this.current;
        subscriber.onBinding(current && !current.retiring && current.invalidationVersion === subscriber.invalidationVersion
            ? current.binding
            : null);
    }
}
const draftPrewarmCoordinatorsByTransport = new Map();
function logicalDraftOwnerKey(workspaceKey, paneId) {
    return JSON.stringify([workspaceKey, paneId]);
}
function getDraftSessionPrewarmCoordinator(params) {
    let transportCoordinators = draftPrewarmCoordinatorsByTransport.get(params.transportIdentity);
    if (!transportCoordinators) {
        transportCoordinators = new Map();
        draftPrewarmCoordinatorsByTransport.set(params.transportIdentity, transportCoordinators);
    }
    const ownerKey = logicalDraftOwnerKey(params.workspaceKey, params.paneId);
    let coordinator = transportCoordinators.get(ownerKey);
    if (!coordinator) {
        coordinator = new DraftSessionPrewarmCoordinator(params.workspaceKey, params.dispatchCommand, params.resolveInitialConfig, () => {
            if (transportCoordinators?.get(ownerKey) !== coordinator) {
                return;
            }
            transportCoordinators.delete(ownerKey);
            if (transportCoordinators.size === 0) {
                draftPrewarmCoordinatorsByTransport.delete(params.transportIdentity);
            }
        });
        transportCoordinators.set(ownerKey, coordinator);
    }
    return coordinator;
}
export function useDraftSessionPrewarm(params) {
    const { enabled, workspaceKey, paneId, transportIdentity, invalidationVersion = 0, dispatchCommand, resolveInitialConfig, } = params;
    // workspace/pane/transport 共同定义逻辑 owner：同 owner 重挂复用 single-flight，transport
    // 换代仍生成新 coordinator，确保旧 session 的清理不会误走新 transport。
    const owner = useMemo(() => ({ workspaceKey, paneId, transportIdentity }), [paneId, transportIdentity, workspaceKey]);
    const coordinator = useMemo(() => getDraftSessionPrewarmCoordinator({
        workspaceKey,
        paneId,
        transportIdentity,
        dispatchCommand,
        resolveInitialConfig,
    }), [owner]);
    useLayoutEffect(() => {
        coordinator.update(dispatchCommand, resolveInitialConfig);
    }, [coordinator, dispatchCommand, resolveInitialConfig]);
    const generation = useMemo(() => ({ owner }), [enabled, invalidationVersion, owner]);
    const [ready, setReady] = useState(null);
    useEffect(() => {
        if (!enabled)
            return;
        return coordinator.acquire({
            invalidationVersion,
            onBinding: (binding) => {
                setReady((current) => {
                    if (!binding) {
                        return current?.generation === generation ? null : current;
                    }
                    return { generation, binding };
                });
            },
        });
    }, [coordinator, enabled, generation, invalidationVersion]);
    return { binding: ready?.generation === generation ? ready.binding : null };
}
//# sourceMappingURL=useDraftSessionPrewarm.js.map