import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { canRetryDatabaseStartup } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { Button } from "@/components/ui/button.js";
import { RootStartupLoading } from "@/root/RootStartupLoading.js";
export function GlobalDatabaseStartupLoading({ state, onRetry, onCopy, onExit, }) {
    const { intl } = useZCodeIntl();
    const [now, setNow] = useState(Date.now);
    const [copyStatus, setCopyStatus] = useState(null);
    const failed = state?.phase === "failed";
    const showProgress = state?.migration !== undefined && state.migration.kind !== "none";
    const visible = failed || showProgress;
    useEffect(() => {
        if (failed || !visible)
            return;
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, [failed, visible]);
    useEffect(() => setCopyStatus(null), [state?.attemptId]);
    const elapsed = Math.max(0, (failed ? state.updatedAt : Math.max(now, state?.updatedAt ?? now)) - (state?.startedAt ?? now));
    const phase = state?.phase ?? "starting";
    const labelId = startupLabelId(state, visible);
    const label = intl.formatMessage({ id: labelId });
    const errorCode = state?.errorCode ?? "sql_failed";
    const canRetry = state ? canRetryDatabaseStartup(state) : false;
    const copy = async () => {
        try {
            await onCopy(JSON.stringify(state, null, 2));
            setCopyStatus("copied");
        }
        catch {
            setCopyStatus("copyFailed");
        }
    };
    if (!visible)
        return (_jsx(RootStartupLoading, { label: label, children: _jsx("span", { hidden: true, "data-testid": "database-startup-silent", "data-phase": phase, "data-database-phase": state?.databasePhase }) }));
    return (_jsx(RootStartupLoading, { label: label, busy: !failed, children: _jsxs("div", { className: "flex w-full max-w-md flex-col items-center gap-3 px-6 text-center", "data-testid": "database-startup-status", "data-phase": phase, "data-database-phase": state?.databasePhase, "data-error-code": state?.errorCode, children: [_jsx("h1", { className: "text-ui-lg font-medium", role: failed ? "alert" : undefined, children: label }), _jsx("p", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({
                        id: failed
                            ? state.failedPhase === "starting_services"
                                ? "startup.global.servicesFailed"
                                : `startup.global.error.${errorCode}`
                            : "startup.global.help",
                    }) }), !failed && labelId === "startup.global.waiting" ? (_jsx("p", { className: "text-ui-base", children: intl.formatMessage({ id: "startup.database.waiting_for_lock" }) })) : null, _jsx("p", { className: "text-ui-caption text-foreground-subtle", children: intl.formatMessage({ id: "startup.database.elapsed" }, {
                        minutes: Math.floor(elapsed / 60_000),
                        seconds: Math.floor(elapsed / 1000) % 60,
                    }) }), !failed && elapsed >= 10 * 60_000 ? (_jsx("p", { className: "text-ui-caption text-foreground-subtle", children: intl.formatMessage({ id: "startup.database.longRunning" }) })) : null, failed ? (_jsxs("p", { className: "break-all text-ui-caption text-foreground-subtle", children: [intl.formatMessage({ id: "startup.global.diagnostic" }), ": ", state.attemptId] })) : null, _jsxs("div", { className: "flex flex-wrap justify-center gap-2", children: [canRetry ? (_jsx(Button, { "data-testid": "database-startup-retry", onClick: onRetry, children: intl.formatMessage({ id: "common.retry" }) })) : null, failed ? (_jsx(Button, { variant: "outline", onClick: () => void copy(), children: intl.formatMessage({ id: "startup.global.copy" }) })) : null, _jsx(Button, { variant: "ghost", onClick: onExit, children: intl.formatMessage({ id: "startup.global.exit" }) })] }), copyStatus ? (_jsx("p", { role: "status", className: "text-ui-caption", children: intl.formatMessage({ id: `startup.global.${copyStatus}` }) })) : null] }) }));
}
/** 迁移提示覆盖本次准备；最后一个库之前不展示保存/收尾，避免跨库倒序。 */
function startupLabelId(state, visible) {
    if (state?.phase === "failed")
        return "startup.global.failed";
    if (!visible)
        return "startup.global.silent";
    if (state?.phase === "starting_services" ||
        state?.phase === "ready" ||
        (state?.finalDatabase && state.databasePhase === "ready"))
        return "startup.global.finishing";
    const current = state?.currentMigration;
    if (state?.databasePhase === "waiting_for_lock" && current && current.kind !== "none")
        return "startup.global.waiting";
    if (state?.finalDatabase &&
        state.databasePhase === "committing" &&
        current &&
        current.executedCount > current.committedCount)
        return "startup.global.saving";
    return state?.migration?.kind === "initialize"
        ? "startup.global.initializing"
        : "startup.global.upgrading";
}
//# sourceMappingURL=GlobalDatabaseStartupLoading.js.map