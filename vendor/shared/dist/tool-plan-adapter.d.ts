import type { ZCodePlanStep } from "./zcode-task-types-core.js";
export declare function isTodoPlanToolName(value: string | null | undefined): boolean;
export declare function isMainAgentToolProjectionSource(...candidates: unknown[]): boolean;
export declare function extractPlanStepsFromToolInput(params: {
    title?: string;
    kind?: string;
    input: unknown;
}): ZCodePlanStep[] | null;
export declare function extractPlanStepsFromToolOutput(params: {
    title?: string;
    kind?: string;
    output: unknown;
}): ZCodePlanStep[] | null;
//# sourceMappingURL=tool-plan-adapter.d.ts.map