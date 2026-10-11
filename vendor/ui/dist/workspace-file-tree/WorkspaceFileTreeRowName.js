import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from "react";
export function WorkspaceFileTreeRowName({ name, className, slashClassName, }) {
    const segments = name.split("/");
    if (segments.length <= 1) {
        return _jsx("span", { className: className, children: name });
    }
    return (_jsx("span", { className: className, children: segments.map((segment, index) => (_jsxs(Fragment, { children: [index > 0 ? _jsx("span", { className: slashClassName, children: "/" }) : null, _jsx("span", { children: segment })] }, `${segment}-${index}`))) }));
}
//# sourceMappingURL=WorkspaceFileTreeRowName.js.map