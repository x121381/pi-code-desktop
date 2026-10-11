import type { BotConfig, BotServiceStatus } from "@zcode/shared";
import type { BindCodeState, FeishuRegistrationState, WeixinRegistrationState } from "./shared.js";
export declare function ProviderSettingsCard({ bot, runtime, credentialValue, bindCode, bindExpired, bindRemainingMs, bindCountdownProgress, feishuRegistration, feishuRegistrationLoading, weixinRegistration, weixinRegistrationLoading, weixinActivated, secretSaving, onCredentialValueChange, onSaveSecret, onRemoveSecret, onOpenTelegramBotFather, onStartWeixinRegistration, onStartFeishuRegistration, onCreateBindCode, onUnbind, onCopyBindCommand, }: {
    bot: BotConfig;
    runtime: BotServiceStatus["botRuntime"][number] | undefined;
    credentialValue: string;
    bindCode: BindCodeState | null;
    bindExpired: boolean;
    bindRemainingMs: number;
    bindCountdownProgress: number;
    feishuRegistration: FeishuRegistrationState | null;
    feishuRegistrationLoading: boolean;
    weixinRegistration: WeixinRegistrationState | null;
    weixinRegistrationLoading: boolean;
    weixinActivated: boolean;
    secretSaving: boolean;
    onCredentialValueChange: (value: string) => void;
    onSaveSecret: () => void;
    onRemoveSecret: () => void;
    onOpenTelegramBotFather: () => void;
    onStartWeixinRegistration: () => void;
    onStartFeishuRegistration: () => void;
    onCreateBindCode: () => void;
    onUnbind: () => void;
    onCopyBindCommand: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ProviderSettingsCard.d.ts.map