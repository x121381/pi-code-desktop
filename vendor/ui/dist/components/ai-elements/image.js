import { jsx as _jsx } from "react/jsx-runtime";
/*
 * Derived from vercel/ai-elements (packages/elements/src/image.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: local integration, formatting and adaptations.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
import { cn } from "../lib/utils.js";
export const Image = ({ base64, uint8Array: _uint8Array, mediaType, ...props }) => (_jsx("img", { ...props, alt: props.alt, className: cn("h-auto max-w-full overflow-hidden rounded-md", props.className), src: `data:${mediaType};base64,${base64}` }));
//# sourceMappingURL=image.js.map