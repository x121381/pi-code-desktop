import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function MarchLight({ d, from, id, to }) {
    const alongY = from.x === to.x;
    return (_jsxs(_Fragment, { children: [_jsx("defs", { children: _jsxs("linearGradient", { gradientUnits: "userSpaceOnUse", id: id, x1: alongY ? 0 : from.x, x2: alongY ? 0 : to.x, y1: alongY ? from.y : 0, y2: alongY ? to.y : 0, children: [_jsx("stop", { offset: 0, stopColor: "var(--color-warning)", stopOpacity: 0 }), _jsx("stop", { offset: 0.8, stopColor: "var(--color-warning)" })] }) }), _jsx("path", { className: "wf-lit", d: d, "data-testid": "workflow-march-light", fill: "none", stroke: `url(#${id})` })] }));
}
//# sourceMappingURL=WorkflowMarchLight.js.map