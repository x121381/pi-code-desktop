import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CONTAINER_CLASS_NAME = "rounded-xl border border-dashed border-border bg-transparent px-4 py-10 text-center";
export function PluginLoadingState({ label }) {
    return (_jsx("div", { className: `${CONTAINER_CLASS_NAME} text-ui-base text-foreground-subtle`, children: label }));
}
export function PluginSearchEmptyState({ label }) {
    return (_jsx("div", { className: `${CONTAINER_CLASS_NAME} text-ui-base text-foreground-subtle`, children: label }));
}
export function PluginInstallEmptyState({ actions, description, title, }) {
    return (_jsxs("div", { className: `flex flex-col items-center justify-center gap-3 ${CONTAINER_CLASS_NAME}`, children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: title }), _jsx("div", { className: "text-ui-sm text-foreground-subtle", children: description })] }), _jsx("div", { className: "flex flex-wrap items-center justify-center gap-2", children: actions })] }));
}
//# sourceMappingURL=PluginInstallEmptyState.js.map