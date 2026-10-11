import type { SettingsSyncClaudeAgentsFileCopyResult, SettingsSyncClaudeAgentsFileMigrationStatus } from "@zcode/shared";
export interface OnboardingAgentsFileMigrationState {
    error: string | null;
    loading: boolean;
    selected: boolean;
    status: SettingsSyncClaudeAgentsFileMigrationStatus | null;
    copy: () => Promise<SettingsSyncClaudeAgentsFileCopyResult>;
    refresh: () => Promise<void>;
    setSelected: (selected: boolean) => void;
}
export declare function useOnboardingAgentsFileMigration(params: {
    enabled: boolean;
    workspacePath?: string;
    workspaceIdentity?: string;
}): OnboardingAgentsFileMigrationState;
//# sourceMappingURL=useOnboardingAgentsFileMigration.d.ts.map