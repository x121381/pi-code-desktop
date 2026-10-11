import { type BotActor, type BotConfig, type BotProvider, type BotsConfigFile } from "@zcode/shared";
export declare function getContextKey(bot: Pick<BotConfig, "id">): string;
export declare function findBot(config: BotsConfigFile, botId: string): BotConfig | null;
export declare function findCallbackBot(config: BotsConfigFile, provider: BotProvider, payload: unknown): BotConfig | null;
export declare function findAuthorizedBot(config: BotsConfigFile, actor: BotActor): BotConfig | null;
export declare function findBoundUser(bot: BotConfig, actor: BotActor): BotConfig | null;
export declare function normalizeBotConfig(bot: BotConfig): BotConfig;
export declare function isUserCommandAllowed(bot: BotConfig, requestedCommand: "help" | "status" | "new" | "reconnect" | "workspace" | "model" | "mode" | "thoughtLevel" | "task" | "reply" | "stop" | "message" | "approve"): boolean;
export declare function normalizeConfigBots(config: BotsConfigFile): BotsConfigFile;
//# sourceMappingURL=botConfigHelpers.d.ts.map