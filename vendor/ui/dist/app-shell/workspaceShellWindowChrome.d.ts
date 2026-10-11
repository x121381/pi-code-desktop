interface WorkspaceShellWindowChromeOptions {
    isMacDesktop?: boolean;
    isWindowsDesktop?: boolean;
    isLinuxDesktop?: boolean;
    macOSMajorVersion?: number | null;
    isWindowsMaximized: boolean;
    supportsNativeRoundedCorners: boolean | null;
}
type WorkspaceShellPlatformRadiusOptions = Pick<WorkspaceShellWindowChromeOptions, "isMacDesktop" | "isWindowsDesktop" | "isLinuxDesktop" | "macOSMajorVersion">;
export declare function resolveWorkspaceShellPanelRadiusPx({ isMacDesktop, isWindowsDesktop, macOSMajorVersion, }: WorkspaceShellPlatformRadiusOptions): number;
export declare function resolveWorkspaceShellResizeHandleInsetPx(options: WorkspaceShellPlatformRadiusOptions): number;
export declare function resolveWorkspaceShellWindowChromeClass({ isMacDesktop, isWindowsDesktop, isLinuxDesktop, macOSMajorVersion, supportsNativeRoundedCorners, }: WorkspaceShellWindowChromeOptions): string;
export {};
//# sourceMappingURL=workspaceShellWindowChrome.d.ts.map