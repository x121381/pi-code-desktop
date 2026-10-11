import { createContext, useContext } from "react";
const PluginReferenceIconContext = createContext(null);
export const PluginReferenceIconProvider = PluginReferenceIconContext.Provider;
export function usePluginReferenceIconProjection() {
    return useContext(PluginReferenceIconContext);
}
//# sourceMappingURL=pluginReferenceIconContext.js.map