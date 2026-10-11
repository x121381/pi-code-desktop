import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { OpenScopedSubagentSideTabRequest, OpenBackgroundBashSideTabRequest, SubagentSessionSidePaneTab } from "@/lib/workspaceSidePane.js";
export declare const SubagentSessionSidePane: import("react").MemoExoticComponent<({ tab, focused, compactForRemoteControl, onOpenBrowserUrl, onOpenCodeViewer, onOpenFileLink, onOpenSubagentSession, onOpenBackgroundBash, }: {
    tab: SubagentSessionSidePaneTab;
    focused: boolean;
    compactForRemoteControl?: boolean;
    onOpenBrowserUrl?: (url: string) => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onOpenBackgroundBash?: (request: OpenBackgroundBashSideTabRequest) => void;
    onOpenSubagentSession: (request: OpenScopedSubagentSideTabRequest) => void;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=SubagentSessionSidePane.d.ts.map