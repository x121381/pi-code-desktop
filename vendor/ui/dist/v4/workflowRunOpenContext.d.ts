import { type ReactNode } from "react";
import type { SessionWorkflowRunSummary } from "@zcode/shared/zcode-protocol-v4";
export interface WorkflowRunOpenTarget {
    workspacePath: string;
    workspaceIdentity?: string;
    sessionId: string;
    run: SessionWorkflowRunSummary;
}
type WorkflowRunOpenHandler = (target: WorkflowRunOpenTarget) => void;
export declare function WorkflowRunOpenProvider({ onOpenRun, children, }: {
    onOpenRun: WorkflowRunOpenHandler;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useWorkflowRunOpen(): WorkflowRunOpenHandler | null;
export {};
//# sourceMappingURL=workflowRunOpenContext.d.ts.map