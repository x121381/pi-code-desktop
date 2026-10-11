import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLayoutEffect, useRef, useState } from "react";
import { Clock3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select.js";
import { Switch } from "@/components/ui/switch.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { SettingsGroupCard, SettingsRow, } from "@/settings/SettingsPageParts.js";
import { getBotReplyGranularitiesForProvider, getBotReplyGranularityEntryForProvider, } from "@/botsUi.js";
import { cn } from "@/components/lib/utils.js";
import { ProviderIcon, runtimeDot, runtimeText } from "./shared.js";
export function BotSummaryCard({ bot, runtime, selectedBotDisplayName, selectedBotName, fallbackBotName, renaming, onStartRename, onCommitNameDraft, onNameDraftChange, onNameCompositionEnd, onNameCompositionStart, onNameInputKeyDown, onPatchBot, }) {
    const { intl } = useZCodeIntl();
    const nameMeasureButtonRef = useRef(null);
    const [nameEditorWidth, setNameEditorWidth] = useState(null);
    const isBound = Boolean(bot.providerUserId);
    // 修复原因：连接失败会直接阻断 /bind，不能再用“未绑定”覆盖真正的阻塞状态。
    const summaryStatusText = runtime?.status === "error"
        ? intl.formatMessage({
            id: bot.provider === "feishu"
                ? "bots.runtime.feishuConnectionFailed"
                : bot.provider === "lark"
                    ? "bots.runtime.larkConnectionFailed"
                    : "bots.runtime.connectionFailed",
        })
        : isBound
            ? runtimeText(runtime, bot.enabled, (id) => intl.formatMessage({ id }))
            : intl.formatMessage({ id: "bots.unbound" });
    const nameEditorText = selectedBotName || fallbackBotName;
    useLayoutEffect(() => {
        if (!renaming) {
            setNameEditorWidth(null);
            return undefined;
        }
        const measureButton = nameMeasureButtonRef.current;
        if (!measureButton) {
            return undefined;
        }
        const updateWidth = () => {
            setNameEditorWidth(Math.ceil(measureButton.getBoundingClientRect().width));
        };
        updateWidth();
        const resizeObserver = new ResizeObserver(updateWidth);
        resizeObserver.observe(measureButton);
        return () => resizeObserver.disconnect();
    }, [nameEditorText, renaming]);
    const botNameControl = (_jsx("div", { className: "min-w-0", children: renaming ? (_jsxs("label", { className: "relative inline-block min-w-6 max-w-md align-middle", style: nameEditorWidth ? { width: `${nameEditorWidth}px` } : undefined, children: [_jsx("span", { className: "sr-only", children: intl.formatMessage({ id: "bots.name" }) }), _jsx("button", { ref: nameMeasureButtonRef, type: "button", tabIndex: -1, "aria-hidden": "true", className: "pointer-events-none absolute left-0 top-0 invisible max-w-md overflow-hidden rounded-sm px-1 text-left text-ui-lg font-medium", 
                    // 隐藏测量节点默认会折叠首尾空格，导致输入名称带空格时宽度偏小；保留空白才能和 input 的实际内容宽度一致。
                    style: { whiteSpace: "pre" }, children: nameEditorText }), _jsx("input", { autoFocus: true, className: "w-full min-w-0 truncate rounded-sm border-0 bg-transparent px-1 py-0 text-left text-ui-lg font-medium leading-normal text-foreground outline-none hover:bg-hover focus-visible:ring-1 focus-visible:ring-input-border-focused", value: selectedBotName, onBlur: onCommitNameDraft, onChange: (event) => onNameDraftChange(event.target.value), onCompositionEnd: onNameCompositionEnd, onCompositionStart: onNameCompositionStart, onFocus: (event) => event.currentTarget.select(), onKeyDown: onNameInputKeyDown, placeholder: fallbackBotName })] })) : (_jsx("button", { type: "button", className: "min-w-0 max-w-md truncate rounded-sm px-1 text-left text-ui-lg font-medium hover:bg-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-input-border-focused", onClick: onStartRename, onKeyDown: (event) => {
                if (event.key === "Enter") {
                    onStartRename();
                }
            }, children: selectedBotDisplayName })) }));
    const botIdentityDescription = (_jsxs("span", { className: "inline-flex items-center gap-2 text-foreground-subtle", children: [isBound || runtime?.status === "error" ? (_jsx("span", { className: cn("size-1.5 rounded-full", runtimeDot(runtime, bot.enabled)) })) : (_jsx(Clock3, { className: "size-3 text-foreground-subtle" })), summaryStatusText] }));
    return (_jsxs("div", { className: "flex items-center gap-3 pb-2 px-2", children: [_jsx(ProviderIcon, { provider: bot.provider, className: "size-12 shrink-0 text-foreground-subtle" }), _jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [botNameControl, botIdentityDescription] }), _jsx("div", { className: "shrink-0", children: _jsx(Switch, { checked: bot.enabled, onCheckedChange: (enabled) => onPatchBot({ enabled }) }) })] }));
}
export function BotReplyGranularityCard({ bot, onPatchBot, }) {
    const { intl } = useZCodeIntl();
    const replyGranularities = getBotReplyGranularitiesForProvider(bot.provider);
    const selectedGranularity = getBotReplyGranularityEntryForProvider(bot.provider, bot.replyMode);
    return (_jsx(SettingsRow, { label: intl.formatMessage({ id: "bots.replyGranularity" }), description: intl.formatMessage({
            id: selectedGranularity.descriptionId,
        }), control: _jsxs(Select, { value: selectedGranularity.id, onValueChange: (replyMode) => onPatchBot({ replyMode: replyMode }), children: [_jsx(SelectTrigger, { size: "lg", className: "w-48 justify-between", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: replyGranularities.map((granularity) => (_jsx(SelectItem, { value: granularity.id, children: intl.formatMessage({ id: granularity.labelId }) }, granularity.id))) })] }) }));
}
export function BotDangerCard({ onDelete }) {
    const { intl } = useZCodeIntl();
    return (_jsx(SettingsGroupCard, { children: _jsx(SettingsRow, { label: intl.formatMessage({ id: "bots.delete" }), description: intl.formatMessage({ id: "bots.delete.description" }), control: _jsxs(Button, { variant: "destructive", size: "lg", onClick: onDelete, title: intl.formatMessage({ id: "bots.delete" }), children: [_jsx(Trash2, { className: "size-4" }), intl.formatMessage({ id: "bots.delete" })] }) }) }));
}
//# sourceMappingURL=BotSummaryCard.js.map