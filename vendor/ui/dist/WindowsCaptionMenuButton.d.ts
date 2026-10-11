export { shouldShowDesktopUpdateEntry } from "@/lib/desktopUpdateMenu.js";
export declare function WindowsCaptionMenuButton({ readOnlyReason, workspaceAbsPath, onCreateTask, onOpenWorkspace, allowOpenWorkspace, allowOpenInFileManager, onToggleTerminal: _onToggleTerminal, onToggleBrowser: _onToggleBrowser, triggerPresentation, useWindowsCaptionSpacing, }: {
    readOnlyReason?: string;
    workspaceAbsPath: string;
    onCreateTask: () => void;
    onOpenWorkspace: () => void;
    allowOpenWorkspace?: boolean;
    allowOpenInFileManager?: boolean;
    onToggleTerminal: () => void;
    onToggleBrowser: () => void;
    triggerPresentation?: "header" | "header-borderless";
    useWindowsCaptionSpacing?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WindowsCaptionMenuButton.d.ts.map