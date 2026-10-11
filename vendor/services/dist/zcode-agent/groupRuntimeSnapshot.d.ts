import { type ConversationSnapshot, type SessionControl } from "@zcode/shared/zcode-protocol-v4";
import type { IZCodeAgentService, ZCodeAgentSessionTarget } from "#src/zcode-agent/zcodeAgent.js";
/** Bot 控制操作临时读取 CLI 权威快照，不建立第二份输入队列。 */
export declare function readBotGroupRuntimeSnapshot(agent: IZCodeAgentService, target: ZCodeAgentSessionTarget): Promise<ConversationSnapshot>;
/** 只观察同一订阅的连续控制状态；停止 ACK 不是终态证据。 */
export declare function waitBotGroupExecutionEnd(agent: IZCodeAgentService, target: ZCodeAgentSessionTarget, executionId: string, signal?: AbortSignal): Promise<SessionControl>;
//# sourceMappingURL=groupRuntimeSnapshot.d.ts.map