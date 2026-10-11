import type { SettingsSyncSelection } from "@zcode/shared";
import type { useClaudeSessionMigration } from "@/hooks/useClaudeSessionMigration.js";
import type { useSettingsSync } from "@/hooks/useSettingsSync.js";
import { type FinishExecutionState } from "@/onboarding/OnboardingFlowParts.js";
import type { OnboardingView, OnboardingWizardStep } from "@/onboarding/OnboardingDialogParts.js";
import type { OnboardingAgentsFileMigrationState } from "@/onboarding/useOnboardingAgentsFileMigration.js";
export declare function shouldAutoScanOnboardingSessions(params: {
    view: OnboardingView;
    wizardStep: OnboardingWizardStep;
    supported: boolean;
    isScanning: boolean;
    candidateCount: number;
    scanError: string | null;
    hasAutoScannedInCurrentEntry: boolean;
}): boolean;
export declare function useOnboardingMigration(view: OnboardingView, wizardStep: OnboardingWizardStep, selectedWorkspacePaths: string[], additionalSettingsSelections: SettingsSyncSelection[], sessionMigration: ReturnType<typeof useClaudeSessionMigration>, agentsFileMigration: OnboardingAgentsFileMigrationState, settingsSync: ReturnType<typeof useSettingsSync>, options?: {
    includeSettingsSelections?: boolean;
}): {
    finishExecution: FinishExecutionState;
    resetFinishExecution: () => void;
};
//# sourceMappingURL=useOnboardingMigration.d.ts.map