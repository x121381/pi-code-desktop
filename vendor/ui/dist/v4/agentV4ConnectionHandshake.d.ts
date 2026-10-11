import type { IZCodeAgentService } from "@zcode/services";
import { type HelloMessage } from "@zcode/shared/zcode-protocol-v4";
type AgentV4HandshakeService = Pick<IZCodeAgentService, "helloConversationV4" | "initializeConversationV4">;
export declare function ensureAgentV4ConnectionHandshake(service: AgentV4HandshakeService): Promise<HelloMessage>;
export {};
//# sourceMappingURL=agentV4ConnectionHandshake.d.ts.map