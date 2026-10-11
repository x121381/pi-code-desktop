import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { Loader2, RefreshCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card.js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.js";
import { Input } from "@/components/ui/input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select.js";
import { useClaudeSessionMigration } from "@/hooks/useClaudeSessionMigration.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { MigrationCandidatesCard } from "@/settings/MigrationCandidatesCard.js";
const RANGE_OPTIONS = ["7d", "30d", "90d", "all"];
const WORKSPACE_FILTER_OPTIONS = ["all", "current"];
export function MigrationSection({ workspacePath, workspaceIdentity, isDesktop, }) {
    const { intl, locale } = useZCodeIntl();
    const { supportState, workspaceFilterMode, setWorkspaceFilterMode, hasCurrentWorkspaceFilter, range, setRange, limitInput, setLimitInput, scanLimit, candidates, selectedSessionIds, selectedCount, scanError, importError, lastImportResult, isScanning, isImporting, scan, importSelectedSessions, toggleSessionSelection, selectAllSessions, clearSelectedSessions, } = useClaudeSessionMigration({
        workspacePath,
        workspaceIdentity,
        isDesktop,
    });
    const dateTimeFormatter = useMemo(() => new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
    }), [locale]);
    const unsupportedDescription = supportState.reason === "desktopOnly"
        ? intl.formatMessage({ id: "settings.migration.unsupported.desktopOnly" })
        : null;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "border border-border bg-card py-0 shadow-none", children: [_jsxs(CardHeader, { className: "border-b border-border", children: [_jsx(CardAction, { children: _jsxs(Button, { type: "button", size: "sm", variant: "outline", disabled: !supportState.supported || isScanning, onClick: () => {
                                        void scan();
                                    }, children: [isScanning ? (_jsx(Loader2, { className: "size-3.5 animate-spin" })) : (_jsx(RefreshCcw, { className: "size-3.5" })), intl.formatMessage({ id: "settings.migration.scan" })] }) }), _jsxs("div", { className: "space-y-1", children: [_jsx(CardTitle, { children: intl.formatMessage({ id: "settings.migration.filtersTitle" }) }), _jsx(CardDescription, { children: intl.formatMessage({ id: "settings.migration.filtersDescription" }) })] })] }), _jsxs(CardContent, { className: "space-y-4 px-4 py-4", children: [!supportState.supported ? (_jsxs(Alert, { children: [_jsx(TriangleAlert, { className: "size-4" }), _jsx(AlertTitle, { children: intl.formatMessage({ id: "settings.migration.unsupported.title" }) }), _jsx(AlertDescription, { children: unsupportedDescription })] })) : null, _jsxs("div", { className: "grid gap-4 xl:grid-cols-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "settings.migration.workspaceFilterLabel" }) }), _jsxs(Select, { value: workspaceFilterMode, disabled: !supportState.supported || isScanning || isImporting, onValueChange: (value) => setWorkspaceFilterMode(value), children: [_jsx(SelectTrigger, { size: "lg", className: "w-full justify-between", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: intl.formatMessage({ id: "settings.migration.workspaceFilter.all" }) }), hasCurrentWorkspaceFilter ? (_jsx(SelectItem, { value: "current", children: intl.formatMessage({ id: "settings.migration.workspaceFilter.current" }) })) : null] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "settings.migration.rangeLabel" }) }), _jsxs(Select, { value: range, disabled: !supportState.supported || isScanning || isImporting, onValueChange: (value) => setRange(value), children: [_jsx(SelectTrigger, { size: "lg", className: "w-full justify-between", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: RANGE_OPTIONS.map((option) => (_jsx(SelectItem, { value: option, children: intl.formatMessage({ id: `settings.migration.range.${option}` }) }, option))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "settings.migration.limitLabel" }) }), _jsx(Input, { type: "number", min: 1, max: 500, value: limitInput, disabled: !supportState.supported || isScanning || isImporting, onChange: (event) => setLimitInput(event.target.value) }), _jsx("div", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.migration.limitHint" }, { max: String(scanLimit) }) })] })] }), scanError ? (_jsxs(Alert, { children: [_jsx(TriangleAlert, { className: "size-4" }), _jsx(AlertTitle, { children: intl.formatMessage({ id: "settings.migration.scanFailedTitle" }) }), _jsx(AlertDescription, { children: intl.formatMessage({ id: "settings.migration.scanFailedDescription" }, { error: scanError }) })] })) : null] })] }), _jsx(MigrationCandidatesCard, { supportState: supportState, candidates: candidates, selectedSessionIds: selectedSessionIds, selectedCount: selectedCount, importError: importError, lastImportResult: lastImportResult, isImporting: isImporting, dateTimeFormatter: dateTimeFormatter, onToggleSelection: toggleSessionSelection, onSelectAll: selectAllSessions, onClearSelection: clearSelectedSessions, onImportSelected: () => {
                    void importSelectedSessions();
                } })] }));
}
//# sourceMappingURL=MigrationSection.js.map