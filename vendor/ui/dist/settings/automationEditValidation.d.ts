export type AutomationEditRequiredField = "title" | "schedule" | "prompt";
export declare function resolveAutomationEditRequiredFieldErrors(params: {
    title: string;
    cronExpr: string;
    prompt: string;
}): AutomationEditRequiredField[];
/** 正常编辑只撤销当前字段已有的提交告警，不主动产生新的告警。 */
export declare function clearAutomationEditRequiredFieldError(errors: ReadonlySet<AutomationEditRequiredField>, field: AutomationEditRequiredField): ReadonlySet<AutomationEditRequiredField>;
//# sourceMappingURL=automationEditValidation.d.ts.map