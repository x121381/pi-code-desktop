import type { SessionConfigState, WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import { type WorkflowRunSettingsAccepted, type WorkflowRunSettingsHost } from "@/components/workflow-timeline/WorkflowRunSettingsPopover.js";
import type { OpenScopedWorkflowRunSideTabRequest, WorkflowRunSidePaneTab } from "@/lib/workspaceSidePane.js";
import type { useV4Conversation } from "@/v4/V4ConversationContext.js";
/** run tab 的 workspace 作用域：打开别的 tab（actor、脚本、产物、后继）时原样带上。 */
export declare function workflowRunTabScope(tab: Pick<WorkflowRunSidePaneTab, "workspacePath" | "workspaceIdentity" | "remoteSessionId">): Pick<OpenScopedWorkflowRunSideTabRequest, "workspacePath" | "workspaceIdentity" | "remoteSessionId">;
export declare function useWorkflowRunPaneSettings({ enabled, onOpenWorkflowRun, run, runs, sendCommand, sessionConfig, tab, }: {
    /** 灰度门（与 Resume 同一道）。 */
    enabled: boolean;
    onOpenWorkflowRun?: (request: OpenScopedWorkflowRunSideTabRequest) => void;
    run: WorkflowRunState | undefined;
    runs: readonly WorkflowRunState[] | undefined;
    sendCommand: ReturnType<typeof useV4Conversation>["sendCommand"];
    sessionConfig: SessionConfigState | undefined;
    tab: WorkflowRunSidePaneTab;
}): {
    configurable: boolean;
    host: WorkflowRunSettingsHost;
    onAccepted: (accepted: WorkflowRunSettingsAccepted) => void;
    popover: {
        anchorRef: import("react").RefObject<HTMLElement | null>;
        open: boolean;
        setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
        toggleFrom: (element: HTMLElement) => void;
    };
};
//# sourceMappingURL=useWorkflowRunPaneSettings.d.ts.map