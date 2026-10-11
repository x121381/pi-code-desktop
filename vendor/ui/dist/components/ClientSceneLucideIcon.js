import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { dynamicIconImports } from "lucide-react/dynamic.mjs";
function isLucideIconName(name) {
    return Object.prototype.hasOwnProperty.call(dynamicIconImports, name);
}
/** 按 Client Scenes 下发的 Lucide canonical 名称加载图标，未知名称保留调用方语义回退。 */
export function ClientSceneLucideIcon({ fallback, name, ...iconProps }) {
    const normalizedName = name?.trim();
    const [resolved, setResolved] = useState(null);
    useEffect(() => {
        let cancelled = false;
        if (!normalizedName || !isLucideIconName(normalizedName))
            return undefined;
        void dynamicIconImports[normalizedName]()
            .then((iconModule) => {
            if (!cancelled) {
                setResolved({ Icon: iconModule.default, name: normalizedName });
            }
        })
            .catch(() => {
            if (!cancelled)
                setResolved(null);
        });
        return () => {
            cancelled = true;
        };
    }, [normalizedName]);
    if (!normalizedName || resolved?.name !== normalizedName)
        return fallback;
    const Icon = resolved.Icon;
    return _jsx(Icon, { ...iconProps, "data-client-scene-lucide-icon": normalizedName });
}
//# sourceMappingURL=ClientSceneLucideIcon.js.map