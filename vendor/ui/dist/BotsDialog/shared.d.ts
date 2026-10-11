import type { BotConfig, BotServiceStatus } from "@zcode/shared";
import type { BotProviderEntryId } from "@/botsUi.js";
export type BindCodeState = {
    botId: string;
    code: string;
    createdAt: number;
    expiresAt: number;
    ttlMs: number;
};
export type FeishuRegistrationState = {
    botId: string;
    deviceCode: string;
    qrUrl: string;
    qrDataUrl: string | null;
    userCode: string;
    interval: number;
    expiresAt: number;
    domain: "feishu" | "lark";
    pollDomain?: "feishu" | "lark";
    status: "pending" | "success" | "access_denied" | "expired" | "error";
    message?: string;
};
export type WeixinRegistrationState = {
    botId: string;
    qrCode: string;
    qrUrl: string;
    qrDataUrl: string | null;
    interval: number;
    expiresAt: number;
    status: "pending" | "scanned" | "success" | "expired" | "error";
    message?: string;
};
export declare const BIND_CODE_TTL_MS = 30000;
export declare const TELEGRAM_BOTFATHER_URL = "https://t.me/BotFather";
export declare function isAllWorkspacesAllowed(allowedWorkspaces: readonly string[]): boolean;
export declare function formatBotDisplayName(name: string, fallbackName: string): string;
export declare function ProviderIcon({ provider, className, }: {
    provider?: BotProviderEntryId | "new";
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function runtimeText(runtime: BotServiceStatus["botRuntime"][number] | undefined, enabled: boolean, formatRuntimeMessage?: (id: string) => string): string;
export declare function runtimeDot(runtime: BotServiceStatus["botRuntime"][number] | undefined, enabled: boolean): string;
export declare function formatBindCountdown(ms: number): string;
export declare function createDefaultCommands(): BotConfig["allowedCommands"];
//# sourceMappingURL=shared.d.ts.map