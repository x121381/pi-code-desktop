import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Blocks } from "lucide-react";
import { cn } from "../components/lib/utils.js";
import { resolvePluginIconSource } from "../lib/pluginIconSource.js";
/** Plugin 原始图标；支持官方内置图标与 HTTPS，缺失或失败时使用调用方兜底，默认回退 Blocks。 */
export function PluginIcon({ src, pluginId, className, iconClassName, fallbackIcon, }) {
    const [imageFailed, setImageFailed] = useState(false);
    const resolvedSrc = resolvePluginIconSource(pluginId, src);
    const showImage = Boolean(resolvedSrc) && !imageFailed;
    return (_jsx("span", { "aria-hidden": "true", className: cn("flex shrink-0 select-none items-center justify-center rounded-xl bg-surface", !showImage && "text-foreground-subtle", className), children: showImage ? (_jsx("img", { src: resolvedSrc, alt: "", draggable: false, className: "h-2/3 w-2/3 object-contain", onError: () => setImageFailed(true) })) : fallbackIcon ? (fallbackIcon) : (_jsx(Blocks, { className: cn("size-4", iconClassName) })) }));
}
//# sourceMappingURL=PluginIcon.js.map