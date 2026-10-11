import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { cn } from "../../components/lib/utils.js";
import { useOptionalPlatform } from "../../hooks/usePlatform.js";
import { CUA_TOOL_ICON } from "../../ToolCallBlocks/renderers/cuaIcon.js";
export function CuaAppSummaryIcon({ bundleId, fallback, iconRequest, name, className, }) {
    const platform = useOptionalPlatform();
    const [iconDataUrl, setIconDataUrl] = useState(null);
    useEffect(() => {
        let active = true;
        setIconDataUrl(null);
        const request = iconRequest ?? bundleId;
        if (!request || !platform?.getApplicationIcon)
            return () => undefined;
        void platform
            .getApplicationIcon(request)
            .then((result) => {
            if (active)
                setIconDataUrl(result?.iconDataUrl ?? null);
        })
            .catch(() => {
            if (active)
                setIconDataUrl(null);
        });
        return () => {
            active = false;
        };
    }, [bundleId, iconRequest, platform]);
    return iconDataUrl ? (_jsx("img", { src: iconDataUrl, alt: name, className: cn(className ?? "size-4", "shrink-0 rounded-sm object-contain") })) : ((fallback ?? CUA_TOOL_ICON));
}
//# sourceMappingURL=cuaAppSummaryIcon.js.map