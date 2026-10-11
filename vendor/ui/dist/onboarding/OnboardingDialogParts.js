import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { CheckIcon } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { cn } from "../components/lib/utils.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
const WIZARD_STEPS = [
    { key: "session", index: 1, titleId: "onboarding.step.session" },
    { key: "skills-import", index: 2, titleId: "onboarding.step.skillsImport" },
    { key: "mcp-import", index: 3, titleId: "onboarding.step.mcpImport" },
    // 插件导入步骤未启用。
    // { key: "plugins-import", index: 4, titleId: "onboarding.step.pluginsImport" },
    { key: "commands-import", index: 4, titleId: "onboarding.step.commandsImport" },
    { key: "agents-file", index: 5, titleId: "onboarding.step.agentsFile" },
    { key: "migration", index: 6, titleId: "onboarding.step.migration" },
];
export function getOnboardingStepMessageKey(step) {
    switch (step) {
        case "session":
            return "session";
        case "skills-import":
            return "skillsImport";
        case "mcp-import":
            return "mcpImport";
        case "commands-import":
            return "commandsImport";
        case "agents-file":
            return "agentsFile";
        case "migration":
            return "migration";
    }
}
export function OnboardingWizardSidebar(props) {
    const { intl } = useZCodeIntl();
    const currentIndex = WIZARD_STEPS.findIndex((step) => step.key === props.currentStep);
    return (_jsx("aside", { className: "hidden w-56 shrink-0 flex-col gap-2 p-1 md:flex", children: _jsxs("div", { className: "flex h-full flex-col gap-4 rounded-xl border border-border bg-surface p-4", children: [_jsx("div", { className: "text-ui-base font-medium uppercase tracking-wide text-foreground-subtle", children: intl.formatMessage({ id: "onboarding.wizard.label" }) }), _jsx("div", { className: "space-y-2", children: WIZARD_STEPS.map((step, index) => {
                        const isCurrent = step.key === props.currentStep;
                        const isCompleted = index < currentIndex;
                        return (_jsxs("div", { className: cn("flex items-center gap-3 rounded-xl border-0 px-3 py-3 transition-colors", isCurrent
                                ? "border-border-hover bg-card"
                                : isCompleted
                                    ? "border-transparent bg-background-alt"
                                    : "border-transparent bg-transparent"), children: [_jsx("div", { className: cn("flex size-6 shrink-0 items-center justify-center rounded-full border text-ui-base font-mono font-semibold", isCurrent
                                        ? "bg-primary text-primary-foreground"
                                        : isCompleted
                                            ? "border-success bg-success text-success-foreground"
                                            : "border-border bg-background text-foreground-subtle"), children: isCompleted ? _jsx(CheckIcon, { className: "size-4" }) : index + 1 }), _jsx("div", { className: "min-w-0", children: _jsx("div", { className: cn("text-ui-base font-medium", isCurrent || isCompleted ? "text-foreground" : "text-foreground-subtle"), children: intl.formatMessage({ id: step.titleId }) }) })] }, step.key));
                    }) })] }) }));
}
export function OnboardingWizardHeader(props) {
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-lg font-medium text-foreground", children: props.title }), props.description.trim().length > 0 ? (_jsx("div", { className: "text-ui-base leading-6 text-foreground-subtle", children: props.description })) : null] }));
}
export function OnboardingWizardFooter(props) {
    const { intl } = useZCodeIntl();
    const isExternalImportStep = isOnboardingExternalImportStep(props.currentStep);
    const helperText = props.currentStep === "session"
        ? intl.formatMessage({ id: "onboarding.footer.workspaceSelection" }, { count: String(props.selectedWorkspaceCount) })
        : /*
           * 暂时隐藏数据迁移向导里的代理设置步骤，保留原 helper 文案分支以便后续恢复。
           * : props.currentStep === "agent-settings"
           *   ? intl.formatMessage(
           *       { id: "onboarding.footer.selection" },
           *       { count: String(props.settingsTaskCount) },
           *     )
           */
            intl.formatMessage({ id: "onboarding.footer.helper" });
    /*
     * 暂时隐藏数据迁移向导里的代理设置步骤，批量选择按钮随步骤一起隐藏。
     * const showAgentSettingsBulk =
     *   props.currentStep === "agent-settings" && props.onAgentSettingsBulkToggle;
     */
    return (_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("div", { className: "flex min-w-0 flex-1 items-center gap-2", children: _jsx("span", { className: "min-w-0 truncate text-ui-base text-foreground-subtle", children: helperText }) }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [props.currentStep === "session" ? (_jsxs(_Fragment, { children: [_jsx(Button, { type: "button", variant: "secondary", size: "lg", className: "h-10 min-w-0 px-5", onClick: props.onBackToWelcome, children: intl.formatMessage({ id: "common.back" }) }), _jsx(Button, { type: "button", size: "lg", className: "h-10 min-w-0 px-5", onClick: props.onNextStep, children: intl.formatMessage({ id: "onboarding.action.continue" }) })] })) : null, isExternalImportStep ? (_jsxs(_Fragment, { children: [_jsx(Button, { type: "button", variant: "secondary", size: "lg", className: "h-10 min-w-0 px-5", onClick: props.onBackStep, children: intl.formatMessage({ id: "common.back" }) }), _jsx(Button, { type: "button", size: "lg", className: "h-10 min-w-0 px-5", onClick: props.onNextStep, children: intl.formatMessage({ id: "onboarding.action.continue" }) })] })) : null, props.currentStep === "agents-file" ? (_jsxs(_Fragment, { children: [_jsx(Button, { type: "button", variant: "secondary", size: "lg", className: "h-10 min-w-0 px-5", onClick: props.onBackStep, children: intl.formatMessage({ id: "common.back" }) }), _jsx(Button, { type: "button", size: "lg", className: "h-10 min-w-0 px-5", disabled: props.beginMigrationDisabled, onClick: props.onBeginMigration, children: intl.formatMessage({ id: "onboarding.action.beginMigration" }) })] })) : null, props.currentStep === "migration" && props.finishReady ? (_jsx(Button, { type: "button", size: "lg", className: "h-10 min-w-0 px-5", disabled: props.finishRunning, onClick: props.onFinish, children: intl.formatMessage({ id: "settingsSync.action.finish" }) })) : null] })] }));
}
function isOnboardingExternalImportStep(step) {
    return (step === "skills-import" ||
        step === "mcp-import" ||
        // 插件导入步骤未启用。
        // step === "plugins-import" ||
        step === "commands-import");
}
//# sourceMappingURL=OnboardingDialogParts.js.map