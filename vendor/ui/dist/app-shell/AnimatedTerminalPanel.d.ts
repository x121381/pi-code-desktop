import type { RefObject } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";
import type { IServiceAccessor } from "@zcode/services";
export declare function AnimatedTerminalPanel({ services, workspaceAbsPath, workspaceIdentity, openWorkspaceKeys, isVisible, isWindowsDesktop, frameClassName, panelRef, panelElementRef, onClose, onOpenBrowserUrl, }: {
    services: IServiceAccessor;
    workspaceAbsPath: string;
    workspaceIdentity?: string;
    openWorkspaceKeys?: string[];
    isVisible: boolean;
    isWindowsDesktop?: boolean;
    frameClassName?: string;
    panelRef: RefObject<PanelImperativeHandle | null>;
    panelElementRef: RefObject<HTMLDivElement | null>;
    onClose: () => void;
    onOpenBrowserUrl: (url: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AnimatedTerminalPanel.d.ts.map