import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function RemoteSkillSyncResultList({ result }) {
    const { intl } = useZCodeIntl();
    if (!result) {
        return null;
    }
    return (_jsxs("div", { className: "grid gap-2", children: [_jsx("div", { className: "rounded-lg border border-border bg-surface px-3 py-2 text-ui-base text-foreground", children: intl.formatMessage({ id: "settings.skills.remoteSync.complete" }) }), result.results.map((item) => (_jsxs("div", { className: "rounded-lg border border-border bg-surface px-3 py-2 text-ui-base", children: [_jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1", children: [_jsx("span", { className: "font-medium text-foreground", children: item.name }), _jsx("span", { className: "text-foreground-subtle", children: intl.formatMessage({ id: `settings.skills.remoteSync.${item.status}` }) })] }), item.error ? (_jsx("div", { className: "mt-1 break-words text-ui-base text-destructive", children: item.error })) : null] }, item.directoryName)))] }));
}
//# sourceMappingURL=RemoteSkillSyncResultList.js.map