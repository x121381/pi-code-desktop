"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/components/lib/utils.js";
export function MarkdownBlockquote({ className, node: _node, ...props }) {
    return (_jsx("blockquote", { className: cn("my-4 border-border border-l-2 pl-3 text-foreground-subtle", "[&_p]:my-0 [&_p+p]:mt-2", className), "data-markdown-blockquote": "", ...props }));
}
//# sourceMappingURL=markdown-blockquote.js.map