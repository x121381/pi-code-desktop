import { sendWithConversationDelayE2E } from "@/v4/conversationTransportDelayE2E.js";
import { getLocalTtftObserver } from "@/v4/telemetry/localTtftObserver.js";
import { calibrateLocalTtftClock, localTtftNow } from "@zcode/shared";
import { conversationTopicFrameSchema, PROTOCOL_V4_LIMITS, parseConversationTopic, TopicWireFrameAssembler, } from "@zcode/shared/zcode-protocol-v4";
import { ensureAgentV4ConnectionHandshake } from "@/v4/agentV4ConnectionHandshake.js";
import { createWorkflowRunTransportMethods } from "@/v4/agentConversationTransportWorkflowRuns.js";
import { createAckActivationBarrier } from "@/v4/ackActivationBarrier.js";
import { createTopicWireDecoder } from "@/v4/topicWireDecoder.js";
import { logger } from "@/logger.js";
import { uploadAttachmentTransaction, } from "@/v4/attachmentUploadTransaction.js";
/**
 * 一条 host 连接（= 一个 workspace）上的 v4 conversation 传输面。
 * connectionId 由 host 侧补齐；这里只负责 workspace 定位与帧监听生命周期。
 */
export function createAgentConversationTransport(agentService, target) {
    const workspace = {
        workspacePath: target.workspacePath,
        ...(target.workspaceIdentity ? { workspaceIdentity: target.workspaceIdentity } : {}),
    };
    let calibrationFlight;
    const calibrate = () => {
        const observer = getLocalTtftObserver();
        if (target.workspaceIdentity?.trim() ||
            !observer?.needsCalibration(target.workspacePath) ||
            calibrationFlight)
            return;
        const start = localTtftNow();
        calibrationFlight = agentService
            .queryConversationCommandsV4({
            ...workspace,
            commands: [{ sessionId: null, commandId: `ttft-clock-${crypto.randomUUID()}` }],
            clock: true,
        })
            .then((result) => {
            const clock = result.clock && calibrateLocalTtftClock(start, localTtftNow(), result.clock);
            if (clock)
                observer.calibrate(target.workspacePath, clock);
        })
            .catch(() => { })
            .finally(() => {
            calibrationFlight = undefined;
        });
    };
    const ensureHandshake = async () => {
        const hello = await ensureAgentV4ConnectionHandshake(agentService);
        calibrate();
        return hello;
    };
    const listeners = new Set();
    const faultListeners = new Set();
    const runtimeRestartListeners = new Set();
    const runtimeLifecycleListeners = new Set();
    const decoder = createTopicWireDecoder(new TopicWireFrameAssembler(conversationTopicFrameSchema), (frame, deliveryKind) => {
        try {
            if (!target.workspaceIdentity?.trim()) {
                getLocalTtftObserver()?.receive(target.workspacePath, frame, deliveryKind);
                // Bug 原因：校准只在 ensureHandshake 顺带刷新，排队/慢发送等待期间没有传输调用，
                // 首输出时校准已超过 60 秒有效期，跨进程阶段被整体丢弃。内容帧到达即刷新过期校准。
                calibrate();
            }
        }
        catch (error) {
            logger.debug("[local-ttft] observation failed", { error });
        }
        for (const listener of listeners)
            listener(frame, { deliveryKind });
    }, (fault) => {
        for (const listener of faultListeners)
            listener(fault);
    });
    const barrier = createAckActivationBarrier((wire) => {
        decoder.accept(wire);
    });
    const topicBySubscriptionId = new Map();
    let ttftUpstream;
    let upstream = null;
    let runtimeRestartUpstream = null;
    let runtimeLifecycleUpstream = null;
    let runtimeGeneration = 0;
    const targetWorkspaceKey = target.workspaceIdentity?.trim() || target.workspacePath;
    const lifecycleContext = {
        workspaceKey: targetWorkspaceKey,
        workspacePath: target.workspacePath,
        ...(target.workspaceIdentity ? { workspaceIdentity: target.workspaceIdentity } : {}),
    };
    const decodeBase64Chunk = (value) => {
        const decoded = atob(value);
        const bytes = new Uint8Array(decoded.length);
        for (let index = 0; index < decoded.length; index += 1) {
            bytes[index] = decoded.charCodeAt(index);
        }
        return bytes;
    };
    return {
        async subscribe(params) {
            const sessionId = parseConversationTopic(params.topic);
            if (!sessionId) {
                return Promise.reject(new Error(`Unsupported v4 topic: ${params.topic}`));
            }
            const startedAt = Date.now();
            logger.lifecycle.info("v4 conversation subscription started", {
                ...lifecycleContext,
                event: "v4.conversation.subscribe.started",
                module: "ui.v4.conversation_transport",
                runtimeGeneration,
                sessionId,
                status: "started",
                topic: params.topic,
            });
            let pending;
            try {
                await ensureHandshake();
                pending = barrier.begin(params.topic);
                const subscribeRuntimeGeneration = runtimeGeneration;
                const result = await agentService.subscribeConversationV4({
                    ...workspace,
                    sessionId,
                    ...(params.base ? { base: params.base } : {}),
                    ...(params.visibility ? { visibility: params.visibility } : {}),
                });
                if (subscribeRuntimeGeneration !== runtimeGeneration) {
                    // 旧 runtime 的迟到 ACK 可能复用新 runtime 的 subId；此处只能
                    // 丢本地 pending，不能向新 runtime 盲退订同名 subscription。
                    barrier.cancel(pending);
                    logger.lifecycle.warn("v4 conversation subscription ACK became stale", {
                        ...lifecycleContext,
                        durationMs: Date.now() - startedAt,
                        event: "v4.conversation.subscribe.stale_ack",
                        module: "ui.v4.conversation_transport",
                        runtimeGeneration,
                        sessionId,
                        status: "failed",
                        topic: params.topic,
                    });
                    throw new Error("fault.subscription.runtimeRestarted");
                }
                try {
                    barrier.bind(pending, result.ack.subscriptionId);
                }
                catch (error) {
                    // ACK 前 physical batch 一旦越界就已经不完整，必须撤销 host
                    // subscription 并把明确 fault 交给调用方，不能返回一个可 activate 的 ACK。
                    try {
                        await agentService.unsubscribeConversationV4({
                            ...workspace,
                            subscriptionId: result.ack.subscriptionId,
                        });
                    }
                    catch (cleanupError) {
                        logger.warn("[v4-conversation] failed to undo rejected subscription", cleanupError);
                    }
                    throw error;
                }
                topicBySubscriptionId.set(result.ack.subscriptionId, params.topic);
                logger.lifecycle.info("v4 conversation subscription acknowledged", {
                    ...lifecycleContext,
                    durationMs: Date.now() - startedAt,
                    event: "v4.conversation.subscribe.acknowledged",
                    module: "ui.v4.conversation_transport",
                    runtimeGeneration,
                    sessionId,
                    status: "completed",
                    subscriptionId: result.ack.subscriptionId,
                    topic: params.topic,
                });
                return result;
            }
            catch (error) {
                if (pending)
                    barrier.cancel(pending);
                logger.lifecycle.warn("v4 conversation subscription failed", {
                    ...lifecycleContext,
                    durationMs: Date.now() - startedAt,
                    errorMessage: error instanceof Error ? error.message : String(error),
                    event: "v4.conversation.subscribe.failed",
                    module: "ui.v4.conversation_transport",
                    runtimeGeneration,
                    sessionId,
                    status: "failed",
                    topic: params.topic,
                });
                throw error;
            }
        },
        activate(subscriptionId) {
            const activation = barrier.activate(subscriptionId);
            if (activation?.previousSubscriptionId) {
                decoder.discard(activation.topic, activation.previousSubscriptionId);
                topicBySubscriptionId.delete(activation.previousSubscriptionId);
            }
            logger.lifecycle.info("v4 conversation subscription activated", {
                ...lifecycleContext,
                event: "v4.conversation.subscribe.activated",
                module: "ui.v4.conversation_transport",
                runtimeGeneration,
                status: "completed",
                subscriptionId,
                ...(activation?.topic ? { topic: activation.topic } : {}),
            });
        },
        async resync(params) {
            await ensureHandshake();
            const topic = topicBySubscriptionId.get(params.subscriptionId);
            if (!topic)
                throw new Error("fault.subscription.notOwned");
            // 必须在 RPC 前解开 decoder fail-closed 门；assembler ordinal tombstone 仍保留，
            // 因此同 read 中早于 Promise continuation 到达的 K+1 recovery 可进入，<=K 仍丢。
            decoder.recover(topic, params.subscriptionId);
            return agentService.resyncConversationV4({
                ...workspace,
                subscriptionId: params.subscriptionId,
                base: params.base,
                ...(params.forceSnapshot !== undefined ? { forceSnapshot: params.forceSnapshot } : {}),
            });
        },
        async unsubscribe(subscriptionId) {
            // 本地 ownership 先释放；旧 service proxy 的 handshake/RPC 已失败时也不能继续投帧。
            const startedAt = Date.now();
            barrier.forget(subscriptionId);
            const subscriptionTopic = topicBySubscriptionId.get(subscriptionId);
            topicBySubscriptionId.delete(subscriptionId);
            if (subscriptionTopic)
                decoder.discard(subscriptionTopic, subscriptionId);
            logger.lifecycle.info("v4 conversation unsubscription started", {
                ...lifecycleContext,
                event: "v4.conversation.unsubscribe.started",
                module: "ui.v4.conversation_transport",
                runtimeGeneration,
                status: "started",
                subscriptionId,
                ...(subscriptionTopic ? { topic: subscriptionTopic } : {}),
            });
            try {
                await ensureHandshake();
                await agentService.unsubscribeConversationV4({
                    ...workspace,
                    subscriptionId,
                });
                logger.lifecycle.info("v4 conversation unsubscription completed", {
                    ...lifecycleContext,
                    durationMs: Date.now() - startedAt,
                    event: "v4.conversation.unsubscribe.completed",
                    module: "ui.v4.conversation_transport",
                    runtimeGeneration,
                    status: "completed",
                    subscriptionId,
                    ...(subscriptionTopic ? { topic: subscriptionTopic } : {}),
                });
            }
            catch (error) {
                logger.lifecycle.warn("v4 conversation unsubscription failed", {
                    ...lifecycleContext,
                    durationMs: Date.now() - startedAt,
                    errorMessage: error instanceof Error ? error.message : String(error),
                    event: "v4.conversation.unsubscribe.failed",
                    module: "ui.v4.conversation_transport",
                    runtimeGeneration,
                    status: "failed",
                    subscriptionId,
                    ...(subscriptionTopic ? { topic: subscriptionTopic } : {}),
                });
                throw error;
            }
        },
        async sendCommand(envelope) {
            const hello = await ensureHandshake();
            const payload = envelope.payload;
            // 旧 Host 会剥掉未知字段；不能把 yolo + Plan 错发成完全访问执行。
            if (hello.capabilities.independentPlanState !== true &&
                (payload.planEnabled || payload.config?.planEnabled || payload.firstInput?.planEnabled)) {
                throw new Error("proto.independentPlanUnsupported");
            }
            return sendWithConversationDelayE2E(envelope, () => agentService.sendConversationCommandV4({ ...workspace, envelope }));
        },
        async queryCommands(params) {
            await ensureHandshake();
            return agentService.queryConversationCommandsV4({
                ...workspace,
                commands: params.commands,
            });
        },
        async rowsRange(params) {
            await ensureHandshake();
            return agentService.conversationRowsRangeV4({
                ...workspace,
                sessionId: params.sessionId,
                ...(params.beforeRowId !== undefined ? { beforeRowId: params.beforeRowId } : {}),
                limit: params.limit,
            });
        },
        async plans(params) {
            await ensureHandshake();
            return agentService.conversationPlansV4({
                ...workspace,
                sessionId: params.sessionId,
            });
        },
        // dwf journal 的两个只读查询拆在 agentConversationTransportWorkflowRuns.ts（max-lines 边界）。
        ...createWorkflowRunTransportMethods({ agentService, ensureHandshake, workspace }),
        async fileChanges(params) {
            await ensureHandshake();
            return agentService.conversationFileChangesV4({
                ...workspace,
                sessionId: params.sessionId,
                target: params.target,
                baseRevision: params.baseRevision,
                baseLogEpoch: params.baseLogEpoch,
            });
        },
        async fileRewindPreview(params) {
            await ensureHandshake();
            return agentService.conversationFileRewindPreviewV4({
                ...workspace,
                sessionId: params.sessionId,
                target: params.target,
                baseRevision: params.baseRevision,
                baseLogEpoch: params.baseLogEpoch,
            });
        },
        async attachmentPut(params, options) {
            await ensureHandshake();
            return uploadAttachmentTransaction(agentService, workspace, params, options);
        },
        async attachmentRead(params) {
            params.signal?.throwIfAborted();
            await ensureHandshake();
            params.signal?.throwIfAborted();
            if (target.createLocalMediaPreviewUrl && params.mediaType?.startsWith("video/")) {
                const source = await agentService.attachmentPreviewSourceV4({
                    ...workspace,
                    sessionId: params.sessionId,
                    ref: params.ref,
                    ...(params.target ? { target: params.target } : {}),
                    ...(params.attachmentIndex !== undefined
                        ? { attachmentIndex: params.attachmentIndex }
                        : {}),
                });
                params.signal?.throwIfAborted();
                if (source.kind === "local_path") {
                    return {
                        url: target.createLocalMediaPreviewUrl(source.path),
                        mediaType: source.mediaType,
                    };
                }
            }
            const chunks = [];
            let offset = 0;
            let totalBytes = null;
            let mediaType = null;
            for (let chunkIndex = 0;; chunkIndex += 1) {
                params.signal?.throwIfAborted();
                // 已发送视频读取曾误用上传事务的 64-chunk 上限，导致 20MiB 以上视频无法预览。
                if (chunkIndex >= PROTOCOL_V4_LIMITS.attachmentPreviewMaxChunks) {
                    throw new Error("fault.attachment.previewTooManyChunks");
                }
                const result = await agentService.attachmentReadV4({
                    ...workspace,
                    sessionId: params.sessionId,
                    ref: params.ref,
                    ...(params.target ? { target: params.target } : {}),
                    ...(params.attachmentIndex !== undefined
                        ? { attachmentIndex: params.attachmentIndex }
                        : {}),
                    offset,
                    limit: PROTOCOL_V4_LIMITS.attachmentChunkMaxBytes,
                });
                // 旧的 request-id 保护只会忽略晚到结果，Dialog 关闭后仍会继续拉取
                // 最多 30MiB 视频。高层读取拥有取消语义，在每个在途 chunk 返回后立即停住。
                params.signal?.throwIfAborted();
                totalBytes ??= result.totalBytes;
                mediaType ??= result.mediaType;
                if (result.totalBytes !== totalBytes || result.mediaType !== mediaType) {
                    throw new Error("fault.attachment.previewChangedDuringRead");
                }
                const chunk = decodeBase64Chunk(result.dataBase64);
                const nextOffset = offset + chunk.byteLength;
                if (nextOffset > totalBytes) {
                    throw new Error("fault.attachment.previewSizeMismatch");
                }
                if (result.nextOffset !== null && result.nextOffset !== nextOffset) {
                    throw new Error("fault.attachment.previewOffsetMismatch");
                }
                chunks.push(chunk);
                if (result.nextOffset === null) {
                    if (nextOffset !== totalBytes) {
                        throw new Error("fault.attachment.previewTruncated");
                    }
                    params.signal?.throwIfAborted();
                    const bytes = new Uint8Array(totalBytes);
                    let writeOffset = 0;
                    for (const part of chunks) {
                        bytes.set(part, writeOffset);
                        writeOffset += part.byteLength;
                    }
                    return { bytes, mediaType };
                }
                if (chunk.byteLength === 0) {
                    throw new Error("fault.attachment.previewEmptyChunk");
                }
                offset = result.nextOffset;
            }
        },
        async attachmentReadRange(params) {
            params.signal?.throwIfAborted();
            await ensureHandshake();
            params.signal?.throwIfAborted();
            const result = await agentService.attachmentReadV4({
                ...workspace,
                sessionId: params.sessionId,
                ref: params.ref,
                ...(params.target ? { target: params.target } : {}),
                ...(params.attachmentIndex !== undefined
                    ? { attachmentIndex: params.attachmentIndex }
                    : {}),
                offset: params.offset,
                limit: params.limit,
            });
            params.signal?.throwIfAborted();
            return {
                bytes: decodeBase64Chunk(result.dataBase64),
                mediaType: result.mediaType,
                totalBytes: result.totalBytes,
                nextOffset: result.nextOffset,
            };
        },
        onFrame(listener) {
            listeners.add(listener);
            if (!upstream) {
                if (!target.workspaceIdentity?.trim())
                    ttftUpstream = agentService.onDynamicLocalTtftFacts?.(workspace)((facts) => {
                        try {
                            getLocalTtftObserver()?.checkpoint(target.workspacePath, facts);
                            // CLI 在 admitted/execution/各准备阶段都会发检查点：排队输入开始执行时
                            // 就能在首输出前拿到 60 秒内的新校准，不需要额外定时器或协议。
                            calibrate();
                        }
                        catch (error) {
                            logger.debug("[local-ttft] checkpoint failed", { error });
                        }
                    });
                upstream = agentService.onDynamicConversationFrame(workspace)((frame) => barrier.accept(frame));
                logger.lifecycle.info("v4 conversation frame upstream attached", {
                    ...lifecycleContext,
                    event: "v4.conversation.frames.upstream_attached",
                    listenerCount: listeners.size,
                    module: "ui.v4.conversation_transport",
                    runtimeGeneration,
                    status: "completed",
                });
            }
            return () => {
                listeners.delete(listener);
                if (listeners.size === 0) {
                    upstream?.dispose();
                    ttftUpstream?.dispose();
                    ttftUpstream = undefined;
                    upstream = null;
                    logger.lifecycle.info("v4 conversation frame upstream detached", {
                        ...lifecycleContext,
                        event: "v4.conversation.frames.upstream_detached",
                        listenerCount: 0,
                        module: "ui.v4.conversation_transport",
                        runtimeGeneration,
                        status: "completed",
                    });
                }
            };
        },
        onAssemblyFault(listener) {
            faultListeners.add(listener);
            return () => faultListeners.delete(listener);
        },
        onRuntimeRestart(listener) {
            runtimeRestartListeners.add(listener);
            runtimeRestartUpstream ??= agentService.onAgentRuntimeRestarted((event) => {
                if (event.workspaceKey !== targetWorkspaceKey)
                    return;
                if (!target.workspaceIdentity?.trim())
                    getLocalTtftObserver()?.interrupt(target.workspacePath);
                runtimeGeneration += 1;
                // runtime generation 可复用 subId/ordinal；ownership 与 assembler 必须原子失效。
                barrier.clear();
                decoder.clear();
                topicBySubscriptionId.clear();
                for (const restartListener of runtimeRestartListeners)
                    restartListener("runtimeRestart");
            });
            return () => {
                runtimeRestartListeners.delete(listener);
                if (runtimeRestartListeners.size === 0) {
                    runtimeRestartUpstream?.dispose();
                    runtimeRestartUpstream = null;
                }
            };
        },
        ...(agentService.onAgentRuntimeLifecycle
            ? {
                onRuntimeLifecycle(listener) {
                    runtimeLifecycleListeners.add(listener);
                    runtimeLifecycleUpstream ??=
                        agentService.onAgentRuntimeLifecycle?.((event) => {
                            if (event.workspaceKey !== targetWorkspaceKey)
                                return;
                            if (event.state === "unavailable" && !target.workspaceIdentity?.trim())
                                getLocalTtftObserver()?.interrupt(target.workspacePath);
                            // 只转发、不动 runtimeGeneration/barrier/decoder/topicBySubscriptionId：那是
                            // onRuntimeRestart 的语义（新 runtime 已存在、可安全重订阅）。unavailable 时
                            // 旧 CLI 已死不会再有帧到达，而提前递增 generation 会让随后 restart 的
                            // ownership 判定错位。available 与 restart 同刻到达，清理由那一路完成。
                            for (const lifecycleListener of runtimeLifecycleListeners) {
                                lifecycleListener(event.state);
                            }
                        }) ?? null;
                    return () => {
                        runtimeLifecycleListeners.delete(listener);
                        if (runtimeLifecycleListeners.size === 0) {
                            runtimeLifecycleUpstream?.dispose();
                            runtimeLifecycleUpstream = null;
                        }
                    };
                },
            }
            : {}),
    };
}
//# sourceMappingURL=agentConversationTransport.js.map