import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from "react";
import { ScopedErrorBoundary } from "../../ErrorBoundary.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { UsageEmptyState } from "../../settings/usage-stats/usageStatsUiParts.js";
export function UsageChartLoadBoundary({ children, loadingDescription, resetKeys, scope, }) {
    const { intl } = useZCodeIntl();
    return (_jsx(ScopedErrorBoundary, { scope: scope, resetKeys: resetKeys, variant: "inline", children: _jsx(Suspense, { fallback: _jsx(UsageEmptyState, { title: intl.formatMessage({ id: "settings.usage.loadingTitle" }), description: loadingDescription }), children: children }) }));
}
//# sourceMappingURL=UsageChartLoadBoundary.js.map