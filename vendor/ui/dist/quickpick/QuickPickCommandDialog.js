import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut, } from "@/components/ui/command.js";
import { toast } from "@/components/ui/toast.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { logger } from "@/logger.js";
import { QUICK_PICK_SECTION_ORDER, } from "@/quickpick/quickPickCommands.js";
import { QUICK_PICK_ICON_BY_KIND } from "@/quickpick/quickPickCommandIcons.js";
import { quickPickCommandClassName, quickPickDialogClassName, quickPickInputClassName, quickPickItemClassName, quickPickListClassName, quickPickShortcutPillClassName, } from "@/quickpick/quickPickStyles.js";
export function QuickPickCommandDialog({ open, commands, onOpenChange, }) {
    const { intl } = useZCodeIntl();
    const groupedCommands = useMemo(() => QUICK_PICK_SECTION_ORDER.map((sectionId) => ({
        sectionId,
        commands: commands.filter((command) => command.sectionId === sectionId),
    })).filter((section) => section.commands.length > 0), [commands]);
    return (_jsx(CommandDialog, { open: open, onOpenChange: onOpenChange, title: intl.formatMessage({ id: "quickPick.title" }), description: intl.formatMessage({ id: "quickPick.description" }), className: quickPickDialogClassName, children: _jsxs(Command, { className: quickPickCommandClassName, children: [_jsx(CommandInput, { placeholder: intl.formatMessage({ id: "quickPick.placeholder" }), className: quickPickInputClassName, autoFocus: true }), _jsxs(CommandList, { className: quickPickListClassName, children: [_jsx(CommandEmpty, { children: intl.formatMessage({ id: "quickPick.empty" }) }), groupedCommands.map((section) => (_jsx(CommandGroup, { heading: intl.formatMessage({
                                id: `quickPick.section.${section.sectionId}`,
                            }), children: section.commands.map((command) => {
                                const Icon = QUICK_PICK_ICON_BY_KIND[command.icon];
                                const title = intl.formatMessage({ id: command.titleId });
                                return (_jsxs(CommandItem, { value: `${title} ${command.keywords.join(" ")}`, disabled: command.disabled, className: quickPickItemClassName, onSelect: () => {
                                        onOpenChange(false);
                                        void Promise.resolve(command.run()).catch((error) => {
                                            logger.error("[QuickPick] 命令执行失败", {
                                                commandId: command.id,
                                                error,
                                            });
                                            toast(intl.formatMessage({ id: "quickPick.commandFailed" }, {
                                                error: error instanceof Error ? error.message : String(error),
                                            }));
                                        });
                                    }, children: [_jsx(Icon, { className: "size-3.5 text-foreground-subtle" }), _jsx("span", { className: "min-w-0 flex-1 truncate", children: title }), command.shortcut ? (_jsx(CommandShortcut, { className: quickPickShortcutPillClassName, children: command.shortcut })) : null] }, command.id));
                            }) }, section.sectionId)))] })] }) }));
}
//# sourceMappingURL=QuickPickCommandDialog.js.map