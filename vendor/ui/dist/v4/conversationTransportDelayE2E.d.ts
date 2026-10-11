import type { CommandAck, CommandEnvelope } from "@zcode/shared/zcode-protocol-v4";
/** 仅 E2E build 的公开传输 seam 故障注入；只延迟真实命令/ACK，不伪造事件。 */
export declare function sendWithConversationDelayE2E(envelope: CommandEnvelope, send: () => Promise<CommandAck>): Promise<CommandAck>;
//# sourceMappingURL=conversationTransportDelayE2E.d.ts.map