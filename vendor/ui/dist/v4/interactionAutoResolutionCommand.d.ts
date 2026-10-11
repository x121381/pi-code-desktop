import type { CommandAck, CommandEnvelope } from "@zcode/shared/zcode-protocol-v4";
type SendCommand = (envelope: CommandEnvelope) => Promise<CommandAck>;
/** AskUserQuestion 弹窗和侧栏胶囊共用同一条幂等暂停命令。 */
export declare function sendInteractionAutoResolutionSnooze(params: {
    sessionId: string;
    interactionId: string;
    sendCommand: SendCommand;
    source: "dialog" | "taskBadge";
    onCommandSettled?: (commandId: string) => void;
}): Promise<boolean>;
export {};
//# sourceMappingURL=interactionAutoResolutionCommand.d.ts.map