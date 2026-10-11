import type { IZCodeAgentService } from "@zcode/services";
import { type ConversationResyncParams, type SessionsIndexTopicFrame, type TopicFrameDeliveryKind, type V4ConversationResyncResult, type V4SessionsIndexSubscribeResult } from "@zcode/shared/zcode-protocol-v4";
export interface SessionsIndexTransport {
    subscribe(params: {
        base?: {
            logEpoch: string;
            seq: number;
        };
        visibility?: "foreground" | "background";
    }): Promise<V4SessionsIndexSubscribeResult>;
    activate(subscriptionId: string): void;
    resync(params: ConversationResyncParams): Promise<V4ConversationResyncResult>;
    unsubscribe(subscriptionId: string): Promise<void>;
    onFrame(listener: (frame: SessionsIndexTopicFrame, context?: {
        deliveryKind: TopicFrameDeliveryKind;
    }) => void): () => void;
    onAssemblyFault(listener: (fault: {
        topic: string;
        subscriptionId: string;
        reasonCode?: string;
        deliveryKind?: TopicFrameDeliveryKind;
    }) => void): () => void;
    onRuntimeRestart(listener: () => void): () => void;
    onRuntimeLifecycle?: (listener: (state: "available" | "unavailable") => void) => () => void;
}
export interface AgentSessionsIndexTransportTarget {
    workspacePath: string;
    workspaceIdentity?: string;
}
type SessionsIndexV4AgentService = Pick<IZCodeAgentService, "subscribeSessionsIndexV4" | "resyncSessionsIndexV4" | "unsubscribeSessionsIndexV4" | "onDynamicSessionsIndexFrame" | "onAgentRuntimeRestarted"> & Partial<Pick<IZCodeAgentService, "helloConversationV4" | "initializeConversationV4" | "onAgentRuntimeLifecycle">>;
/** 一条 host 连接（= 一个 workspace）上的 sessions-index 传输面。 */
export declare function createAgentSessionsIndexTransport(agentService: SessionsIndexV4AgentService, target: AgentSessionsIndexTransportTarget): SessionsIndexTransport;
export {};
//# sourceMappingURL=agentSessionsIndexTransport.d.ts.map