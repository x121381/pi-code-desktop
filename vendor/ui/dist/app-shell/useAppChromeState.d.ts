import type { DesktopWindowChromeState, IPlatformService, UpdateStatePayload } from "@zcode/shared";
export declare function useAppChromeState({ isDesktop, isMacDesktop, isWindowsDesktop, platform, workspaceAbsPath, }: {
    isDesktop?: boolean;
    isMacDesktop?: boolean;
    isWindowsDesktop?: boolean;
    platform: IPlatformService;
    workspaceAbsPath: string;
}): {
    isMacFullscreen: boolean;
    desktopWindowChromeState: DesktopWindowChromeState | null;
    macWindowControlsLeftPaddingPx: number;
    windowsWindowControlsRightPaddingPx: number;
    updateReadyVersion: string | null;
    updateState: UpdateStatePayload | null;
    sidebarContainerRef: import("react").RefObject<HTMLElement | null>;
};
//# sourceMappingURL=useAppChromeState.d.ts.map