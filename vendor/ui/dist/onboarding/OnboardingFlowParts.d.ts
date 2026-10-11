import type { useClaudeSessionMigration } from "@/hooks/useClaudeSessionMigration.js";
import type { useSettingsSync } from "@/hooks/useSettingsSync.js";
import { type ExternalAgentImportCategoryState, type ImportResourceCategory } from "@/settings/ExternalAgentImportDialog.js";
export { OnboardingWelcomeView } from "@/onboarding/OnboardingWelcomeView.js";
export interface OnboardingWorkspaceCandidate {
    workspacePath: string;
    label: string;
    sessionCount: number;
}
export interface FinishExecutionState {
    started: boolean;
    running: boolean;
    finished: boolean;
    sessionCompletedCount: number;
    sessionTotalCount: number;
    sessionImportedCount: number;
    sessionSkippedCount: number;
    sessionFailedCount: number;
    agentsFileCompletedCount: number;
    agentsFileTotalCount: number;
    agentsFileImportedCount: number;
    agentsFileSkippedCount: number;
    agentsFileFailedCount: number;
    currentTaskLabel: string | null;
    error: string | null;
}
export declare function createInitialFinishExecutionState(): FinishExecutionState;
export declare function OnboardingSessionsStep(props: {
    migration: ReturnType<typeof useClaudeSessionMigration>;
    workspaceCandidates: OnboardingWorkspaceCandidate[];
    selectedWorkspacePaths: string[];
    onToggleWorkspace: (workspacePath: string) => void;
    onSelectAll: () => void;
    onClearSelection: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function OnboardingAgentSettingsStep(props: {
    settingsSync: ReturnType<typeof useSettingsSync>;
}): import("react/jsx-runtime").JSX.Element;
export declare function OnboardingExternalAgentImportStep(props: {
    category: ImportResourceCategory;
    state: ExternalAgentImportCategoryState;
    workspacePath: string | null | undefined;
}): import("react/jsx-runtime").JSX.Element;
export declare function OnboardingMigrationStep(props: {
    overallProgress: number;
    finishExecution: FinishExecutionState;
}): import("react/jsx-runtime").JSX.Element;
export declare function OnboardingFinishStep(props: {
    overallProgress: number;
    finishExecution: FinishExecutionState;
    settingsImportedCount: number;
    settingsSkippedCount: number;
    settingsFailedCount: number;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=OnboardingFlowParts.d.ts.map