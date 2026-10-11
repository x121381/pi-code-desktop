import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Keyboard, Pencil, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { Kbd, KbdGroup } from "../components/ui/kbd.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { formatShortcutBindingLabelParts } from "../shortcuts/label.js";
/**
 * 快捷键设置页的命令行：左列命令名跨全部绑定垂直居中，右列是该命令的
 * 绑定列表——每条一行：逐键键帽 + 铅笔（点击即替换该条录制）；录制态内嵌在对应
 * 条目位置。暂不支持新增/删除绑定（仅替换），操作列为「清空全部」垃圾桶。
 */
export function ShortcutBindingRow({ entry, commandLabel, bindings, isOverridden, isRecording, recording, menuChannelUnavailable, onRecord, onSteal, onClearAll, }) {
    const { intl } = useZCodeIntl();
    const conflictBinding = isRecording ? recording?.conflictBinding : null;
    // 录制内嵌块：出现在被替换条目 / 追加条目的位置（预览 kbd 抢占焦点）
    function renderRecorder() {
        return (_jsxs("span", { className: "flex min-w-0 flex-col gap-1", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Keyboard, { className: "size-4 text-foreground-subtle" }), _jsx("kbd", { ref: (el) => {
                                // 录制开始即抢占焦点：把焦点从可编辑元素（如上方搜索框）里拉出来，
                                // 否则中文 IME 会把 Shift+字母吞成组合输入，录制器只能收到
                                // isComposing/229 噪声事件，看起来就是「识别不了 Shift 组合」。
                                el?.focus();
                            }, tabIndex: -1, className: "w-fit rounded-md bg-surface px-2 py-1 font-mono text-ui-sm outline-none", children: recording?.preview ?? intl.formatMessage({ id: "settings.shortcuts.recording" }) })] }), recording?.error ? (_jsx("span", { className: "text-ui-sm text-destructive", "data-testid": `settings-shortcut-error-${entry.id}`, children: recording.error })) : (_jsx("span", { className: "text-ui-xs text-foreground-subtlest", children: intl.formatMessage({ id: "settings.shortcuts.recordingHint" }) })), conflictBinding ? (_jsx(Button, { variant: "outline", size: "xs", className: "w-fit", "data-testid": `settings-shortcut-steal-${entry.id}`, onClick: () => onSteal(conflictBinding), children: intl.formatMessage({ id: "settings.shortcuts.stealConfirm" }) })) : null] }));
    }
    /**
     * 单条绑定行：逐键键帽（shadcn Kbd 同款，h-5/min-w-5 居中，符号与字母尺寸一致）+
     * 铅笔（点击键帽或铅笔即替换该条）。键帽只覆盖文字色（自定义 = 品牌色），不传 bg：
     * bg-inherit 会经 cn 的 tailwind-merge 覆盖 Kbd 基类 bg-muted 且祖先链全透明，
     * 芯片底色会消失。
     */
    function renderBinding(binding, index) {
        return (_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("button", { type: "button", disabled: menuChannelUnavailable, className: "w-fit rounded-lg px-0 py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-60", "aria-label": intl.formatMessage({ id: "settings.shortcuts.rebindAria" }, { command: commandLabel }), "data-testid": `settings-shortcut-bind-${entry.id}-${index}`, onClick: () => onRecord(index), children: _jsx(KbdGroup, { children: formatShortcutBindingLabelParts(binding).map((part, partIndex) => (_jsx(Kbd, { className: isOverridden ? "text-brand" : undefined, children: part }, `${part}-${partIndex}`))) }) }), _jsx(Button, { variant: "ghost", size: "icon-sm", disabled: menuChannelUnavailable, "aria-label": intl.formatMessage({ id: "settings.shortcuts.rebindAria" }, { command: commandLabel }), "data-testid": `settings-shortcut-edit-${entry.id}-${index}`, onClick: () => onRecord(index), children: _jsx(Pencil, { className: "size-3.5" }) })] }, binding));
    }
    return (_jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_80px_72px] items-center border-t border-border px-4 py-3 text-ui-base", "data-testid": `settings-shortcut-row-${entry.id}`, children: [_jsx("span", { className: "flex min-w-0 items-center", children: _jsx("span", { className: "truncate", children: commandLabel }) }), _jsxs("span", { className: "flex min-w-0 flex-col items-start gap-1.5", children: [bindings.map((binding, index) => isRecording && recording?.mode === "replace" && recording.bindingIndex === index
                        ? renderRecorder()
                        : renderBinding(binding, index)), isRecording && recording?.mode === "replace" && recording?.bindingIndex === null
                        ? renderRecorder()
                        : null, bindings.length === 0 && !isRecording ? (_jsx("button", { type: "button", disabled: menuChannelUnavailable, className: "w-fit rounded-lg px-0 py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-60", "aria-label": intl.formatMessage({ id: "settings.shortcuts.rebindAria" }, { command: commandLabel }), "data-testid": `settings-shortcut-bind-${entry.id}-unassigned`, onClick: () => onRecord(null), children: _jsx(Kbd, { children: intl.formatMessage({ id: "settings.shortcuts.notSet" }) }) })) : null] }), _jsx("span", { className: "text-ui-sm text-foreground-subtle", "data-testid": `settings-shortcut-scope-${entry.id}`, children: entry.scope === "composer"
                    ? intl.formatMessage({ id: "settings.shortcuts.scopeComposer" })
                    : intl.formatMessage({ id: "settings.shortcuts.scopeGlobal" }) }), _jsx(Button, { variant: "ghost", size: "icon", "aria-label": intl.formatMessage({ id: "settings.shortcuts.clearAria" }, { command: commandLabel }), 
                // Web 端 menu 通道命令与录制入口同置灰：其默认键被根级回退监听固定消费，
                // 清除成未分配也不会真的失效，放行会产出「显示未分配却仍触发」的分裂状态
                disabled: menuChannelUnavailable || bindings.length === 0, onClick: onClearAll, "data-testid": `settings-shortcut-clear-${entry.id}`, children: _jsx(Trash2, { className: "size-4" }) })] }));
}
//# sourceMappingURL=ShortcutBindingRow.js.map