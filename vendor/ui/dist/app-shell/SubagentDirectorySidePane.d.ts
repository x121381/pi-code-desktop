import type { ZCodeSessionEndedSubagent } from "@zcode/shared";
import type { RunningSubagentSummary } from "@zcode/shared/zcode-protocol-v4";
import type { OpenScopedSubagentSideTabRequest, SubagentDirectorySidePaneTab } from "@/lib/workspaceSidePane.js";
type DirectoryItem = RunningSubagentSummary | ZCodeSessionEndedSubagent;
export declare function buildSubagentDirectoryOpenRequest(tab: SubagentDirectorySidePaneTab, item: DirectoryItem): OpenScopedSubagentSideTabRequest;
export declare const SubagentDirectorySidePane: import("react").MemoExoticComponent<({ tab, onOpenSubagentSession, }: {
    tab: SubagentDirectorySidePaneTab;
    onOpenSubagentSession: (request: OpenScopedSubagentSideTabRequest) => void;
}) => import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=SubagentDirectorySidePane.d.ts.map