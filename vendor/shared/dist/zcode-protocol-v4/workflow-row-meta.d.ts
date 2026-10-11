import { z } from "zod";
export declare const workflowNotificationMetaSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"terminal">;
    status: z.ZodEnum<{
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
    summary: z.ZodString;
    result: z.ZodOptional<z.ZodString>;
    resultForm: z.ZodOptional<z.ZodEnum<{
        prose: "prose";
        json: "json";
    }>>;
    resultTruncated: z.ZodOptional<z.ZodLiteral<true>>;
    error: z.ZodOptional<z.ZodString>;
    reports: z.ZodOptional<z.ZodObject<{
        count: z.ZodNumber;
        shown: z.ZodNumber;
        preview: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
    artifacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            file: "file";
            markdown: "markdown";
            chart: "chart";
            table: "table";
            metrics: "metrics";
            board: "board";
        }>;
        title: z.ZodOptional<z.ZodString>;
        version: z.ZodNumber;
        contentType: z.ZodOptional<z.ZodString>;
        primary: z.ZodOptional<z.ZodLiteral<true>>;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    artifactsTruncated: z.ZodOptional<z.ZodLiteral<true>>;
    durationMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"escalation">;
    qid: z.ZodString;
    actor: z.ZodString;
    question: z.ZodString;
    context: z.ZodOptional<z.ZodString>;
    askedAt: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"hole">;
    siteId: z.ZodString;
    ordinal: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodString;
    prompt: z.ZodOptional<z.ZodString>;
    draftPath: z.ZodOptional<z.ZodString>;
    line: z.ZodOptional<z.ZodNumber>;
    before: z.ZodOptional<z.ZodString>;
    after: z.ZodOptional<z.ZodString>;
    reachedAt: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"stall">;
    sinceMs: z.ZodNumber;
    reason: z.ZodOptional<z.ZodString>;
    cap: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>], "kind">;
export type WorkflowNotificationMeta = z.infer<typeof workflowNotificationMetaSchema>;
export declare const backgroundResultOriginMetaSchema: z.ZodObject<{
    backgroundSource: z.ZodEnum<{
        bash: "bash";
        subagent: "subagent";
        workflow: "workflow";
    }>;
    workId: z.ZodString;
    title: z.ZodString;
    workflowNotification: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"terminal">;
        status: z.ZodEnum<{
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
        summary: z.ZodString;
        result: z.ZodOptional<z.ZodString>;
        resultForm: z.ZodOptional<z.ZodEnum<{
            prose: "prose";
            json: "json";
        }>>;
        resultTruncated: z.ZodOptional<z.ZodLiteral<true>>;
        error: z.ZodOptional<z.ZodString>;
        reports: z.ZodOptional<z.ZodObject<{
            count: z.ZodNumber;
            shown: z.ZodNumber;
            preview: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>;
        artifacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodEnum<{
                file: "file";
                markdown: "markdown";
                chart: "chart";
                table: "table";
                metrics: "metrics";
                board: "board";
            }>;
            title: z.ZodOptional<z.ZodString>;
            version: z.ZodNumber;
            contentType: z.ZodOptional<z.ZodString>;
            primary: z.ZodOptional<z.ZodLiteral<true>>;
            description: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        artifactsTruncated: z.ZodOptional<z.ZodLiteral<true>>;
        durationMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"escalation">;
        qid: z.ZodString;
        actor: z.ZodString;
        question: z.ZodString;
        context: z.ZodOptional<z.ZodString>;
        askedAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"hole">;
        siteId: z.ZodString;
        ordinal: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodString;
        prompt: z.ZodOptional<z.ZodString>;
        draftPath: z.ZodOptional<z.ZodString>;
        line: z.ZodOptional<z.ZodNumber>;
        before: z.ZodOptional<z.ZodString>;
        after: z.ZodOptional<z.ZodString>;
        reachedAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"stall">;
        sinceMs: z.ZodNumber;
        reason: z.ZodOptional<z.ZodString>;
        cap: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>], "kind">>;
}, z.core.$strip>;
export type BackgroundResultOriginMeta = z.infer<typeof backgroundResultOriginMetaSchema>;
export declare const workflowSettingsAmendMetaSchema: z.ZodObject<{
    predecessorRunId: z.ZodOptional<z.ZodString>;
    subagentModel: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    maxConcurrency: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodNumber>;
        to: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    ceiling: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type WorkflowSettingsAmendMeta = z.infer<typeof workflowSettingsAmendMetaSchema>;
export declare const workflowLaunchMetaSchema: z.ZodObject<{
    runId: z.ZodString;
    toolCallId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodEnum<{
        project: "project";
        global: "global";
    }>>;
    path: z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    description: z.ZodOptional<z.ZodString>;
    display: z.ZodCatch<z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"create_workflow">;
        ok: z.ZodBoolean;
        errorCount: z.ZodNumber;
        diagnostics: z.ZodArray<z.ZodObject<{
            line: z.ZodNumber;
            column: z.ZodNumber;
            code: z.ZodNumber;
            message: z.ZodString;
        }, z.core.$strict>>;
        causalityGraph: z.ZodOptional<z.ZodObject<{
            steps: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                kind: z.ZodEnum<{
                    ask: "ask";
                    "world-read": "world-read";
                    hole: "hole";
                }>;
                label: z.ZodString;
                labelPattern: z.ZodOptional<z.ZodObject<{
                    head: z.ZodOptional<z.ZodString>;
                    tail: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                line: z.ZodOptional<z.ZodNumber>;
                column: z.ZodOptional<z.ZodNumber>;
                lane: z.ZodString;
                lanes: z.ZodOptional<z.ZodArray<z.ZodString>>;
                source: z.ZodOptional<z.ZodString>;
                phase: z.ZodOptional<z.ZodString>;
                repeat: z.ZodOptional<z.ZodEnum<{
                    stack: "stack";
                    serial: "serial";
                }>>;
                fill: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            lanes: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                namePattern: z.ZodOptional<z.ZodObject<{
                    head: z.ZodOptional<z.ZodString>;
                    tail: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                line: z.ZodOptional<z.ZodNumber>;
                column: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
            participants: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                phase: z.ZodString;
                lane: z.ZodString;
                steps: z.ZodArray<z.ZodString>;
                member: z.ZodOptional<z.ZodObject<{
                    index: z.ZodNumber;
                    of: z.ZodNumber;
                }, z.core.$strict>>;
                many: z.ZodOptional<z.ZodLiteral<true>>;
            }, z.core.$strict>>;
            handoffs: z.ZodArray<z.ZodObject<{
                from: z.ZodString;
                to: z.ZodString;
                back: z.ZodOptional<z.ZodLiteral<true>>;
                types: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strict>>;
            phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                line: z.ZodOptional<z.ZodNumber>;
                column: z.ZodOptional<z.ZodNumber>;
                alongside: z.ZodOptional<z.ZodArray<z.ZodString>>;
                fill: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>>;
            phaseEdges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                from: z.ZodString;
                to: z.ZodString;
                back: z.ZodOptional<z.ZodLiteral<true>>;
            }, z.core.$strict>>>;
            phaseStreams: z.ZodOptional<z.ZodArray<z.ZodObject<{
                from: z.ZodString;
                to: z.ZodString;
            }, z.core.$strict>>>;
            holes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                siteId: z.ZodString;
                name: z.ZodString;
                type: z.ZodString;
                phase: z.ZodOptional<z.ZodString>;
                tail: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>>;
            exits: z.ZodOptional<z.ZodArray<z.ZodString>>;
            sink: z.ZodOptional<z.ZodArray<z.ZodString>>;
            truncated: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        truncated: z.ZodOptional<z.ZodBoolean>;
        fill: z.ZodOptional<z.ZodObject<{
            siteId: z.ZodString;
            name: z.ZodString;
            draftPath: z.ZodOptional<z.ZodString>;
            line: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    script: z.ZodOptional<z.ZodString>;
    amend: z.ZodOptional<z.ZodObject<{
        predecessorRunId: z.ZodOptional<z.ZodString>;
        subagentModel: z.ZodOptional<z.ZodObject<{
            from: z.ZodOptional<z.ZodString>;
            to: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        maxConcurrency: z.ZodOptional<z.ZodObject<{
            from: z.ZodOptional<z.ZodNumber>;
            to: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        ceiling: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type WorkflowLaunchMeta = z.infer<typeof workflowLaunchMetaSchema>;
//# sourceMappingURL=workflow-row-meta.d.ts.map