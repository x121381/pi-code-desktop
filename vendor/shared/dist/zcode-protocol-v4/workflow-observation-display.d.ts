import { z } from "zod";
/** `stopped` 的原因。 */
export declare const WORKFLOW_RUN_STOP_REASONS: readonly ["user", "model", "provider", "interrupted", "superseded"];
export declare const WORKFLOW_RUN_OBSERVATION_STATUSES: readonly ["pending", "running", "completed", "errored", "stopped"];
export declare const toolCallGetWorkflowRunDisplaySchema: z.ZodObject<{
    kind: z.ZodLiteral<"get_workflow_run">;
    runId: z.ZodString;
    label: z.ZodString;
    status: z.ZodEnum<{
        pending: "pending";
        running: "running";
        completed: "completed";
        stopped: "stopped";
        errored: "errored";
    }>;
    stopReason: z.ZodOptional<z.ZodEnum<{
        interrupted: "interrupted";
        model: "model";
        user: "user";
        provider: "provider";
        superseded: "superseded";
    }>>;
    possiblyInterrupted: z.ZodOptional<z.ZodBoolean>;
    summary: z.ZodOptional<z.ZodString>;
    generatedAt: z.ZodOptional<z.ZodNumber>;
    usage: z.ZodObject<{
        spentTokens: z.ZodNumber;
        nodesObserved: z.ZodNumber;
        nodesRunning: z.ZodNumber;
        nodesCompleted: z.ZodNumber;
        nodesFailed: z.ZodNumber;
    }, z.core.$strict>;
    phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        state: z.ZodEnum<{
            done: "done";
            current: "current";
            ahead: "ahead";
            unfinished: "unfinished";
        }>;
        rounds: z.ZodNumber;
        nodesSettled: z.ZodNumber;
        nodesRunning: z.ZodNumber;
        enteredAt: z.ZodOptional<z.ZodNumber>;
        exitedAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>;
    subagents: z.ZodOptional<z.ZodArray<z.ZodObject<{
        siteId: z.ZodString;
        ordinal: z.ZodNumber;
        name: z.ZodOptional<z.ZodString>;
        state: z.ZodEnum<{
            failed: "failed";
            done: "done";
            unfinished: "unfinished";
            idle: "idle";
            executing: "executing";
            waiting: "waiting";
            parked: "parked";
        }>;
        phaseName: z.ZodOptional<z.ZodString>;
        instructionsHead: z.ZodOptional<z.ZodString>;
        startedAt: z.ZodOptional<z.ZodNumber>;
        turn: z.ZodOptional<z.ZodNumber>;
        toolCalls: z.ZodOptional<z.ZodNumber>;
        lastTool: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            target: z.ZodOptional<z.ZodString>;
            at: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        waitCause: z.ZodOptional<z.ZodEnum<{
            slot: "slot";
            backoff: "backoff";
        }>>;
        retryAfterMs: z.ZodOptional<z.ZodNumber>;
        waitSince: z.ZodOptional<z.ZodNumber>;
        parkedOn: z.ZodOptional<z.ZodString>;
        stepsSettled: z.ZodNumber;
        stepsFailed: z.ZodNumber;
        tokens: z.ZodNumber;
        lastProgressAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>;
    health: z.ZodOptional<z.ZodObject<{
        lastProgressAt: z.ZodOptional<z.ZodNumber>;
        stalledSince: z.ZodOptional<z.ZodNumber>;
        concurrency: z.ZodOptional<z.ZodObject<{
            effective: z.ZodNumber;
            cap: z.ZodNumber;
            reason: z.ZodOptional<z.ZodString>;
            since: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        consecutiveFailures: z.ZodNumber;
        cachedSteps: z.ZodNumber;
        leftoverRunning: z.ZodOptional<z.ZodNumber>;
        pendingQuestionsKnown: z.ZodBoolean;
    }, z.core.$strict>>;
    actors: z.ZodArray<z.ZodObject<{
        siteId: z.ZodString;
        ordinal: z.ZodNumber;
        name: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    logTail: z.ZodArray<z.ZodObject<{
        sequence: z.ZodNumber;
        message: z.ZodString;
        at: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    result: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, z.core.$strict>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ToolCallGetWorkflowRunDisplay = z.infer<typeof toolCallGetWorkflowRunDisplaySchema>;
export declare const toolCallListWorkflowRunsDisplaySchema: z.ZodObject<{
    kind: z.ZodLiteral<"list_workflow_runs">;
    runs: z.ZodArray<z.ZodObject<{
        runId: z.ZodString;
        label: z.ZodString;
        labelSource: z.ZodEnum<{
            script: "script";
            name: "name";
        }>;
        status: z.ZodEnum<{
            pending: "pending";
            running: "running";
            completed: "completed";
            stopped: "stopped";
            errored: "errored";
        }>;
        stopReason: z.ZodOptional<z.ZodEnum<{
            interrupted: "interrupted";
            model: "model";
            user: "user";
            provider: "provider";
            superseded: "superseded";
        }>>;
        ownedByThisSession: z.ZodBoolean;
        possiblyInterrupted: z.ZodOptional<z.ZodBoolean>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        spentTokens: z.ZodNumber;
    }, z.core.$strict>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ToolCallListWorkflowRunsDisplay = z.infer<typeof toolCallListWorkflowRunsDisplaySchema>;
export declare const toolCallEvalWorkflowSnippetDisplaySchema: z.ZodObject<{
    kind: z.ZodLiteral<"eval_workflow_snippet">;
    ok: z.ZodBoolean;
    diagnostics: z.ZodArray<z.ZodObject<{
        line: z.ZodNumber;
        column: z.ZodNumber;
        code: z.ZodNumber;
        message: z.ZodString;
    }, z.core.$strict>>;
    logs: z.ZodArray<z.ZodString>;
    response: z.ZodString;
    durationMs: z.ZodNumber;
    truncated: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ToolCallEvalWorkflowSnippetDisplay = z.infer<typeof toolCallEvalWorkflowSnippetDisplaySchema>;
export declare const toolCallSavedWorkflowListDisplaySchema: z.ZodObject<{
    kind: z.ZodLiteral<"saved_workflow_list">;
    workflows: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        whenToUse: z.ZodOptional<z.ZodString>;
        scope: z.ZodString;
        path: z.ZodString;
        argNames: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>;
    invalid: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ToolCallSavedWorkflowListDisplay = z.infer<typeof toolCallSavedWorkflowListDisplaySchema>;
export declare const toolCallListModelsDisplaySchema: z.ZodObject<{
    kind: z.ZodLiteral<"list_models">;
    current: z.ZodOptional<z.ZodString>;
    models: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        providerId: z.ZodString;
        modelId: z.ZodString;
        providerLabel: z.ZodOptional<z.ZodString>;
        reasoningLevels: z.ZodArray<z.ZodString>;
        defaultReasoningLevel: z.ZodOptional<z.ZodString>;
        contextWindow: z.ZodOptional<z.ZodNumber>;
        disabledReason: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ToolCallListModelsDisplay = z.infer<typeof toolCallListModelsDisplaySchema>;
export declare const toolCallResumeWorkflowRunDisplaySchema: z.ZodObject<{
    kind: z.ZodLiteral<"resume_workflow_run">;
    runId: z.ZodString;
}, z.core.$strict>;
export type ToolCallResumeWorkflowRunDisplay = z.infer<typeof toolCallResumeWorkflowRunDisplaySchema>;
//# sourceMappingURL=workflow-observation-display.d.ts.map