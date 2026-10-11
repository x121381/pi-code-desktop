import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useRef } from "react";
import { DEFAULT_AGENT_BROWSER_VIEWPORT, DEFAULT_EMBEDDED_BROWSER_VIEWPORT_PREFERENCE, } from "@zcode/shared";
import { UnifiedBrowserView } from "../browser-use/UnifiedBrowserView.js";
import { useSettings } from "../hooks/useSettingService.js";
import { logger } from "../logger.js";
const HUMAN_BROWSER_VIEWPORT_PREFERENCE_WRITE_DELAY_MS = 200;
function clonePreference(preference) {
    return {
        ...preference,
        viewport: { ...preference.viewport },
    };
}
/** Browser 显示边界：普通 human tab 持久化偏好，Agent popup 使用独立默认 viewport。 */
export function HumanBrowserView(props) {
    const { agentOpened, ...unifiedProps } = props;
    const { loading, settings, update } = useSettings();
    const initialPreferenceRef = useRef(null);
    const pendingPreferenceRef = useRef(null);
    const writeTimerRef = useRef(null);
    const updateRef = useRef(update);
    updateRef.current = update;
    if (!loading && !initialPreferenceRef.current) {
        initialPreferenceRef.current = clonePreference(agentOpened
            ? {
                mode: "responsive",
                viewport: { ...DEFAULT_AGENT_BROWSER_VIEWPORT },
                zoom: "fit",
            }
            : (settings?.embeddedBrowserViewportPreference ??
                DEFAULT_EMBEDDED_BROWSER_VIEWPORT_PREFERENCE));
    }
    const commitPreference = useCallback((preference) => {
        void updateRef
            .current({ embeddedBrowserViewportPreference: clonePreference(preference) })
            .catch((error) => {
            logger.warn("[browser] 保存人类浏览器显示偏好失败", {
                error: error instanceof Error ? error.message : String(error),
            });
        });
    }, []);
    const clearPendingWrite = useCallback(() => {
        if (writeTimerRef.current === null)
            return;
        window.clearTimeout(writeTimerRef.current);
        writeTimerRef.current = null;
    }, []);
    const handlePreferenceChange = useCallback((preference, source) => {
        pendingPreferenceRef.current = clonePreference(preference);
        if (source === "viewport") {
            clearPendingWrite();
            // resize handle 每帧都会产生 CSS viewport；只合并 settings IO，不改变 guest 实时更新。
            writeTimerRef.current = window.setTimeout(() => {
                writeTimerRef.current = null;
                const pendingPreference = pendingPreferenceRef.current;
                pendingPreferenceRef.current = null;
                if (pendingPreference)
                    commitPreference(pendingPreference);
            }, HUMAN_BROWSER_VIEWPORT_PREFERENCE_WRITE_DELAY_MS);
            return;
        }
        clearPendingWrite();
        const pendingPreference = pendingPreferenceRef.current;
        pendingPreferenceRef.current = null;
        if (pendingPreference)
            commitPreference(pendingPreference);
    }, [clearPendingWrite, commitPreference]);
    useEffect(() => () => {
        clearPendingWrite();
        const pendingPreference = pendingPreferenceRef.current;
        pendingPreferenceRef.current = null;
        if (pendingPreference)
            commitPreference(pendingPreference);
    }, [clearPendingWrite, commitPreference]);
    const initialPreference = initialPreferenceRef.current;
    if (!initialPreference) {
        return (_jsx("div", { "aria-busy": "true", "data-browser-human-viewport-preference-state": "loading", className: "h-full min-h-0 w-full min-w-0 bg-background" }));
    }
    return (_jsx(UnifiedBrowserView, { ...unifiedProps, initialHumanViewportPreference: initialPreference, onHumanViewportPreferenceChange: agentOpened ? undefined : handlePreferenceChange }));
}
//# sourceMappingURL=HumanBrowserView.js.map