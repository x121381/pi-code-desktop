import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, LoaderCircle } from "lucide-react";
import { ALL_BOT_WORKSPACES } from "@zcode/shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { SettingsRow } from "@/settings/SettingsPageParts.js";
import { cn } from "@/components/lib/utils.js";
import { isAllWorkspacesAllowed } from "./shared.js";
export function WorkspaceAccessCard({ bot, workspaceRefs, currentWorkspace, loading, onPatchAllowedWorkspaces, onToggleWorkspaceAccess, }) {
    const { intl } = useZCodeIntl();
    const allAllowed = isAllWorkspacesAllowed(bot.allowedWorkspaces);
    const allowedCount = allAllowed
        ? workspaceRefs.length
        : bot.allowedWorkspaces.filter((workspaceId) => workspaceRefs.some((workspace) => workspace.id === workspaceId)).length;
    return (_jsx(SettingsRow, { label: intl.formatMessage({ id: "bots.allowedWorkspaces" }), description: intl.formatMessage({
            id: allAllowed
                ? "bots.allowedWorkspaces.allDescription"
                : "bots.allowedWorkspaces.selectedDescription",
        }, { count: String(allowedCount) }), control: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [loading ? (_jsx(LoaderCircle, { className: "size-4 animate-spin text-foreground-subtle" })) : null, _jsxs(Select, { value: allAllowed ? "all" : "selected", onValueChange: (value) => {
                        void onPatchAllowedWorkspaces(value === "all" ? [ALL_BOT_WORKSPACES] : [currentWorkspace.id]);
                    }, disabled: loading, children: [_jsx(SelectTrigger, { size: "lg", className: "w-48 justify-between", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: intl.formatMessage({
                                        id: "bots.allowedWorkspaces.mode.all",
                                    }) }), _jsx(SelectItem, { value: "selected", children: intl.formatMessage({
                                        id: "bots.allowedWorkspaces.mode.selected",
                                    }) })] })] })] }), detail: allAllowed ? null : (_jsx("div", { className: "rounded-lg bg-background p-1", children: _jsx("div", { className: "flex max-h-72 flex-col gap-1 overflow-y-auto", children: workspaceRefs.map((workspace) => {
                    const checked = bot.allowedWorkspaces.includes(workspace.id);
                    return (_jsxs("button", { type: "button", className: "flex min-w-0 items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60", onClick: () => void onToggleWorkspaceAccess(workspace.id, !checked), disabled: loading, title: workspace.label, children: [_jsx("span", { className: "flex size-6 shrink-0 items-center justify-center", children: _jsx("div", { className: cn("flex size-4 items-center justify-center rounded-sm border", checked
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-input-border bg-input text-transparent"), children: _jsx(Check, { className: "size-3.5" }) }) }), _jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [_jsx("div", { className: "truncate text-ui-base font-medium text-foreground", children: workspace.label }), _jsx("div", { className: "truncate font-mono text-ui-base text-foreground-subtlest", children: workspace.workspacePath })] })] }, workspace.id));
                }) }) })) }));
}
//# sourceMappingURL=WorkspaceAccessCard.js.map