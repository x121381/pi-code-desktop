import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PuzzleIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ContextAttachmentPill } from "@/v4/composer/ContextAttachmentPill.js";
import { formatPluginUiContextLabel, } from "../domain/pluginUiModelContext.js";
export const TID_PLUGIN_UI_MODEL_CONTEXT_CHIP = "plugin-ui-model-context-chip";
/** composer 与历史用户消息共用的"插件上下文"pill；与 WebElementContextAttachmentChip 同构。 */
export function PluginUiModelContextChip({ contexts, contentAlign = "start", onRemove, onRemoveAll, }) {
    const { intl } = useZCodeIntl();
    if (contexts.length === 0)
        return null;
    const label = intl.formatMessage({ id: "pluginUi.modelContext.label" });
    const removeLabel = intl.formatMessage({ id: "pluginUi.modelContext.remove" });
    return (_jsx(ContextAttachmentPill, { contentAlign: contentAlign, icon: _jsx(PuzzleIcon, { className: "size-4 shrink-0 text-foreground-subtle" }), label: contexts.length === 1 ? label : `${label} · ${contexts.length}`, onRemoveAll: onRemoveAll, removeLabel: removeLabel, triggerProps: { "data-testid": TID_PLUGIN_UI_MODEL_CONTEXT_CHIP }, children: contexts.map((context) => (_jsxs("div", { className: "group/context flex min-h-7 cursor-default gap-2 rounded-lg px-2 py-1 text-ui-base/relaxed text-foreground hover:bg-menu-hover", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "truncate font-medium", children: formatPluginUiContextLabel(context) }), _jsx("div", { className: "line-clamp-3 whitespace-pre-wrap text-ui-base text-foreground-subtle", children: context.text })] }), onRemove ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-xs", className: "mt-0.5 size-5 shrink-0 rounded-sm text-foreground-subtle opacity-0 transition-opacity hover:text-foreground group-hover/context:opacity-100", "aria-label": removeLabel, title: removeLabel, onClick: (event) => {
                        event.stopPropagation();
                        onRemove(context.id);
                    }, children: _jsx(Trash2Icon, { className: "size-3.5" }) })) : null] }, context.id))) }));
}
//# sourceMappingURL=PluginUiModelContextChip.js.map