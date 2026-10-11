import { jsx as _jsx } from "react/jsx-runtime";
/*
 * Derived from vercel/ai-elements (packages/elements/src/panel.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: local integration, formatting and adaptations.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
import { cn } from "../lib/utils.js";
import { Panel as PanelPrimitive } from "@xyflow/react";
export const Panel = ({ className, ...props }) => (_jsx(PanelPrimitive, { className: cn("m-4 overflow-hidden rounded-md border bg-card p-1", className), ...props }));
//# sourceMappingURL=panel.js.map