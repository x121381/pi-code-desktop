import type { Event } from "@zcode/rpc";
import type { ConversationTelemetryFact } from "@zcode/shared/zcode-protocol-v4";
import type { IZCodeAgentService } from "#src/zcode-agent/zcodeAgent.js";
export interface ConversationTelemetryWorkspaceTarget {
    workspacePath: string;
    workspaceIdentity?: string;
}
/**
 * 对话埋点的 workspace 级只读服务面。它只包装已完成 clientMode 鉴权的 connection-scoped
 * agent service，不另开 RPC channel，也不让 Web/mobile 绕过 desktop-continuous 门禁。
 */
export interface IConversationTelemetryService {
    onFact(target: ConversationTelemetryWorkspaceTarget): Event<ConversationTelemetryFact>;
}
export declare function createConversationTelemetryService(zcodeAgentService: Pick<IZCodeAgentService, "onDynamicConversationTelemetryFact">): IConversationTelemetryService;
//# sourceMappingURL=conversationTelemetry.d.ts.map