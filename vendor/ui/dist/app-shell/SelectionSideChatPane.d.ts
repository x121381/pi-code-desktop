import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { SelectionSideChatPaneTab } from "@/lib/workspaceSidePane.js";
export declare const SelectionSideChatPane: import("react").MemoExoticComponent<({ tab, focused, onOpenBrowserUrl, onOpenCodeViewer, onOpenFileLink, onUnavailable, }: {
    tab: SelectionSideChatPaneTab;
    focused: boolean;
    onOpenBrowserUrl?: (url: string) => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onUnavailable: (tabId: string) => void;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=SelectionSideChatPane.d.ts.map