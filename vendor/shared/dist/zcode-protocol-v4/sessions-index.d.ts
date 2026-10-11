import { z } from "zod";
export declare const sessionPendingInteractionSummarySchema: z.ZodObject<{
    interactionId: z.ZodString;
    kind: z.ZodEnum<{
        userInput: "userInput";
        permission: "permission";
    }>;
    toolName: z.ZodOptional<z.ZodString>;
    autoResolution: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        state: z.ZodEnum<{
            hiddenGrace: "hiddenGrace";
            visibleCountdown: "visibleCountdown";
        }>;
        startedAt: z.ZodNumber;
        visibleAt: z.ZodNumber;
        deadlineAt: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        state: z.ZodLiteral<"snoozed">;
        startedAt: z.ZodNumber;
        snoozedAt: z.ZodNumber;
    }, z.core.$strip>], "state">>;
}, z.core.$strip>;
export type SessionPendingInteractionSummary = z.infer<typeof sessionPendingInteractionSummarySchema>;
export declare const pendingInteractionSummarySchema: z.ZodObject<{
    permissionCount: z.ZodNumber;
    userInputCount: z.ZodNumber;
}, z.core.$strip>;
export type PendingInteractionSummary = z.infer<typeof pendingInteractionSummarySchema>;
export declare const sessionSummarySchema: z.ZodObject<{
    sessionId: z.ZodString;
    workspaceId: z.ZodString;
    parentSessionId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    titleSource: z.ZodOptional<z.ZodEnum<{
        default: "default";
        custom: "custom";
        generated: "generated";
    }>>;
    phase: z.ZodEnum<{
        running: "running";
        error: "error";
        draft: "draft";
        completedSuccess: "completedSuccess";
        completedInterrupted: "completedInterrupted";
        prewarming: "prewarming";
    }>;
    sessionEnded: z.ZodBoolean;
    hasBackgroundWork: z.ZodBoolean;
    workflowActivity: z.ZodOptional<z.ZodObject<{
        runs: z.ZodArray<z.ZodObject<{
            runId: z.ZodString;
            toolCallId: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
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
            startedAt: z.ZodOptional<z.ZodNumber>;
            phases: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                status: z.ZodEnum<{
                    pending: "pending";
                    running: "running";
                    failed: "failed";
                    done: "done";
                }>;
                alongside: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
                hole: z.ZodOptional<z.ZodEnum<{
                    waiting: "waiting";
                    open: "open";
                }>>;
            }, z.core.$strip>>;
            currentPhase: z.ZodOptional<z.ZodString>;
            agentsWorking: z.ZodNumber;
            waitingHole: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    pendingInteraction: z.ZodOptional<z.ZodObject<{
        interactionId: z.ZodString;
        kind: z.ZodEnum<{
            userInput: "userInput";
            permission: "permission";
        }>;
        toolName: z.ZodOptional<z.ZodString>;
        autoResolution: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            state: z.ZodEnum<{
                hiddenGrace: "hiddenGrace";
                visibleCountdown: "visibleCountdown";
            }>;
            startedAt: z.ZodNumber;
            visibleAt: z.ZodNumber;
            deadlineAt: z.ZodNumber;
        }, z.core.$strip>, z.ZodObject<{
            state: z.ZodLiteral<"snoozed">;
            startedAt: z.ZodNumber;
            snoozedAt: z.ZodNumber;
        }, z.core.$strip>], "state">>;
    }, z.core.$strip>>;
    pendingInteractionSummary: z.ZodOptional<z.ZodObject<{
        permissionCount: z.ZodNumber;
        userInputCount: z.ZodNumber;
    }, z.core.$strip>>;
    goalStatus: z.ZodOptional<z.ZodEnum<{
        failed: "failed";
        active: "active";
        paused: "paused";
        notSatisfied: "notSatisfied";
        verifying: "verifying";
        verified: "verified";
    }>>;
    lastActivityAt: z.ZodNumber;
    lastAssistantPreview: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodNumber;
}, z.core.$strip>;
export type SessionSummary = z.infer<typeof sessionSummarySchema>;
export declare const sessionsIndexSnapshotSchema: z.ZodObject<{
    protocolVersion: z.ZodLiteral<1>;
    workspaceId: z.ZodString;
    logEpoch: z.ZodString;
    sessions: z.ZodArray<z.ZodObject<{
        sessionId: z.ZodString;
        workspaceId: z.ZodString;
        parentSessionId: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        titleSource: z.ZodOptional<z.ZodEnum<{
            default: "default";
            custom: "custom";
            generated: "generated";
        }>>;
        phase: z.ZodEnum<{
            running: "running";
            error: "error";
            draft: "draft";
            completedSuccess: "completedSuccess";
            completedInterrupted: "completedInterrupted";
            prewarming: "prewarming";
        }>;
        sessionEnded: z.ZodBoolean;
        hasBackgroundWork: z.ZodBoolean;
        workflowActivity: z.ZodOptional<z.ZodObject<{
            runs: z.ZodArray<z.ZodObject<{
                runId: z.ZodString;
                toolCallId: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
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
                startedAt: z.ZodOptional<z.ZodNumber>;
                phases: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    status: z.ZodEnum<{
                        pending: "pending";
                        running: "running";
                        failed: "failed";
                        done: "done";
                    }>;
                    alongside: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
                    hole: z.ZodOptional<z.ZodEnum<{
                        waiting: "waiting";
                        open: "open";
                    }>>;
                }, z.core.$strip>>;
                currentPhase: z.ZodOptional<z.ZodString>;
                agentsWorking: z.ZodNumber;
                waitingHole: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        pendingInteraction: z.ZodOptional<z.ZodObject<{
            interactionId: z.ZodString;
            kind: z.ZodEnum<{
                userInput: "userInput";
                permission: "permission";
            }>;
            toolName: z.ZodOptional<z.ZodString>;
            autoResolution: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                state: z.ZodEnum<{
                    hiddenGrace: "hiddenGrace";
                    visibleCountdown: "visibleCountdown";
                }>;
                startedAt: z.ZodNumber;
                visibleAt: z.ZodNumber;
                deadlineAt: z.ZodNumber;
            }, z.core.$strip>, z.ZodObject<{
                state: z.ZodLiteral<"snoozed">;
                startedAt: z.ZodNumber;
                snoozedAt: z.ZodNumber;
            }, z.core.$strip>], "state">>;
        }, z.core.$strip>>;
        pendingInteractionSummary: z.ZodOptional<z.ZodObject<{
            permissionCount: z.ZodNumber;
            userInputCount: z.ZodNumber;
        }, z.core.$strip>>;
        goalStatus: z.ZodOptional<z.ZodEnum<{
            failed: "failed";
            active: "active";
            paused: "paused";
            notSatisfied: "notSatisfied";
            verifying: "verifying";
            verified: "verified";
        }>>;
        lastActivityAt: z.ZodNumber;
        lastAssistantPreview: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SessionsIndexSnapshot = z.infer<typeof sessionsIndexSnapshotSchema>;
export declare const sessionsIndexDeltaSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    op: z.ZodLiteral<"session.upserted">;
    session: z.ZodObject<{
        sessionId: z.ZodString;
        workspaceId: z.ZodString;
        parentSessionId: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        titleSource: z.ZodOptional<z.ZodEnum<{
            default: "default";
            custom: "custom";
            generated: "generated";
        }>>;
        phase: z.ZodEnum<{
            running: "running";
            error: "error";
            draft: "draft";
            completedSuccess: "completedSuccess";
            completedInterrupted: "completedInterrupted";
            prewarming: "prewarming";
        }>;
        sessionEnded: z.ZodBoolean;
        hasBackgroundWork: z.ZodBoolean;
        workflowActivity: z.ZodOptional<z.ZodObject<{
            runs: z.ZodArray<z.ZodObject<{
                runId: z.ZodString;
                toolCallId: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
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
                startedAt: z.ZodOptional<z.ZodNumber>;
                phases: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    status: z.ZodEnum<{
                        pending: "pending";
                        running: "running";
                        failed: "failed";
                        done: "done";
                    }>;
                    alongside: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
                    hole: z.ZodOptional<z.ZodEnum<{
                        waiting: "waiting";
                        open: "open";
                    }>>;
                }, z.core.$strip>>;
                currentPhase: z.ZodOptional<z.ZodString>;
                agentsWorking: z.ZodNumber;
                waitingHole: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        pendingInteraction: z.ZodOptional<z.ZodObject<{
            interactionId: z.ZodString;
            kind: z.ZodEnum<{
                userInput: "userInput";
                permission: "permission";
            }>;
            toolName: z.ZodOptional<z.ZodString>;
            autoResolution: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                state: z.ZodEnum<{
                    hiddenGrace: "hiddenGrace";
                    visibleCountdown: "visibleCountdown";
                }>;
                startedAt: z.ZodNumber;
                visibleAt: z.ZodNumber;
                deadlineAt: z.ZodNumber;
            }, z.core.$strip>, z.ZodObject<{
                state: z.ZodLiteral<"snoozed">;
                startedAt: z.ZodNumber;
                snoozedAt: z.ZodNumber;
            }, z.core.$strip>], "state">>;
        }, z.core.$strip>>;
        pendingInteractionSummary: z.ZodOptional<z.ZodObject<{
            permissionCount: z.ZodNumber;
            userInputCount: z.ZodNumber;
        }, z.core.$strip>>;
        goalStatus: z.ZodOptional<z.ZodEnum<{
            failed: "failed";
            active: "active";
            paused: "paused";
            notSatisfied: "notSatisfied";
            verifying: "verifying";
            verified: "verified";
        }>>;
        lastActivityAt: z.ZodNumber;
        lastAssistantPreview: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"session.removed">;
    sessionId: z.ZodString;
}, z.core.$strip>], "op">;
export type SessionsIndexDelta = z.infer<typeof sessionsIndexDeltaSchema>;
/** sessions-index topic key 构造（与 parseSessionsIndexTopic 对偶）。 */
export declare function sessionsIndexTopic(workspaceId: string): string;
/** sessions-index topic key 解析（"sessions-index/<workspaceId>"）。 */
export declare function parseSessionsIndexTopic(topic: string): string | null;
//# sourceMappingURL=sessions-index.d.ts.map