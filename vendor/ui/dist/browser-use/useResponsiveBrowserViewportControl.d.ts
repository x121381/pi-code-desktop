import type { BrowserViewportSize, BrowserViewportZoom, EmbeddedBrowserViewportPreference } from "@zcode/shared";
export type HumanBrowserViewportPreferenceChangeSource = "mode" | "viewport" | "zoom";
export declare function useResponsiveBrowserViewportControl({ browserKey, desktopZoomFactor, onAgentViewportChange, onViewportSynchronized, onViewportResize, initialHumanViewportPreference, onHumanViewportPreferenceChange, sessionId, }: {
    browserKey: string;
    desktopZoomFactor: number;
    onAgentViewportChange: (willChangeResponsiveMode: boolean) => void;
    onViewportSynchronized: () => void;
    onViewportResize: () => void;
    initialHumanViewportPreference?: EmbeddedBrowserViewportPreference;
    onHumanViewportPreferenceChange?: (preference: EmbeddedBrowserViewportPreference, source: HumanBrowserViewportPreferenceChangeSource) => void;
    sessionId?: string;
}): {
    isResponsiveMode: boolean;
    responsiveViewportSize: {
        width: number;
        height: number;
    };
    responsiveViewportZoom: "100" | "50" | "fit" | "200" | "150" | "75" | "125";
    setResponsiveViewportZoom: (zoom: BrowserViewportZoom) => void;
    synchronizeInitialHumanViewport: () => void;
    toggleResponsiveMode: () => void;
    updateResponsiveViewportSize: (viewportSize: BrowserViewportSize) => void;
};
//# sourceMappingURL=useResponsiveBrowserViewportControl.d.ts.map