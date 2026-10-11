import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { PlanDetailSidePaneTab } from "@/lib/workspaceSidePane.js";
export declare const PlanDetailSidePane: import("react").MemoExoticComponent<({ tab, onOpenBrowserUrl, onOpenCodeViewer, onOpenFileLink, }: {
    tab: PlanDetailSidePaneTab;
    onOpenBrowserUrl?: (url: string) => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=PlanDetailSidePane.d.ts.map