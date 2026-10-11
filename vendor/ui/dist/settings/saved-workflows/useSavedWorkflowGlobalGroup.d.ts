import type { ZCodeSavedWorkflowEntry, ZCodeSavedWorkflowRun } from "@zcode/shared";
import type { AutomationWorkspaceOption } from "@/settings/automationWorkspaceOptions.js";
import { type SavedWorkflowLaunchTarget } from "@/settings/saved-workflows/useSavedWorkflowLauncher.js";
import type { SavedWorkflowGroupMode } from "@/settings/saved-workflows/SavedWorkflowProjectGroup.js";
import type { SavedWorkflowProjectTarget, SavedWorkflowsOpenArtifactParams, SavedWorkflowsOpenRunParams } from "@/settings/saved-workflows/savedWorkflowContract.js";
interface UseSavedWorkflowGlobalGroupParams {
    refreshSeq: number;
    mode: SavedWorkflowGroupMode;
    onStateChange: (key: "global", state: {
        loaded: boolean;
        empty: boolean;
        count: number;
    }) => void;
    onOpenDetail: (name: string) => void;
    onBack: () => void;
    /** 「运行」= GUI 直接启动：accepted 后切到新会话。 */
    onNavigateToLaunchedRun?: (target: SavedWorkflowLaunchTarget, sessionId: string) => void;
    onCreateViaChat?: (prompt: string, target: SavedWorkflowProjectTarget) => void;
    onOpenWorkflowRun?: (params: SavedWorkflowsOpenRunParams) => void;
    /** 产物 chip → `workflow-artifact` tab。 */
    onOpenWorkflowArtifact?: (params: SavedWorkflowsOpenArtifactParams) => void;
    localProjects: readonly AutomationWorkspaceOption[];
    activeProjectKey: string | null;
    onMoved: () => void;
}
export declare function useSavedWorkflowGlobalGroup({ refreshSeq, mode, onStateChange, onOpenDetail, onBack, onNavigateToLaunchedRun, onCreateViaChat, onOpenWorkflowRun, onOpenWorkflowArtifact, localProjects, activeProjectKey, onMoved, }: UseSavedWorkflowGlobalGroupParams): {
    agentService: import("@zcode/services").IZCodeAgentService;
    state: import("@/store/savedWorkflowStore.js").SavedWorkflowWorkspaceState;
    now: number;
    busyName: string | null;
    launchEntry: {
        name: string;
        description: string;
        scope: "project" | "global";
        path: string;
        whenToUse?: string | undefined;
        args?: Record<string, {
            type: "string" | "number" | "boolean" | "json";
            description?: string | undefined;
            required?: boolean | undefined;
            default?: unknown;
        }> | undefined;
    } | null;
    launchPending: boolean;
    launchError: import("@/settings/saved-workflows/useSavedWorkflowLauncher.js").SavedWorkflowLaunchError | null;
    moveEntry: {
        name: string;
        description: string;
        scope: "project" | "global";
        path: string;
        whenToUse?: string | undefined;
        args?: Record<string, {
            type: "string" | "number" | "boolean" | "json";
            description?: string | undefined;
            required?: boolean | undefined;
            default?: unknown;
        }> | undefined;
    } | null;
    actionTarget: SavedWorkflowProjectTarget | null;
    lastRuns: Map<string, {
        runId: string;
        status: "running" | "pending" | "completed" | "stopped" | "errored";
        createdAt: number;
        updatedAt: number;
        spentTokens: number;
        name?: string | undefined;
        stopReason?: "user" | "interrupted" | "model" | "provider" | "superseded" | undefined;
        parentSessionId?: string | undefined;
        toolCallId?: string | undefined;
        args?: Record<string, unknown> | undefined;
        cwd?: string | undefined;
        artifacts?: {
            id: string;
            kind: "table" | "markdown" | "file" | "chart" | "metrics" | "board";
            version: number;
            title?: string | undefined;
            contentType?: string | undefined;
        }[] | undefined;
    }>;
    resolveRunProject: (run: ZCodeSavedWorkflowRun) => import("./SavedWorkflowRunHistoryPanel.js").SavedWorkflowRunProject | null;
    refresh: (options?: {
        bypassCache?: boolean;
    }) => Promise<void>;
    setLaunchEntry: import("react").Dispatch<import("react").SetStateAction<{
        name: string;
        description: string;
        scope: "project" | "global";
        path: string;
        whenToUse?: string | undefined;
        args?: Record<string, {
            type: "string" | "number" | "boolean" | "json";
            description?: string | undefined;
            required?: boolean | undefined;
            default?: unknown;
        }> | undefined;
    } | null>>;
    setMoveEntry: import("react").Dispatch<import("react").SetStateAction<{
        name: string;
        description: string;
        scope: "project" | "global";
        path: string;
        whenToUse?: string | undefined;
        args?: Record<string, {
            type: "string" | "number" | "boolean" | "json";
            description?: string | undefined;
            required?: boolean | undefined;
            default?: unknown;
        }> | undefined;
    } | null>>;
    handleRun: (entry: ZCodeSavedWorkflowEntry) => void;
    launch: (entry: ZCodeSavedWorkflowEntry, args: Record<string, unknown>, target?: AutomationWorkspaceOption) => Promise<void>;
    handleRevise: (entry: ZCodeSavedWorkflowEntry) => void;
    handleCreateViaChat: () => void;
    handleCopyPath: (entry: ZCodeSavedWorkflowEntry) => void;
    handleDelete: (entry: ZCodeSavedWorkflowEntry) => Promise<void>;
    handleCardDelete: (entry: ZCodeSavedWorkflowEntry) => undefined;
    handleCardMove: (entry: ZCodeSavedWorkflowEntry) => void;
    handleOpen: (entry: ZCodeSavedWorkflowEntry) => void;
    handleOpenRun: (run: ZCodeSavedWorkflowRun, workflowName: string) => void;
    handleOpenArtifact: (run: ZCodeSavedWorkflowRun, artifactId: string) => void;
    handleMoveSubmit: (target: AutomationWorkspaceOption) => Promise<void>;
};
export {};
//# sourceMappingURL=useSavedWorkflowGlobalGroup.d.ts.map