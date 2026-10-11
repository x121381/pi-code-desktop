"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "../lib/utils.js";
function Progress({ className, indicatorClassName, segments, value, ...props }) {
    const normalizedValue = Math.min(Math.max(value ?? 0, 0), 100);
    const normalizedSegments = segments
        ?.map((segment) => ({
        ...segment,
        percent: Math.min(Math.max(segment.percent, 0), 1),
    }))
        .filter((segment) => segment.percent > 0) ?? [];
    return (_jsx(ProgressPrimitive.Root, { "data-slot": "progress", className: cn("relative flex h-1 w-full items-center overflow-x-hidden rounded-md bg-muted", className), ...props, children: _jsx(ProgressPrimitive.Indicator, { "data-slot": "progress-indicator", className: cn("h-full rounded-full transition-[width]", normalizedSegments.length > 0 ? "flex overflow-hidden bg-transparent" : "bg-primary", normalizedValue > 0 && indicatorClassName), style: { width: `${normalizedValue}%` }, children: normalizedSegments.map((segment) => (_jsx("span", { "aria-hidden": "true", className: cn("h-full shrink-0", segment.className), style: { ...segment.style, flexBasis: `${segment.percent * 100}%` } }, segment.id))) }) }));
}
export { Progress };
//# sourceMappingURL=progress.js.map