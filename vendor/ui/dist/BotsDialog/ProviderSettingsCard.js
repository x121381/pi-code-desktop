import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable max-lines -- ProviderSettingsCard 集中维护 Bot 凭据、二维码和绑定状态机展示；后续拆分 provider 子组件后移除。 */
import { CircleAlert, Clock3, Copy, ExternalLink, KeyRound, LoaderCircle, QrCode, Unlink, } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { isFeishuBotProvider } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { SettingsGroupCard, SettingsRow } from "@/settings/SettingsPageParts.js";
import { cn } from "@/components/lib/utils.js";
import { logger } from "@/logger.js";
import { PrivateDeliveryRetry } from "@/BotsDialog/PrivateDeliveryRetry.js";
import { TELEGRAM_BOTFATHER_URL, formatBindCountdown } from "./shared.js";
function DetailPanel({ children }) {
    return _jsx("div", { className: "rounded-lg bg-background p-3", children: children });
}
function TelegramBotFatherQrPanel({ credentialValue, secretSaving, onCredentialValueChange, onSaveSecret, }) {
    const { intl } = useZCodeIntl();
    const [qrDataUrl, setQrDataUrl] = useState(null);
    useEffect(() => {
        let cancelled = false;
        void QRCode.toDataURL(TELEGRAM_BOTFATHER_URL, {
            margin: 1,
            width: 220,
        })
            .then((dataUrl) => {
            if (!cancelled) {
                setQrDataUrl(dataUrl);
            }
        })
            .catch((error) => {
            logger.error("[BotsDialog] 生成 Telegram BotFather 二维码失败", error instanceof Error ? error.message : String(error));
        });
        return () => {
            cancelled = true;
        };
    }, []);
    return (_jsx(DetailPanel, { children: _jsxs("div", { className: "flex flex-wrap items-start justify-center gap-4", children: [qrDataUrl ? (_jsx("img", { src: qrDataUrl, alt: intl.formatMessage({ id: "bots.telegramBotFatherQrAlt" }), className: "size-40 shrink-0 rounded-lg border border-border bg-surface p-2" })) : null, _jsxs("div", { className: "min-w-52 flex-1 space-y-3 text-ui-base text-foreground-subtle", children: [_jsx("div", { children: intl.formatMessage({ id: "bots.telegramBotFatherScanHint" }) }), _jsx("div", { className: "rounded-md bg-surface px-2 py-1 font-mono text-foreground", children: "@BotFather" }), _jsxs("div", { className: "flex w-full min-w-0 items-center gap-2", children: [_jsx(Input, { size: "lg", type: "password", value: credentialValue, onChange: (event) => onCredentialValueChange(event.target.value), placeholder: intl.formatMessage({
                                        id: "bots.credentialPlaceholder",
                                    }), className: "min-w-0 flex-1", disabled: secretSaving }), _jsxs(Button, { variant: "outline", size: "lg", onClick: onSaveSecret, disabled: secretSaving || !credentialValue.trim(), children: [secretSaving ? (_jsx(LoaderCircle, { className: "size-4 animate-spin" })) : (_jsx(KeyRound, { className: "size-4" })), intl.formatMessage({ id: "bots.saveSecret" })] })] })] })] }) }));
}
export function ProviderSettingsCard({ bot, runtime, credentialValue, bindCode, bindExpired, bindRemainingMs, bindCountdownProgress, feishuRegistration, feishuRegistrationLoading, weixinRegistration, weixinRegistrationLoading, weixinActivated, secretSaving, onCredentialValueChange, onSaveSecret, onRemoveSecret, onOpenTelegramBotFather, onStartWeixinRegistration, onStartFeishuRegistration, onCreateBindCode, onUnbind, onCopyBindCommand, }) {
    const { intl } = useZCodeIntl();
    if (bot.provider === "webhook") {
        return null;
    }
    const hasSecret = Boolean(bot.credentialRef);
    const isFeishuLike = isFeishuBotProvider(bot.provider);
    const isWeixin = bot.provider === "weixin";
    const isConnected = isWeixin ? hasSecret : Boolean(bot.providerUserId);
    const hasRuntimeError = runtime?.status === "error";
    const descriptionText = isFeishuLike && hasRuntimeError
        ? intl.formatMessage({
            id: isConnected
                ? "bots.runtime.boundConnectionInterruptedDescription"
                : "bots.runtime.credentialsSavedConnectionFailedDescription",
        })
        : intl.formatMessage({
            id: `bots.botTokenDescription.${bot.provider}`,
        });
    const hasActiveFeishuRegistration = feishuRegistration?.botId === bot.id;
    const hasActiveWeixinRegistration = weixinRegistration?.botId === bot.id;
    const showBindCode = bindCode?.botId === bot.id;
    let control = null;
    let detail = null;
    if (isConnected) {
        control = (_jsxs("div", { className: "flex items-center justify-end gap-3", children: [_jsxs("span", { className: "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-ui-base text-foreground-subtle", children: [_jsx("span", { className: cn("size-2 rounded-full", hasRuntimeError ? "bg-destructive" : "bg-success") }), intl.formatMessage({
                            id: hasRuntimeError ? "bots.runtime.boundConnectionInterrupted" : "bots.connected",
                        })] }), _jsxs(Button, { variant: "outline", size: "lg", onClick: isWeixin ? onRemoveSecret : onUnbind, children: [_jsx(Unlink, { className: "size-4" }), intl.formatMessage({ id: "bots.unbind" })] })] }));
        if (isWeixin && !weixinActivated) {
            detail = (_jsx(DetailPanel, { children: _jsx("div", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "bots.weixinActivationHint" }) }) }));
        }
    }
    else if (bot.provider === "telegram" && !hasSecret) {
        control = (_jsxs(Button, { variant: "outline", size: "lg", onClick: onOpenTelegramBotFather, children: [_jsx(ExternalLink, { className: "size-4" }), intl.formatMessage({ id: "bots.openBotFather" })] }));
        detail = (_jsx(TelegramBotFatherQrPanel, { credentialValue: credentialValue, secretSaving: secretSaving, onCredentialValueChange: onCredentialValueChange, onSaveSecret: onSaveSecret }));
    }
    else if ((isFeishuLike && !hasSecret) || (isWeixin && !hasSecret)) {
        const loading = isWeixin ? weixinRegistrationLoading : feishuRegistrationLoading;
        control = (_jsxs(Button, { variant: "outline", size: "lg", onClick: isWeixin ? onStartWeixinRegistration : onStartFeishuRegistration, disabled: loading, children: [loading ? _jsx(LoaderCircle, { className: "size-4 animate-spin" }) : _jsx(QrCode, { className: "size-4" }), intl.formatMessage({ id: "bots.scanQrCode" })] }));
    }
    else {
        control = (_jsxs("div", { className: "flex w-full flex-wrap justify-end gap-2", children: [!showBindCode && !hasRuntimeError ? (_jsx(Button, { variant: "outline", size: "lg", onClick: onCreateBindCode, children: intl.formatMessage({ id: "bots.bind" }) })) : null, _jsx(Button, { variant: "outline", size: "lg", onClick: onRemoveSecret, children: intl.formatMessage({ id: "bots.removeSecret" }) })] }));
    }
    if (isFeishuLike && hasRuntimeError) {
        const errorCode = runtime.message?.match(/\b\d{7,}\b/)?.[0];
        detail = (_jsx(DetailPanel, { children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CircleAlert, { className: "mt-0.5 size-4 shrink-0 text-destructive" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({
                                    id: isConnected
                                        ? bot.provider === "lark"
                                            ? "bots.runtime.larkConnectionInterrupted"
                                            : "bots.runtime.feishuConnectionInterrupted"
                                        : bot.provider === "lark"
                                            ? "bots.runtime.cannotConnectLark"
                                            : "bots.runtime.cannotConnectFeishu",
                                }) }), _jsx("div", { className: "mt-1 text-ui-base leading-5 text-foreground-subtle", children: intl.formatMessage({
                                    id: isConnected
                                        ? bot.provider === "lark"
                                            ? "bots.runtime.larkConnectionRecoverySuggestion"
                                            : "bots.runtime.feishuConnectionRecoverySuggestion"
                                        : "bots.runtime.connectionBlocksBinding",
                                }) }), _jsxs("dl", { className: "mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-ui-base leading-5", children: [errorCode ? (_jsxs(_Fragment, { children: [_jsx("dt", { className: "text-foreground-subtle", children: intl.formatMessage({ id: "bots.runtime.errorCode" }) }), _jsx("dd", { className: "min-w-0 break-all font-mono text-foreground", children: errorCode })] })) : null, _jsx("dt", { className: "text-foreground-subtle", children: intl.formatMessage({ id: "bots.runtime.errorDetail" }) }), _jsx("dd", { className: "min-w-0 break-words text-foreground", children: runtime.message ?? intl.formatMessage({ id: "bots.runtime.unknownError" }) })] })] })] }) }));
    }
    else if (showBindCode) {
        const bindCommand = `/bind ${bindCode.code}`;
        detail = (_jsxs(DetailPanel, { children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "bots.bindCommand" }) }), _jsx("div", { className: "mt-1 text-ui-base leading-5 text-foreground-subtle", children: intl.formatMessage({ id: "bots.bindCommandGuide" }) })] }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: onCreateBindCode, children: [_jsx(QrCode, { className: "size-3" }), intl.formatMessage({ id: "bots.setup.refreshBindCode" })] })] }), _jsxs("div", { className: "mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md bg-surface px-2 py-1.5", children: [_jsx("span", { className: cn("min-w-0 break-all font-mono text-ui-base leading-5", bindExpired ? "text-foreground-subtle" : "text-foreground"), children: bindCommand }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: onCopyBindCommand, disabled: bindExpired, title: intl.formatMessage({ id: "bots.copyBindCommand" }), children: [_jsx(Copy, { className: "size-4" }), intl.formatMessage({ id: "bots.copyBindCommand" })] })] }), _jsxs("ol", { className: "mt-2 list-decimal space-y-1 pl-4 text-ui-base leading-5 text-foreground-subtle", children: [_jsx("li", { children: intl.formatMessage({ id: "bots.bindCommandStep.copy" }) }), _jsx("li", { children: intl.formatMessage({ id: "bots.bindCommandStep.openChat" }) }), _jsx("li", { children: intl.formatMessage({ id: "bots.bindCommandStep.send" }) })] }), _jsxs("div", { className: "mt-2 flex items-center gap-2 text-ui-base text-foreground-subtle", children: [_jsx(Clock3, { className: "size-3" }), bindExpired
                            ? intl.formatMessage({ id: "bots.bindCodeExpired" })
                            : intl.formatMessage({ id: "bots.bindCodeExpires" }, { time: formatBindCountdown(bindRemainingMs) })] }), _jsx("div", { className: "mt-2 h-1 overflow-hidden rounded-full bg-surface", children: _jsx("div", { className: cn("h-full origin-left rounded-full transition-transform duration-300 ease-linear", bindExpired
                            ? "bg-border"
                            : bindCountdownProgress <= 10
                                ? "bg-destructive"
                                : bindRemainingMs <= 10_000
                                    ? "bg-warning"
                                    : "bg-primary"), style: { transform: `scaleX(${bindCountdownProgress / 100})` } }, bindCode.code) })] }));
    }
    else if (hasActiveFeishuRegistration) {
        detail = (_jsx(DetailPanel, { children: _jsxs("div", { className: "flex flex-wrap items-start justify-center gap-4", children: [feishuRegistration.qrDataUrl ? (_jsx("img", { src: feishuRegistration.qrDataUrl, alt: intl.formatMessage({ id: "bots.feishuRegistrationQrAlt" }), className: "size-40 shrink-0 rounded-lg border border-border bg-surface p-2" })) : null, _jsxs("div", { className: "min-w-52 flex-1 space-y-3 text-ui-base text-foreground-subtle", children: [_jsx("div", { children: intl.formatMessage({
                                    id: `bots.feishuRegistrationScanHint.${feishuRegistration.domain}`,
                                }) }), _jsx("div", { className: "rounded-md bg-surface px-2 py-1 font-mono text-foreground", children: feishuRegistration.userCode }), _jsx("div", { children: feishuRegistration.status === "pending" ? (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(LoaderCircle, { className: "size-3 animate-spin" }), intl.formatMessage({ id: "common.loading" })] })) : ((feishuRegistration.message ??
                                    intl.formatMessage({
                                        id: `bots.feishuRegistration.${feishuRegistration.status}`,
                                    }))) })] })] }) }));
    }
    else if (hasActiveWeixinRegistration) {
        detail = (_jsx(DetailPanel, { children: _jsxs("div", { className: "flex flex-wrap items-start justify-center gap-4", children: [weixinRegistration.qrDataUrl ? (_jsx("img", { src: weixinRegistration.qrDataUrl, alt: intl.formatMessage({ id: "bots.weixinRegistrationQrAlt" }), className: "size-40 shrink-0 rounded-lg border border-border bg-surface p-2" })) : null, _jsxs("div", { className: "min-w-52 flex-1 space-y-3 text-ui-base text-foreground-subtle", children: [_jsx("div", { children: intl.formatMessage({ id: "bots.weixinRegistrationScanHint" }) }), _jsx("div", { children: weixinRegistration.status === "pending" ||
                                    weixinRegistration.status === "scanned" ? (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(LoaderCircle, { className: "size-3 animate-spin" }), intl.formatMessage({
                                            id: `bots.weixinRegistration.${weixinRegistration.status}`,
                                        })] })) : ((weixinRegistration.message ??
                                    intl.formatMessage({
                                        id: `bots.weixinRegistration.${weixinRegistration.status}`,
                                    }))) })] })] }) }));
    }
    return (_jsx(SettingsGroupCard, { children: _jsx(SettingsRow, { label: intl.formatMessage({ id: "bots.botToken" }), description: descriptionText, control: control, detail: bot.enabled && runtime?.deliveryError ? (_jsxs(_Fragment, { children: [_jsx(DetailPanel, { children: _jsxs("div", { role: "alert", className: "min-w-0 space-y-2 text-ui-base", children: [_jsx("div", { className: "font-medium text-destructive", children: intl.formatMessage({ id: "bots.runtime.deliveryFailed" }) }), _jsx("div", { className: "text-foreground-subtle", children: intl.formatMessage({ id: "bots.runtime.deliveryFailedDescription" }) }), _jsx("div", { className: "whitespace-pre-wrap break-all text-foreground-subtle", children: runtime.deliveryError }), runtime.deliveryRetryId ? (_jsx(PrivateDeliveryRetry, { botId: bot.id, deliveryId: runtime.deliveryRetryId }, runtime.deliveryRetryId)) : null] }) }), detail] })) : (detail) }) }));
}
//# sourceMappingURL=ProviderSettingsCard.js.map