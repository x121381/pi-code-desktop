import type { WorkflowRunRail as WorkflowRunRailModel } from "@/lib/workflowRunLine.js";
export interface WorkflowRunRailIntl {
    formatMessage: (desc: {
        id: string;
    }, values?: Record<string, string>) => string;
}
export declare function WorkflowRunRail({ rail, intl, }: {
    rail: WorkflowRunRailModel;
    intl: WorkflowRunRailIntl;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowRunRail.d.ts.map