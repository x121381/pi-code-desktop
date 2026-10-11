import { type ZCodeTaskRuntimeStatus, type BotTaskBroadcastPayload } from "@zcode/shared";
import type { BroadcastMessage } from "@zcode/services";
import type { WindowTabState } from "@/store/tabStore.js";
export declare function resolveBotTaskBroadcastRefresh(message: BroadcastMessage, tabs: WindowTabState[]): BotTaskBroadcastPayload | null;
export declare function resolveBotTaskBroadcastRuntimeStatus(event: BotTaskBroadcastPayload["event"]): ZCodeTaskRuntimeStatus;
//# sourceMappingURL=botsTaskBroadcast.d.ts.map