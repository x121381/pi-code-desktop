import type { ConversationTransport } from "@/v4/transport.js";
type FrameListener = Parameters<ConversationTransport["onFrame"]>[0];
type AssemblyFaultListener = Parameters<ConversationTransport["onAssemblyFault"]>[0];
type RuntimeRestartListener = Parameters<ConversationTransport["onRuntimeRestart"]>[0];
type RuntimeLifecycleListener = Parameters<NonNullable<ConversationTransport["onRuntimeLifecycle"]>>[0];
/**
 * 远程 service proxy 换代期间保持 renderer 侧 transport 身份稳定。
 *
 * 同一 workspace 的存量 pane 会继续持有本对象；replace 后命令与订阅统一转发到
 * 最新 proxy，旧 proxy 的监听先同步解除，避免新旧 Store 竞争同一 topic ownership。
 */
export declare class ReplaceableConversationTransport implements ConversationTransport {
    private current;
    private readonly frameListeners;
    private readonly assemblyFaultListeners;
    private readonly runtimeRestartListeners;
    private readonly runtimeLifecycleListeners;
    private readonly transportBySubscriptionId;
    private offFrame;
    private offAssemblyFault;
    private offRuntimeRestart;
    private offRuntimeLifecycle;
    /**
     * 承载方不支持 runtime lifecycle 时本方法在构造期被抹掉，消费方据此回落 onRuntimeRestart。
     * 能力按构造时的 current 判定：同一 workspace 的后续 transport 均由
     * createAgentConversationTransport 产出，支持性只取决于 agentService，换代不会翻转。
     */
    onRuntimeLifecycle?: (listener: RuntimeLifecycleListener) => () => void;
    constructor(current: ConversationTransport);
    replace(transport: ConversationTransport): void;
    subscribe(params: Parameters<ConversationTransport["subscribe"]>[0]): ReturnType<ConversationTransport["subscribe"]>;
    activate(subscriptionId: string): void;
    resync(params: Parameters<ConversationTransport["resync"]>[0]): ReturnType<ConversationTransport["resync"]>;
    unsubscribe(subscriptionId: string): ReturnType<ConversationTransport["unsubscribe"]>;
    sendCommand(envelope: Parameters<ConversationTransport["sendCommand"]>[0]): ReturnType<ConversationTransport["sendCommand"]>;
    queryCommands(params: Parameters<ConversationTransport["queryCommands"]>[0]): ReturnType<ConversationTransport["queryCommands"]>;
    rowsRange(params: Parameters<ConversationTransport["rowsRange"]>[0]): ReturnType<ConversationTransport["rowsRange"]>;
    plans(params: Parameters<ConversationTransport["plans"]>[0]): ReturnType<ConversationTransport["plans"]>;
    workflowRunEvents(params: Parameters<ConversationTransport["workflowRunEvents"]>[0]): ReturnType<ConversationTransport["workflowRunEvents"]>;
    workflowRuns(params: Parameters<ConversationTransport["workflowRuns"]>[0]): ReturnType<ConversationTransport["workflowRuns"]>;
    workflowRunArtifacts(params: Parameters<ConversationTransport["workflowRunArtifacts"]>[0]): ReturnType<ConversationTransport["workflowRunArtifacts"]>;
    workflowRunArtifactData(params: Parameters<ConversationTransport["workflowRunArtifactData"]>[0]): ReturnType<ConversationTransport["workflowRunArtifactData"]>;
    workflowRunArtifactRead(params: Parameters<ConversationTransport["workflowRunArtifactRead"]>[0]): ReturnType<ConversationTransport["workflowRunArtifactRead"]>;
    workflowRunWorkspace(params: Parameters<ConversationTransport["workflowRunWorkspace"]>[0]): ReturnType<ConversationTransport["workflowRunWorkspace"]>;
    workflowRunNodeResult(params: Parameters<ConversationTransport["workflowRunNodeResult"]>[0]): ReturnType<ConversationTransport["workflowRunNodeResult"]>;
    fileChanges(params: Parameters<ConversationTransport["fileChanges"]>[0]): ReturnType<ConversationTransport["fileChanges"]>;
    fileRewindPreview(params: Parameters<ConversationTransport["fileRewindPreview"]>[0]): ReturnType<ConversationTransport["fileRewindPreview"]>;
    attachmentPut(params: Parameters<ConversationTransport["attachmentPut"]>[0], options?: Parameters<ConversationTransport["attachmentPut"]>[1]): ReturnType<ConversationTransport["attachmentPut"]>;
    attachmentRead(params: Parameters<ConversationTransport["attachmentRead"]>[0]): ReturnType<ConversationTransport["attachmentRead"]>;
    attachmentReadRange(params: Parameters<ConversationTransport["attachmentReadRange"]>[0]): ReturnType<ConversationTransport["attachmentReadRange"]>;
    onFrame(listener: FrameListener): () => void;
    onAssemblyFault(listener: AssemblyFaultListener): () => void;
    onRuntimeRestart(listener: RuntimeRestartListener): () => void;
    private bindCurrentListeners;
    private bindFrameListener;
    private bindAssemblyFaultListener;
    private bindRuntimeRestartListener;
    private bindRuntimeLifecycleListener;
    private detachCurrentListeners;
}
export {};
//# sourceMappingURL=replaceableConversationTransport.d.ts.map