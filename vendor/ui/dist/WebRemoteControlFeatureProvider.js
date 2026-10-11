import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const DEFAULT_WEB_REMOTE_CONTROL_FEATURE_ENABLED = true;
const WebRemoteControlFeatureContext = createContext(DEFAULT_WEB_REMOTE_CONTROL_FEATURE_ENABLED);
export function WebRemoteControlFeatureProvider({ enabled = DEFAULT_WEB_REMOTE_CONTROL_FEATURE_ENABLED, children, }) {
    return (_jsx(WebRemoteControlFeatureContext.Provider, { value: enabled, children: children }));
}
export function useWebRemoteControlFeatureEnabled() {
    return useContext(WebRemoteControlFeatureContext);
}
//# sourceMappingURL=WebRemoteControlFeatureProvider.js.map