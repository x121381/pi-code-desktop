import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../../components/lib/utils.js";
/**
 * 新元素的揭示动画。稳定 React key + 只在**挂载**时播一次，所以老点不会随着新点到达重播；
 * `motion-reduce` 下整个关掉。
 */
export const REVEAL_ANIMATION_CLASS = "animate-in fade-in duration-300 ease-out motion-reduce:animate-none";
/** 一条数据都没有时的占位。压到最低存在感：看板本身在运行期就是会先空着的。 */
export function PresetEmpty({ label, compact }) {
    return (_jsx("div", { className: cn("flex items-center justify-center rounded-lg border border-dashed border-border text-foreground-subtlest", compact ? "px-2 py-3 text-ui-xs" : "px-4 py-8 text-ui-sm"), "data-testid": "artifact-preset-empty", children: label }));
}
/** 字段名 + 单位的统一写法：单位跟在标签后面的括号里，不重复到每一个值上（dataviz 惯例）。 */
export function fieldHeading(label, unit) {
    return unit ? `${label} (${unit})` : label;
}
/**
 * 全尺寸形态的标题条：spec 的 title / description 由作者用用户语言写好，这里原样呈现。
 * 三样都没有时整块**缺席**（连外边距一起消失）——所以外边距由这里带，而不是调用方包一层 div。
 */
export function PresetHeading({ title, description, trailing, className, }) {
    if (!title && !description && !trailing) {
        return null;
    }
    return (_jsxs("div", { className: cn("flex items-start justify-between gap-3", className), children: [_jsxs("div", { className: "min-w-0", children: [title ? (_jsx("div", { className: "truncate text-ui-base font-medium text-foreground", children: title })) : null, description ? (_jsx("div", { className: "mt-0.5 text-ui-sm text-foreground-subtle", children: description })) : null] }), trailing ? _jsx("div", { className: "shrink-0", children: trailing }) : null] }));
}
//# sourceMappingURL=parts.js.map