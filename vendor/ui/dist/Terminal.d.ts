import type { IServiceAccessor } from "@zcode/services";
export declare function Terminal({ services, cwd, workspaceIdentity, openWorkspaceKeys, isVisible, isPanelResizing, isWindowsDesktop, onClose, onOpenBrowserUrl, }: {
    services: IServiceAccessor;
    cwd?: string;
    workspaceIdentity?: string;
    openWorkspaceKeys?: string[];
    isVisible: boolean;
    isPanelResizing?: boolean;
    isWindowsDesktop?: boolean;
    onClose: () => void;
    onOpenBrowserUrl: (url: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Terminal.d.ts.map