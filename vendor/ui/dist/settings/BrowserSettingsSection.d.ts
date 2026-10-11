interface BrowserSettingsSectionProps {
    isDesktop: boolean;
    isWindowsDesktop?: boolean;
    workspacePath?: string | null;
    workspaceIdentity?: string;
    embeddedBrowserAllowInsecureCertificates?: boolean;
    onEmbeddedBrowserAllowInsecureCertificatesChange?: (enabled: boolean) => Promise<void>;
}
export declare function BrowserSettingsSection({ isDesktop, isWindowsDesktop, workspacePath, workspaceIdentity, embeddedBrowserAllowInsecureCertificates, onEmbeddedBrowserAllowInsecureCertificatesChange, }: BrowserSettingsSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=BrowserSettingsSection.d.ts.map