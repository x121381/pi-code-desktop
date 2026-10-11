import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- 工具展示 */
import { useCallback, useMemo, } from "react";
import { TID_CHAT_MODE_SELECT_ITEM, TID_CHAT_MODE_SELECT_TRIGGER, TID_CHAT_THOUGHT_LEVEL_SELECT_ITEM, TID_CHAT_THOUGHT_LEVEL_SELECT_TRIGGER, testId, } from "@zcode/shared";
import { ControlHintTooltip } from "../ControlHintTooltip.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../components/ui/select.js";
import { isCoarseTouchDevice, shouldRestoreChatInputFocusAfterPickerClose, } from "../lib/pickerFocus.js";
import { cn } from "../components/lib/utils.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { logger } from "../logger.js";
import { ChevronDownIcon, HandIcon, NotepadText, ShieldAlertIcon, ShieldCheckIcon, } from "lucide-react";
import { ZCODE_MODE_OPTION_DESCRIPTION_IDS, ZCODE_MODE_OPTION_LABEL_IDS, } from "./display-help.js";
import { RollingToolbarLabel } from "../chat-input-toolbar/RollingToolbarLabel.js";
export { ChatContextUsage, getContextCompressionCommand, getRenderableTaskUsage, } from "../chat-input-toolbar/contextUsage.js";
/** Radix Select 在受控值与子项注册竞争时可能发出空值等未渲染值；直接上抛会把
 * 系统事件误当成用户选择（如 Automations 编辑页仅打开详情就被标记未保存修改）。
 * 用户只能点到已渲染的 option，值域外的选择回调一律丢弃。 */
export function isConfigSelectValueInOptions(option, value) {
    return option.options?.some((entry) => String(entry.value) === value) ?? false;
}
const HIGH_PERMISSION_MODE_VALUES = new Set([
    "bypassPermissions",
    "full-access",
    // Bugfix: Agent 0.0.44 将旧 full-access mode id 改为 agent-full-access。
    // 高权限视觉提示必须跟随协议 id，否则用户选中全权限后工具栏不再显示 warning 状态。
    "agent-full-access",
    "yolo",
]);
function getConfigSelectTriggerTestId(option) {
    if (option.category === "thought_level") {
        return TID_CHAT_THOUGHT_LEVEL_SELECT_TRIGGER;
    }
    // 模式选择器 e2e 锚点（v4 switchCollaborationMode 链路断言用）。
    if (option.category === "mode") {
        return TID_CHAT_MODE_SELECT_TRIGGER;
    }
    return undefined;
}
function getConfigSelectItemTestId(option, entry) {
    if (option.category === "thought_level") {
        return testId(TID_CHAT_THOUGHT_LEVEL_SELECT_ITEM, entry.value);
    }
    if (option.category === "mode") {
        return testId(TID_CHAT_MODE_SELECT_ITEM, entry.value);
    }
    return undefined;
}
export function buildModelSearchText({ itemName, }) {
    // Bugfix: 需求要求模型搜索仅匹配“展示名”，不能再命中分组名/模型值。
    // 这里统一只返回展示名，保证搜索范围收敛且稳定。
    return itemName.trim();
}
export function matchesModelDisplayNameSearch(modelDisplayName, searchText) {
    const normalizedSearchText = searchText.trim().toLocaleLowerCase();
    if (normalizedSearchText.length === 0) {
        return true;
    }
    // Bugfix: 统一用大小写不敏感匹配，避免用户输入大小写与展示名不一致时搜不到。
    return modelDisplayName
        .trim()
        .toLocaleLowerCase()
        .includes(normalizedSearchText);
}
export function ChatApiRetryStatus({ apiRetry, intl, locale, }) {
    const retryLabel = useMemo(() => {
        if (!apiRetry) {
            return null;
        }
        // 当前 ZCode Agent 只会推送某一刻的 retryDelayMs 快照，不会每秒递减。
        // 继续把这个值渲染成“X 秒后继续”会给用户造成倒计时在卡住的错觉。
        // 这里先收敛成稳定的重试状态文案，只展示第几次重试。
        const formatter = new Intl.NumberFormat(locale);
        return intl.formatMessage({ id: "chat.apiRetryStatus" }, {
            attempt: formatter.format(apiRetry.attempt),
            maxRetries: formatter.format(apiRetry.maxRetries),
        });
    }, [apiRetry, intl, locale]);
    if (!apiRetry || !retryLabel) {
        return null;
    }
    const retryTitle = apiRetry.errorStatus == null
        ? retryLabel
        : `${retryLabel} · HTTP ${apiRetry.errorStatus}`;
    return (_jsx("span", { className: "inline-flex h-7 items-center whitespace-nowrap px-1 text-ui-base", title: retryTitle, children: _jsx("span", { className: "animated-gradient-text animated-gradient-text-subtle font-medium", children: retryLabel }) }));
}
export function getModeOptionDisplayLabel(intl, provider, entry) {
    const labelMessageId = getModeOptionLabelMessageId(provider, entry);
    if (!labelMessageId) {
        return entry.name;
    }
    return intl.formatMessage({ id: labelMessageId });
}
export function getModeOptionLabelMessageId(provider, entry) {
    if (!provider) {
        return null;
    }
    return ZCODE_MODE_OPTION_LABEL_IDS[provider]?.[entry.value] ?? null;
}
export function getModeOptionDescriptionMessageId(provider, entry) {
    if (!provider) {
        return null;
    }
    return ZCODE_MODE_OPTION_DESCRIPTION_IDS[provider]?.[entry.value] ?? null;
}
export function getConfigOptionEntryLabel(intl, provider, option, entry) {
    if (option.category === "mode") {
        return getModeOptionDisplayLabel(intl, provider, entry);
    }
    return entry.name;
}
export function getConfigOptionEntryDescription(intl, provider, option, entry) {
    if (option.category !== "mode") {
        return entry.description;
    }
    const descriptionMessageId = getModeOptionDescriptionMessageId(provider, entry);
    if (descriptionMessageId) {
        return intl.formatMessage({ id: descriptionMessageId });
    }
    return entry.description;
}
export function isHighPermissionModeValue(value) {
    return typeof value === "string" && HIGH_PERMISSION_MODE_VALUES.has(value);
}
export function resolveModeOptionIcon(value) {
    if (isHighPermissionModeValue(value)) {
        return ShieldAlertIcon;
    }
    // Bugfix: build 会被本地化成“默认模式”，和 default 一样应使用常规确认图标。
    if (typeof value === "string" && /^(default|build)$/i.test(value))
        return HandIcon;
    if (typeof value === "string" && value.toLocaleLowerCase() === "plan")
        return NotepadText;
    if (typeof value === "string" &&
        /^(auto|acceptEdits|agent|autoEdit|dontAsk|edit|guarded)$/i.test(value)) {
        return ShieldCheckIcon;
    }
    return HandIcon;
}
export function ConfigSelect({ option, onValueChange, open, onOpenChange, disabled, tooltipTitle, shortcutLabel, triggerRef, triggerClassName, indicatorClassName, triggerVariant = "ghost", triggerSize = "lg", leadingIcon: LeadingIcon, labelVisibilityClassName = "hidden @xl/composer:inline-flex", provider, restoreFocusSelector = '[data-testid="chat-input"]', }) {
    const { intl } = useZCodeIntl();
    // 注意：handleContentKeyDown 必须在 early return 之前调用。
    // 之前 `if (option.type !== "select" ...) return null` 写在 useCallback 之前，
    // 当 option 在 select/非 select 之间切换（或 options 数组从空变非空）时，
    // 本组件这次渲染执行的 hook 数量和上次不一致，React 会抛
    // "Rendered fewer hooks than expected" 导致工具栏区域崩溃。
    // 修复方式：early return 下移到所有 hook 之后，保证 hook 调用顺序稳定。
    const handleContentKeyDown = useCallback((event) => {
        if (event.key !== "Tab") {
            return;
        }
        const highlightedItem = event.currentTarget.querySelector('[data-slot="select-item"][data-highlighted]') ??
            event.currentTarget.querySelector('[data-slot="select-item"][data-state="checked"]') ??
            event.currentTarget.querySelector('[data-slot="select-item"]');
        if (!highlightedItem) {
            return;
        }
        event.preventDefault();
        highlightedItem.click();
    }, []);
    // early return 必须在所有 hook 之后（见上方注释说明的崩溃原因）
    if (option.type !== "select" || !option.options?.length) {
        return null;
    }
    const shouldUseToolbarFloatingSelect = option.category === "mode" || option.category === "thought_level";
    const shouldShowHighPermissionModeIcon = option.category === "mode" &&
        isHighPermissionModeValue(option.currentValue);
    const ResolvedLeadingIcon = option.category === "mode"
        ? resolveModeOptionIcon(option.currentValue)
        : LeadingIcon;
    const resolvedTriggerClassName = cn(triggerClassName, shouldShowHighPermissionModeIcon &&
        // 高权限模式需要在工具栏中持续保持 warning 文字颜色，避免用户忽略当前风险级别。
        // 图标只负责替换为 shield-alert，颜色状态仍由 trigger 统一承载，保证 hover/展开态不闪回默认色。
        "text-warning hover:text-warning aria-expanded:text-warning", 
    // Guarded 与 YOLO 视觉区分；图标继承浅蓝色，hover/展开时也不回退为默认色。
    option.category === "mode" &&
        option.currentValue === "guarded" &&
        "text-icon-blue hover:text-icon-blue aria-expanded:text-icon-blue");
    const resolvedLeadingIconClassName = cn("pointer-events-none size-4 text-current", shouldShowHighPermissionModeIcon && "text-warning");
    const selectContentProps = shouldUseToolbarFloatingSelect
        ? {
            // 聊天工具栏底部的 mode / thought_level 选单如果继续使用默认 item-aligned，
            // 会因为触发器靠近窗口底边而压缩可视高度，导致展开方向和可见区域不一致。
            // 这里统一改成 popper 向上展开，并收敛成一致的 4px 间距，保证两个菜单表现一致。
            position: "popper",
            side: "top",
            align: "start",
            sideOffset: 4,
            collisionPadding: 8,
            className: option.category === "mode" ? "w-64" : undefined,
        }
        : undefined;
    const triggerTestId = getConfigSelectTriggerTestId(option);
    const currentEntry = option.options.find((entry) => entry.value === option.currentValue);
    const currentValueLabel = currentEntry
        ? getConfigOptionEntryLabel(intl, provider, option, currentEntry)
        : option.category === "mode"
            // 隐藏旧模式候选不应丢失其回显文案；只翻译当前值，不把它补回可选列表。
            ? getModeOptionDisplayLabel(intl, provider, {
                value: String(option.currentValue ?? ""),
                name: String(option.currentValue ?? ""),
            })
            : String(option.currentValue ?? "");
    const thoughtLevelTextClassName = option.category === "thought_level" ? "first-letter:uppercase" : undefined;
    return (_jsxs(Select, { open: open, onOpenChange: onOpenChange, value: String(option.currentValue), onValueChange: (value) => {
            // 见 isConfigSelectValueInOptions：值域外的回调来自 Radix 内部竞争，不是用户选择。
            if (!isConfigSelectValueInOptions(option, value)) {
                logger.warn("[ConfigSelect] 忽略值域外的选择回调", {
                    category: option.category,
                    value,
                });
                return;
            }
            onValueChange(value);
        }, disabled: disabled, children: [_jsx(ControlHintTooltip, { title: tooltipTitle, shortcut: shortcutLabel, triggerRef: triggerRef, children: _jsxs(SelectTrigger, { variant: triggerVariant, size: triggerSize, className: resolvedTriggerClassName, indicator: _jsx(ChevronDownIcon, { className: cn("pointer-events-none size-3.5 text-foreground-subtle", indicatorClassName) }), "aria-label": tooltipTitle, "data-testid": triggerTestId, children: [ResolvedLeadingIcon ? (_jsx(ResolvedLeadingIcon, { className: resolvedLeadingIconClassName })) : null, _jsx("span", { className: labelVisibilityClassName, children: option.category === "mode" ? (_jsx(RollingToolbarLabel, { label: currentValueLabel })) : (_jsx(SelectValue, { children: _jsx("span", { className: thoughtLevelTextClassName, children: currentValueLabel }) })) })] }) }), _jsx(SelectContent, { ...selectContentProps, onKeyDown: handleContentKeyDown, onCloseAutoFocus: (event) => {
                    if (!restoreFocusSelector) {
                        // Automations 权限选择器没有聊天输入框可恢复；之前无条件
                        // preventDefault 会把 Radix 默认的“回焦到 trigger”一并吃掉，键盘焦点
                        // 关闭菜单后掉到 body。null 时保留默认行为，让焦点回到触发器。
                        return;
                    }
                    event.preventDefault();
                    if (!shouldRestoreChatInputFocusAfterPickerClose({
                        isCoarseTouchDevice: isCoarseTouchDevice(),
                    })) {
                        return;
                    }
                    // Bugfix: ConfigSelect 被 Bot 弹窗复用时，关闭菜单不能强制抢焦点到聊天输入框。
                    const input = document.querySelector(restoreFocusSelector);
                    logger.debug("[ConfigSelect] picker focus handoff", {
                        category: option.category,
                        restoreFocusSelector,
                        targetFound: Boolean(input),
                    });
                    input?.focus();
                }, children: option.category === "mode"
                    ? option.options.map((entry) => {
                        const ModeIcon = resolveModeOptionIcon(entry.value);
                        const optionLabel = getConfigOptionEntryLabel(intl, provider, option, entry);
                        const optionDescription = getConfigOptionEntryDescription(intl, provider, option, entry);
                        return (_jsx(SelectItem, { value: entry.value, className: "min-h-13 items-start gap-3 py-2 pl-2 pr-8", "data-testid": getConfigSelectItemTestId(option, entry), children: _jsxs("span", { className: "flex min-w-0 items-start gap-3", children: [_jsx(ModeIcon, { className: "mt-0.5 size-4.5 shrink-0 text-foreground" }), _jsxs("span", { className: "flex min-w-0 flex-col gap-0.5", children: [_jsx("span", { className: "truncate text-ui-base/relaxed text-foreground", children: optionLabel }), optionDescription?.trim() ? (_jsx("span", { className: "line-clamp-2 text-ui-sm/relaxed text-foreground-subtle whitespace-nowrap", children: optionDescription })) : null] })] }) }, entry.value));
                    })
                    : option.options.map((entry) => (_jsx(SelectItem, { value: entry.value, "data-testid": getConfigSelectItemTestId(option, entry), children: _jsx("span", { className: thoughtLevelTextClassName, children: getConfigOptionEntryLabel(intl, provider, option, entry) }) }, entry.value))) })] }));
}
//# sourceMappingURL=display.js.map