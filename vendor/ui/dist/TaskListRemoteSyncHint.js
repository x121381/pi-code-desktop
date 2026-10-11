import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spinner } from "./components/ui/spinner.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
export function TaskListRemoteSyncHint() {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex items-center gap-2 px-2.5 py-1 text-ui-base text-foreground-subtlest", children: [_jsx(Spinner, { className: "size-4 text-foreground-subtlest" }), _jsx("span", { children: intl.formatMessage({ id: "taskList.syncingRemoteWorkspaces" }) })] }));
}
//# sourceMappingURL=TaskListRemoteSyncHint.js.map