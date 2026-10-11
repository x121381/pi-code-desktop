export type OnboardingView = "welcome" | "wizard";
export type OnboardingWizardStep = "session" | "skills-import" | "mcp-import" | "commands-import" | "agents-file" | "migration";
export declare function getOnboardingStepMessageKey(step: OnboardingWizardStep): string;
export declare function OnboardingWizardSidebar(props: {
    currentStep: OnboardingWizardStep;
}): import("react/jsx-runtime").JSX.Element;
export declare function OnboardingWizardHeader(props: {
    title: string;
    description: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function OnboardingWizardFooter(props: {
    currentStep: OnboardingWizardStep;
    selectedWorkspaceCount: number;
    settingsTaskCount: number;
    finishRunning: boolean;
    finishReady: boolean;
    onBackToWelcome: () => void;
    onBackStep: () => void;
    onNextStep: () => void;
    onBeginMigration: () => void;
    onFinish: () => void;
    /** 未选任何会话或外部导入项时禁用「开始迁移」 */
    beginMigrationDisabled?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=OnboardingDialogParts.d.ts.map