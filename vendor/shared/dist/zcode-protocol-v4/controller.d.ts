import { z } from "zod";
export declare const CONTROLLER_WORKSPACES_TOPIC: "controller/workspaces";
export declare const CONTROLLER_TASKS_INDEX_TOPIC: "controller/tasks-index";
export declare const windowHostControllerTopicSchema: z.ZodEnum<{
    "controller/workspaces": "controller/workspaces";
    "controller/tasks-index": "controller/tasks-index";
}>;
export type WindowHostControllerTopic = z.infer<typeof windowHostControllerTopicSchema>;
export declare const windowHostTaskAddressSchema: z.ZodObject<{
    remoteSessionId: z.ZodOptional<z.ZodString>;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    taskId: z.ZodString;
}, z.core.$strict>;
export type WindowHostTaskAddress = z.infer<typeof windowHostTaskAddressSchema>;
export declare const windowHostControllerWorkspaceFactSchema: z.ZodObject<{
    remoteSessionId: z.ZodOptional<z.ZodString>;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    sourceAvailability: z.ZodEnum<{
        online: "online";
        offline: "offline";
    }>;
    connectionState: z.ZodEnum<{
        failed: "failed";
        connecting: "connecting";
        disconnected: "disconnected";
        reconnecting: "reconnecting";
        online: "online";
        closing: "closing";
    }>;
}, z.core.$strict>;
export type WindowHostControllerWorkspaceFact = z.infer<typeof windowHostControllerWorkspaceFactSchema>;
export declare const windowHostControllerTaskActivitySchema: z.ZodObject<{
    phase: z.ZodEnum<{
        running: "running";
        error: "error";
        draft: "draft";
        completedSuccess: "completedSuccess";
        completedInterrupted: "completedInterrupted";
        prewarming: "prewarming";
    }>;
    lastActivityAt: z.ZodNumber;
    hasBackgroundWork: z.ZodBoolean;
    pendingInteractions: z.ZodOptional<z.ZodObject<{
        permissionCount: z.ZodNumber;
        userInputCount: z.ZodNumber;
    }, z.core.$strip>>;
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
}, z.core.$strict>;
export type WindowHostControllerTaskActivity = z.infer<typeof windowHostControllerTaskActivitySchema>;
export declare const windowHostControllerTaskRowSchema: z.ZodObject<{
    address: z.ZodObject<{
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        taskId: z.ZodString;
    }, z.core.$strict>;
    meta: z.ZodObject<{
        taskId: z.ZodString;
        traceId: z.ZodString;
        title: z.ZodString;
        titleOverridden: z.ZodOptional<z.ZodBoolean>;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        workspacePurpose: z.ZodOptional<z.ZodEnum<{
            project: "project";
            conversation: "conversation";
        }>>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        mode: z.ZodEnum<{
            default: "default";
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
            auto: "auto";
            acceptEdits: "acceptEdits";
            dontAsk: "dontAsk";
            bypassPermissions: "bypassPermissions";
            autoEdit: "autoEdit";
        }>;
        model: z.ZodOptional<z.ZodString>;
        thoughtLevel: z.ZodOptional<z.ZodString>;
        runtimeEpoch: z.ZodOptional<z.ZodNumber>;
        provider: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
            claude: "claude";
            glm: "glm";
            opencode: "opencode";
            gemini: "gemini";
            codex: "codex";
        }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>>;
        migrationSource: z.ZodOptional<z.ZodEnum<{
            claudeCode: "claudeCode";
        }>>;
        forkedFromTaskId: z.ZodOptional<z.ZodString>;
        cronAutomationId: z.ZodOptional<z.ZodString>;
        offPeakTaskId: z.ZodOptional<z.ZodString>;
        unreadAt: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<{
            running: "running";
            completed: "completed";
            error: "error";
        }>>;
        lastError: z.ZodOptional<z.ZodObject<{
            code: z.ZodOptional<z.ZodString>;
            detail: z.ZodOptional<z.ZodString>;
            message: z.ZodString;
            traceId: z.ZodOptional<z.ZodString>;
            taskId: z.ZodOptional<z.ZodString>;
            attribution: z.ZodOptional<z.ZodObject<{
                source: z.ZodOptional<z.ZodEnum<{
                    provider: "provider";
                    tool: "tool";
                    runtime: "runtime";
                    network: "network";
                }>>;
                reason: z.ZodOptional<z.ZodString>;
                errorPhase: z.ZodOptional<z.ZodEnum<{
                    response: "response";
                    prepare: "prepare";
                    configuration: "configuration";
                    connect: "connect";
                    stream: "stream";
                    parse: "parse";
                    validation: "validation";
                    unhandled: "unhandled";
                }>>;
                exceptionKind: z.ZodOptional<z.ZodEnum<{
                    validation: "validation";
                    api_call: "api_call";
                    generic: "generic";
                    protocol: "protocol";
                    provider_business: "provider_business";
                    transport: "transport";
                    type_error: "type_error";
                }>>;
                providerId: z.ZodOptional<z.ZodString>;
                modelId: z.ZodOptional<z.ZodString>;
                providerKind: z.ZodOptional<z.ZodString>;
                transport: z.ZodOptional<z.ZodEnum<{
                    http: "http";
                    sse: "sse";
                    websocket: "websocket";
                }>>;
                statusCode: z.ZodOptional<z.ZodNumber>;
                providerErrorCode: z.ZodOptional<z.ZodString>;
                retryable: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
        }, z.core.$strip>>;
        repairState: z.ZodOptional<z.ZodObject<{
            claudeNativeSnapshotAssistantContentVersion: z.ZodOptional<z.ZodNumber>;
            codexNativeSnapshotSubagentToolsVersion: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        changeSummary: z.ZodOptional<z.ZodObject<{
            fileCount: z.ZodNumber;
            added: z.ZodNumber;
            removed: z.ZodNumber;
            files: z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                added: z.ZodNumber;
                removed: z.ZodNumber;
                writeCount: z.ZodNumber;
                lastTurnIndex: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            sessionID: z.ZodString;
            targetID: z.ZodString;
            objective: z.ZodString;
            summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
            status: z.ZodEnum<{
                active: "active";
                complete: "complete";
                paused: "paused";
                budget_limited: "budget_limited";
            }>;
            tokenBudget: z.ZodNullable<z.ZodNumber>;
            tokensUsed: z.ZodNumber;
            timeUsedSeconds: z.ZodNumber;
            activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            time: z.ZodObject<{
                created: z.ZodNumber;
                updated: z.ZodNumber;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
    membership: z.ZodObject<{
        pinned: z.ZodBoolean;
        archived: z.ZodBoolean;
        active: z.ZodBoolean;
    }, z.core.$strict>;
    sourceAvailability: z.ZodEnum<{
        online: "online";
        offline: "offline";
    }>;
    liveStatus: z.ZodEnum<{
        running: "running";
        completed: "completed";
        error: "error";
        idle: "idle";
        waiting: "waiting";
    }>;
    activity: z.ZodOptional<z.ZodObject<{
        phase: z.ZodEnum<{
            running: "running";
            error: "error";
            draft: "draft";
            completedSuccess: "completedSuccess";
            completedInterrupted: "completedInterrupted";
            prewarming: "prewarming";
        }>;
        lastActivityAt: z.ZodNumber;
        hasBackgroundWork: z.ZodBoolean;
        pendingInteractions: z.ZodOptional<z.ZodObject<{
            permissionCount: z.ZodNumber;
            userInputCount: z.ZodNumber;
        }, z.core.$strip>>;
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
    }, z.core.$strict>>;
    searchSnippets: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export type WindowHostControllerTaskRow = z.infer<typeof windowHostControllerTaskRowSchema>;
export type TaskListMembershipKind = "pinned" | "archived" | "timeline" | "active";
/** Host 查询和各 Renderer 投影共用的 task list membership 判定。 */
export declare function matchesTaskListMembershipKind(membership: Pick<WindowHostControllerTaskRow["membership"], "pinned" | "archived">, kind: TaskListMembershipKind): boolean;
export declare const windowHostControllerWorkspacesSnapshotSchema: z.ZodObject<{
    protocolVersion: z.ZodLiteral<1>;
    logEpoch: z.ZodString;
    workspaces: z.ZodArray<z.ZodObject<{
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        sourceAvailability: z.ZodEnum<{
            online: "online";
            offline: "offline";
        }>;
        connectionState: z.ZodEnum<{
            failed: "failed";
            connecting: "connecting";
            disconnected: "disconnected";
            reconnecting: "reconnecting";
            online: "online";
            closing: "closing";
        }>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type WindowHostControllerWorkspacesSnapshot = z.infer<typeof windowHostControllerWorkspacesSnapshotSchema>;
export declare const windowHostControllerTasksSnapshotSchema: z.ZodObject<{
    protocolVersion: z.ZodLiteral<1>;
    logEpoch: z.ZodString;
    tasks: z.ZodArray<z.ZodObject<{
        address: z.ZodObject<{
            remoteSessionId: z.ZodOptional<z.ZodString>;
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            taskId: z.ZodString;
        }, z.core.$strict>;
        meta: z.ZodObject<{
            taskId: z.ZodString;
            traceId: z.ZodString;
            title: z.ZodString;
            titleOverridden: z.ZodOptional<z.ZodBoolean>;
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            workspacePurpose: z.ZodOptional<z.ZodEnum<{
                project: "project";
                conversation: "conversation";
            }>>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
            mode: z.ZodEnum<{
                default: "default";
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
                acceptEdits: "acceptEdits";
                dontAsk: "dontAsk";
                bypassPermissions: "bypassPermissions";
                autoEdit: "autoEdit";
            }>;
            model: z.ZodOptional<z.ZodString>;
            thoughtLevel: z.ZodOptional<z.ZodString>;
            runtimeEpoch: z.ZodOptional<z.ZodNumber>;
            provider: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
                claude: "claude";
                glm: "glm";
                opencode: "opencode";
                gemini: "gemini";
                codex: "codex";
            }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>>;
            migrationSource: z.ZodOptional<z.ZodEnum<{
                claudeCode: "claudeCode";
            }>>;
            forkedFromTaskId: z.ZodOptional<z.ZodString>;
            cronAutomationId: z.ZodOptional<z.ZodString>;
            offPeakTaskId: z.ZodOptional<z.ZodString>;
            unreadAt: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
            }>>;
            lastError: z.ZodOptional<z.ZodObject<{
                code: z.ZodOptional<z.ZodString>;
                detail: z.ZodOptional<z.ZodString>;
                message: z.ZodString;
                traceId: z.ZodOptional<z.ZodString>;
                taskId: z.ZodOptional<z.ZodString>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodOptional<z.ZodEnum<{
                        provider: "provider";
                        tool: "tool";
                        runtime: "runtime";
                        network: "network";
                    }>>;
                    reason: z.ZodOptional<z.ZodString>;
                    errorPhase: z.ZodOptional<z.ZodEnum<{
                        response: "response";
                        prepare: "prepare";
                        configuration: "configuration";
                        connect: "connect";
                        stream: "stream";
                        parse: "parse";
                        validation: "validation";
                        unhandled: "unhandled";
                    }>>;
                    exceptionKind: z.ZodOptional<z.ZodEnum<{
                        validation: "validation";
                        api_call: "api_call";
                        generic: "generic";
                        protocol: "protocol";
                        provider_business: "provider_business";
                        transport: "transport";
                        type_error: "type_error";
                    }>>;
                    providerId: z.ZodOptional<z.ZodString>;
                    modelId: z.ZodOptional<z.ZodString>;
                    providerKind: z.ZodOptional<z.ZodString>;
                    transport: z.ZodOptional<z.ZodEnum<{
                        http: "http";
                        sse: "sse";
                        websocket: "websocket";
                    }>>;
                    statusCode: z.ZodOptional<z.ZodNumber>;
                    providerErrorCode: z.ZodOptional<z.ZodString>;
                    retryable: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>>;
            }, z.core.$strip>>;
            repairState: z.ZodOptional<z.ZodObject<{
                claudeNativeSnapshotAssistantContentVersion: z.ZodOptional<z.ZodNumber>;
                codexNativeSnapshotSubagentToolsVersion: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            changeSummary: z.ZodOptional<z.ZodObject<{
                fileCount: z.ZodNumber;
                added: z.ZodNumber;
                removed: z.ZodNumber;
                files: z.ZodArray<z.ZodObject<{
                    path: z.ZodString;
                    added: z.ZodNumber;
                    removed: z.ZodNumber;
                    writeCount: z.ZodNumber;
                    lastTurnIndex: z.ZodNumber;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                sessionID: z.ZodString;
                targetID: z.ZodString;
                objective: z.ZodString;
                summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                status: z.ZodEnum<{
                    active: "active";
                    complete: "complete";
                    paused: "paused";
                    budget_limited: "budget_limited";
                }>;
                tokenBudget: z.ZodNullable<z.ZodNumber>;
                tokensUsed: z.ZodNumber;
                timeUsedSeconds: z.ZodNumber;
                activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                time: z.ZodObject<{
                    created: z.ZodNumber;
                    updated: z.ZodNumber;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
        }, z.core.$strip>;
        membership: z.ZodObject<{
            pinned: z.ZodBoolean;
            archived: z.ZodBoolean;
            active: z.ZodBoolean;
        }, z.core.$strict>;
        sourceAvailability: z.ZodEnum<{
            online: "online";
            offline: "offline";
        }>;
        liveStatus: z.ZodEnum<{
            running: "running";
            completed: "completed";
            error: "error";
            idle: "idle";
            waiting: "waiting";
        }>;
        activity: z.ZodOptional<z.ZodObject<{
            phase: z.ZodEnum<{
                running: "running";
                error: "error";
                draft: "draft";
                completedSuccess: "completedSuccess";
                completedInterrupted: "completedInterrupted";
                prewarming: "prewarming";
            }>;
            lastActivityAt: z.ZodNumber;
            hasBackgroundWork: z.ZodBoolean;
            pendingInteractions: z.ZodOptional<z.ZodObject<{
                permissionCount: z.ZodNumber;
                userInputCount: z.ZodNumber;
            }, z.core.$strip>>;
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
        }, z.core.$strict>>;
        searchSnippets: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type WindowHostControllerTasksSnapshot = z.infer<typeof windowHostControllerTasksSnapshotSchema>;
export declare const windowHostControllerWorkspaceDeltaSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    op: z.ZodLiteral<"workspace.upserted">;
    workspace: z.ZodObject<{
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        sourceAvailability: z.ZodEnum<{
            online: "online";
            offline: "offline";
        }>;
        connectionState: z.ZodEnum<{
            failed: "failed";
            connecting: "connecting";
            disconnected: "disconnected";
            reconnecting: "reconnecting";
            online: "online";
            closing: "closing";
        }>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    op: z.ZodLiteral<"workspace.removed">;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
}, z.core.$strict>], "op">;
export type WindowHostControllerWorkspaceDelta = z.infer<typeof windowHostControllerWorkspaceDeltaSchema>;
export declare const windowHostControllerTaskDeltaSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    op: z.ZodLiteral<"task.upserted">;
    task: z.ZodObject<{
        address: z.ZodObject<{
            remoteSessionId: z.ZodOptional<z.ZodString>;
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            taskId: z.ZodString;
        }, z.core.$strict>;
        meta: z.ZodObject<{
            taskId: z.ZodString;
            traceId: z.ZodString;
            title: z.ZodString;
            titleOverridden: z.ZodOptional<z.ZodBoolean>;
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            workspacePurpose: z.ZodOptional<z.ZodEnum<{
                project: "project";
                conversation: "conversation";
            }>>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
            mode: z.ZodEnum<{
                default: "default";
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
                acceptEdits: "acceptEdits";
                dontAsk: "dontAsk";
                bypassPermissions: "bypassPermissions";
                autoEdit: "autoEdit";
            }>;
            model: z.ZodOptional<z.ZodString>;
            thoughtLevel: z.ZodOptional<z.ZodString>;
            runtimeEpoch: z.ZodOptional<z.ZodNumber>;
            provider: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
                claude: "claude";
                glm: "glm";
                opencode: "opencode";
                gemini: "gemini";
                codex: "codex";
            }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>>;
            migrationSource: z.ZodOptional<z.ZodEnum<{
                claudeCode: "claudeCode";
            }>>;
            forkedFromTaskId: z.ZodOptional<z.ZodString>;
            cronAutomationId: z.ZodOptional<z.ZodString>;
            offPeakTaskId: z.ZodOptional<z.ZodString>;
            unreadAt: z.ZodOptional<z.ZodNumber>;
            status: z.ZodOptional<z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
            }>>;
            lastError: z.ZodOptional<z.ZodObject<{
                code: z.ZodOptional<z.ZodString>;
                detail: z.ZodOptional<z.ZodString>;
                message: z.ZodString;
                traceId: z.ZodOptional<z.ZodString>;
                taskId: z.ZodOptional<z.ZodString>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodOptional<z.ZodEnum<{
                        provider: "provider";
                        tool: "tool";
                        runtime: "runtime";
                        network: "network";
                    }>>;
                    reason: z.ZodOptional<z.ZodString>;
                    errorPhase: z.ZodOptional<z.ZodEnum<{
                        response: "response";
                        prepare: "prepare";
                        configuration: "configuration";
                        connect: "connect";
                        stream: "stream";
                        parse: "parse";
                        validation: "validation";
                        unhandled: "unhandled";
                    }>>;
                    exceptionKind: z.ZodOptional<z.ZodEnum<{
                        validation: "validation";
                        api_call: "api_call";
                        generic: "generic";
                        protocol: "protocol";
                        provider_business: "provider_business";
                        transport: "transport";
                        type_error: "type_error";
                    }>>;
                    providerId: z.ZodOptional<z.ZodString>;
                    modelId: z.ZodOptional<z.ZodString>;
                    providerKind: z.ZodOptional<z.ZodString>;
                    transport: z.ZodOptional<z.ZodEnum<{
                        http: "http";
                        sse: "sse";
                        websocket: "websocket";
                    }>>;
                    statusCode: z.ZodOptional<z.ZodNumber>;
                    providerErrorCode: z.ZodOptional<z.ZodString>;
                    retryable: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>>;
            }, z.core.$strip>>;
            repairState: z.ZodOptional<z.ZodObject<{
                claudeNativeSnapshotAssistantContentVersion: z.ZodOptional<z.ZodNumber>;
                codexNativeSnapshotSubagentToolsVersion: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            changeSummary: z.ZodOptional<z.ZodObject<{
                fileCount: z.ZodNumber;
                added: z.ZodNumber;
                removed: z.ZodNumber;
                files: z.ZodArray<z.ZodObject<{
                    path: z.ZodString;
                    added: z.ZodNumber;
                    removed: z.ZodNumber;
                    writeCount: z.ZodNumber;
                    lastTurnIndex: z.ZodNumber;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                sessionID: z.ZodString;
                targetID: z.ZodString;
                objective: z.ZodString;
                summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                status: z.ZodEnum<{
                    active: "active";
                    complete: "complete";
                    paused: "paused";
                    budget_limited: "budget_limited";
                }>;
                tokenBudget: z.ZodNullable<z.ZodNumber>;
                tokensUsed: z.ZodNumber;
                timeUsedSeconds: z.ZodNumber;
                activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                time: z.ZodObject<{
                    created: z.ZodNumber;
                    updated: z.ZodNumber;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
        }, z.core.$strip>;
        membership: z.ZodObject<{
            pinned: z.ZodBoolean;
            archived: z.ZodBoolean;
            active: z.ZodBoolean;
        }, z.core.$strict>;
        sourceAvailability: z.ZodEnum<{
            online: "online";
            offline: "offline";
        }>;
        liveStatus: z.ZodEnum<{
            running: "running";
            completed: "completed";
            error: "error";
            idle: "idle";
            waiting: "waiting";
        }>;
        activity: z.ZodOptional<z.ZodObject<{
            phase: z.ZodEnum<{
                running: "running";
                error: "error";
                draft: "draft";
                completedSuccess: "completedSuccess";
                completedInterrupted: "completedInterrupted";
                prewarming: "prewarming";
            }>;
            lastActivityAt: z.ZodNumber;
            hasBackgroundWork: z.ZodBoolean;
            pendingInteractions: z.ZodOptional<z.ZodObject<{
                permissionCount: z.ZodNumber;
                userInputCount: z.ZodNumber;
            }, z.core.$strip>>;
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
        }, z.core.$strict>>;
        searchSnippets: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    op: z.ZodLiteral<"task.removed">;
    address: z.ZodObject<{
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        taskId: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>], "op">;
export type WindowHostControllerTaskDelta = z.infer<typeof windowHostControllerTaskDeltaSchema>;
export declare const windowHostControllerWorkspaceFrameSchema: z.ZodObject<{
    topic: z.ZodLiteral<"controller/workspaces" | "controller/tasks-index">;
    subscriptionId: z.ZodString;
    logEpoch: z.ZodString;
    fromSeq: z.ZodNumber;
    toSeq: z.ZodNumber;
    sentAt: z.ZodNumber;
    payload: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"snapshot">;
        snapshot: z.ZodObject<{
            protocolVersion: z.ZodLiteral<1>;
            logEpoch: z.ZodString;
            workspaces: z.ZodArray<z.ZodObject<{
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                sourceAvailability: z.ZodEnum<{
                    online: "online";
                    offline: "offline";
                }>;
                connectionState: z.ZodEnum<{
                    failed: "failed";
                    connecting: "connecting";
                    disconnected: "disconnected";
                    reconnecting: "reconnecting";
                    online: "online";
                    closing: "closing";
                }>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"deltas">;
        deltas: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            op: z.ZodLiteral<"workspace.upserted">;
            workspace: z.ZodObject<{
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                sourceAvailability: z.ZodEnum<{
                    online: "online";
                    offline: "offline";
                }>;
                connectionState: z.ZodEnum<{
                    failed: "failed";
                    connecting: "connecting";
                    disconnected: "disconnected";
                    reconnecting: "reconnecting";
                    online: "online";
                    closing: "closing";
                }>;
            }, z.core.$strict>;
        }, z.core.$strict>, z.ZodObject<{
            op: z.ZodLiteral<"workspace.removed">;
            remoteSessionId: z.ZodOptional<z.ZodString>;
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "op">>;
    }, z.core.$strict>], "kind">;
}, z.core.$strict>;
export type WindowHostControllerWorkspaceFrame = z.infer<typeof windowHostControllerWorkspaceFrameSchema>;
export declare const windowHostControllerTaskFrameSchema: z.ZodObject<{
    topic: z.ZodLiteral<"controller/workspaces" | "controller/tasks-index">;
    subscriptionId: z.ZodString;
    logEpoch: z.ZodString;
    fromSeq: z.ZodNumber;
    toSeq: z.ZodNumber;
    sentAt: z.ZodNumber;
    payload: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"snapshot">;
        snapshot: z.ZodObject<{
            protocolVersion: z.ZodLiteral<1>;
            logEpoch: z.ZodString;
            tasks: z.ZodArray<z.ZodObject<{
                address: z.ZodObject<{
                    remoteSessionId: z.ZodOptional<z.ZodString>;
                    workspacePath: z.ZodString;
                    workspaceIdentity: z.ZodOptional<z.ZodString>;
                    taskId: z.ZodString;
                }, z.core.$strict>;
                meta: z.ZodObject<{
                    taskId: z.ZodString;
                    traceId: z.ZodString;
                    title: z.ZodString;
                    titleOverridden: z.ZodOptional<z.ZodBoolean>;
                    workspacePath: z.ZodString;
                    workspaceIdentity: z.ZodOptional<z.ZodString>;
                    workspacePurpose: z.ZodOptional<z.ZodEnum<{
                        project: "project";
                        conversation: "conversation";
                    }>>;
                    createdAt: z.ZodNumber;
                    updatedAt: z.ZodNumber;
                    mode: z.ZodEnum<{
                        default: "default";
                        plan: "plan";
                        build: "build";
                        edit: "edit";
                        yolo: "yolo";
                        guarded: "guarded";
                        auto: "auto";
                        acceptEdits: "acceptEdits";
                        dontAsk: "dontAsk";
                        bypassPermissions: "bypassPermissions";
                        autoEdit: "autoEdit";
                    }>;
                    model: z.ZodOptional<z.ZodString>;
                    thoughtLevel: z.ZodOptional<z.ZodString>;
                    runtimeEpoch: z.ZodOptional<z.ZodNumber>;
                    provider: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
                        claude: "claude";
                        glm: "glm";
                        opencode: "opencode";
                        gemini: "gemini";
                        codex: "codex";
                    }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>>;
                    migrationSource: z.ZodOptional<z.ZodEnum<{
                        claudeCode: "claudeCode";
                    }>>;
                    forkedFromTaskId: z.ZodOptional<z.ZodString>;
                    cronAutomationId: z.ZodOptional<z.ZodString>;
                    offPeakTaskId: z.ZodOptional<z.ZodString>;
                    unreadAt: z.ZodOptional<z.ZodNumber>;
                    status: z.ZodOptional<z.ZodEnum<{
                        running: "running";
                        completed: "completed";
                        error: "error";
                    }>>;
                    lastError: z.ZodOptional<z.ZodObject<{
                        code: z.ZodOptional<z.ZodString>;
                        detail: z.ZodOptional<z.ZodString>;
                        message: z.ZodString;
                        traceId: z.ZodOptional<z.ZodString>;
                        taskId: z.ZodOptional<z.ZodString>;
                        attribution: z.ZodOptional<z.ZodObject<{
                            source: z.ZodOptional<z.ZodEnum<{
                                provider: "provider";
                                tool: "tool";
                                runtime: "runtime";
                                network: "network";
                            }>>;
                            reason: z.ZodOptional<z.ZodString>;
                            errorPhase: z.ZodOptional<z.ZodEnum<{
                                response: "response";
                                prepare: "prepare";
                                configuration: "configuration";
                                connect: "connect";
                                stream: "stream";
                                parse: "parse";
                                validation: "validation";
                                unhandled: "unhandled";
                            }>>;
                            exceptionKind: z.ZodOptional<z.ZodEnum<{
                                validation: "validation";
                                api_call: "api_call";
                                generic: "generic";
                                protocol: "protocol";
                                provider_business: "provider_business";
                                transport: "transport";
                                type_error: "type_error";
                            }>>;
                            providerId: z.ZodOptional<z.ZodString>;
                            modelId: z.ZodOptional<z.ZodString>;
                            providerKind: z.ZodOptional<z.ZodString>;
                            transport: z.ZodOptional<z.ZodEnum<{
                                http: "http";
                                sse: "sse";
                                websocket: "websocket";
                            }>>;
                            statusCode: z.ZodOptional<z.ZodNumber>;
                            providerErrorCode: z.ZodOptional<z.ZodString>;
                            retryable: z.ZodOptional<z.ZodBoolean>;
                        }, z.core.$strict>>;
                    }, z.core.$strip>>;
                    repairState: z.ZodOptional<z.ZodObject<{
                        claudeNativeSnapshotAssistantContentVersion: z.ZodOptional<z.ZodNumber>;
                        codexNativeSnapshotSubagentToolsVersion: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strip>>;
                    changeSummary: z.ZodOptional<z.ZodObject<{
                        fileCount: z.ZodNumber;
                        added: z.ZodNumber;
                        removed: z.ZodNumber;
                        files: z.ZodArray<z.ZodObject<{
                            path: z.ZodString;
                            added: z.ZodNumber;
                            removed: z.ZodNumber;
                            writeCount: z.ZodNumber;
                            lastTurnIndex: z.ZodNumber;
                        }, z.core.$strip>>;
                    }, z.core.$strip>>;
                    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        sessionID: z.ZodString;
                        targetID: z.ZodString;
                        objective: z.ZodString;
                        summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                        status: z.ZodEnum<{
                            active: "active";
                            complete: "complete";
                            paused: "paused";
                            budget_limited: "budget_limited";
                        }>;
                        tokenBudget: z.ZodNullable<z.ZodNumber>;
                        tokensUsed: z.ZodNumber;
                        timeUsedSeconds: z.ZodNumber;
                        activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                        activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                        time: z.ZodObject<{
                            created: z.ZodNumber;
                            updated: z.ZodNumber;
                        }, z.core.$strip>;
                    }, z.core.$strip>>>;
                }, z.core.$strip>;
                membership: z.ZodObject<{
                    pinned: z.ZodBoolean;
                    archived: z.ZodBoolean;
                    active: z.ZodBoolean;
                }, z.core.$strict>;
                sourceAvailability: z.ZodEnum<{
                    online: "online";
                    offline: "offline";
                }>;
                liveStatus: z.ZodEnum<{
                    running: "running";
                    completed: "completed";
                    error: "error";
                    idle: "idle";
                    waiting: "waiting";
                }>;
                activity: z.ZodOptional<z.ZodObject<{
                    phase: z.ZodEnum<{
                        running: "running";
                        error: "error";
                        draft: "draft";
                        completedSuccess: "completedSuccess";
                        completedInterrupted: "completedInterrupted";
                        prewarming: "prewarming";
                    }>;
                    lastActivityAt: z.ZodNumber;
                    hasBackgroundWork: z.ZodBoolean;
                    pendingInteractions: z.ZodOptional<z.ZodObject<{
                        permissionCount: z.ZodNumber;
                        userInputCount: z.ZodNumber;
                    }, z.core.$strip>>;
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
                }, z.core.$strict>>;
                searchSnippets: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"deltas">;
        deltas: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            op: z.ZodLiteral<"task.upserted">;
            task: z.ZodObject<{
                address: z.ZodObject<{
                    remoteSessionId: z.ZodOptional<z.ZodString>;
                    workspacePath: z.ZodString;
                    workspaceIdentity: z.ZodOptional<z.ZodString>;
                    taskId: z.ZodString;
                }, z.core.$strict>;
                meta: z.ZodObject<{
                    taskId: z.ZodString;
                    traceId: z.ZodString;
                    title: z.ZodString;
                    titleOverridden: z.ZodOptional<z.ZodBoolean>;
                    workspacePath: z.ZodString;
                    workspaceIdentity: z.ZodOptional<z.ZodString>;
                    workspacePurpose: z.ZodOptional<z.ZodEnum<{
                        project: "project";
                        conversation: "conversation";
                    }>>;
                    createdAt: z.ZodNumber;
                    updatedAt: z.ZodNumber;
                    mode: z.ZodEnum<{
                        default: "default";
                        plan: "plan";
                        build: "build";
                        edit: "edit";
                        yolo: "yolo";
                        guarded: "guarded";
                        auto: "auto";
                        acceptEdits: "acceptEdits";
                        dontAsk: "dontAsk";
                        bypassPermissions: "bypassPermissions";
                        autoEdit: "autoEdit";
                    }>;
                    model: z.ZodOptional<z.ZodString>;
                    thoughtLevel: z.ZodOptional<z.ZodString>;
                    runtimeEpoch: z.ZodOptional<z.ZodNumber>;
                    provider: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
                        claude: "claude";
                        glm: "glm";
                        opencode: "opencode";
                        gemini: "gemini";
                        codex: "codex";
                    }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>>;
                    migrationSource: z.ZodOptional<z.ZodEnum<{
                        claudeCode: "claudeCode";
                    }>>;
                    forkedFromTaskId: z.ZodOptional<z.ZodString>;
                    cronAutomationId: z.ZodOptional<z.ZodString>;
                    offPeakTaskId: z.ZodOptional<z.ZodString>;
                    unreadAt: z.ZodOptional<z.ZodNumber>;
                    status: z.ZodOptional<z.ZodEnum<{
                        running: "running";
                        completed: "completed";
                        error: "error";
                    }>>;
                    lastError: z.ZodOptional<z.ZodObject<{
                        code: z.ZodOptional<z.ZodString>;
                        detail: z.ZodOptional<z.ZodString>;
                        message: z.ZodString;
                        traceId: z.ZodOptional<z.ZodString>;
                        taskId: z.ZodOptional<z.ZodString>;
                        attribution: z.ZodOptional<z.ZodObject<{
                            source: z.ZodOptional<z.ZodEnum<{
                                provider: "provider";
                                tool: "tool";
                                runtime: "runtime";
                                network: "network";
                            }>>;
                            reason: z.ZodOptional<z.ZodString>;
                            errorPhase: z.ZodOptional<z.ZodEnum<{
                                response: "response";
                                prepare: "prepare";
                                configuration: "configuration";
                                connect: "connect";
                                stream: "stream";
                                parse: "parse";
                                validation: "validation";
                                unhandled: "unhandled";
                            }>>;
                            exceptionKind: z.ZodOptional<z.ZodEnum<{
                                validation: "validation";
                                api_call: "api_call";
                                generic: "generic";
                                protocol: "protocol";
                                provider_business: "provider_business";
                                transport: "transport";
                                type_error: "type_error";
                            }>>;
                            providerId: z.ZodOptional<z.ZodString>;
                            modelId: z.ZodOptional<z.ZodString>;
                            providerKind: z.ZodOptional<z.ZodString>;
                            transport: z.ZodOptional<z.ZodEnum<{
                                http: "http";
                                sse: "sse";
                                websocket: "websocket";
                            }>>;
                            statusCode: z.ZodOptional<z.ZodNumber>;
                            providerErrorCode: z.ZodOptional<z.ZodString>;
                            retryable: z.ZodOptional<z.ZodBoolean>;
                        }, z.core.$strict>>;
                    }, z.core.$strip>>;
                    repairState: z.ZodOptional<z.ZodObject<{
                        claudeNativeSnapshotAssistantContentVersion: z.ZodOptional<z.ZodNumber>;
                        codexNativeSnapshotSubagentToolsVersion: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strip>>;
                    changeSummary: z.ZodOptional<z.ZodObject<{
                        fileCount: z.ZodNumber;
                        added: z.ZodNumber;
                        removed: z.ZodNumber;
                        files: z.ZodArray<z.ZodObject<{
                            path: z.ZodString;
                            added: z.ZodNumber;
                            removed: z.ZodNumber;
                            writeCount: z.ZodNumber;
                            lastTurnIndex: z.ZodNumber;
                        }, z.core.$strip>>;
                    }, z.core.$strip>>;
                    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        sessionID: z.ZodString;
                        targetID: z.ZodString;
                        objective: z.ZodString;
                        summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                        status: z.ZodEnum<{
                            active: "active";
                            complete: "complete";
                            paused: "paused";
                            budget_limited: "budget_limited";
                        }>;
                        tokenBudget: z.ZodNullable<z.ZodNumber>;
                        tokensUsed: z.ZodNumber;
                        timeUsedSeconds: z.ZodNumber;
                        activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                        activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                        time: z.ZodObject<{
                            created: z.ZodNumber;
                            updated: z.ZodNumber;
                        }, z.core.$strip>;
                    }, z.core.$strip>>>;
                }, z.core.$strip>;
                membership: z.ZodObject<{
                    pinned: z.ZodBoolean;
                    archived: z.ZodBoolean;
                    active: z.ZodBoolean;
                }, z.core.$strict>;
                sourceAvailability: z.ZodEnum<{
                    online: "online";
                    offline: "offline";
                }>;
                liveStatus: z.ZodEnum<{
                    running: "running";
                    completed: "completed";
                    error: "error";
                    idle: "idle";
                    waiting: "waiting";
                }>;
                activity: z.ZodOptional<z.ZodObject<{
                    phase: z.ZodEnum<{
                        running: "running";
                        error: "error";
                        draft: "draft";
                        completedSuccess: "completedSuccess";
                        completedInterrupted: "completedInterrupted";
                        prewarming: "prewarming";
                    }>;
                    lastActivityAt: z.ZodNumber;
                    hasBackgroundWork: z.ZodBoolean;
                    pendingInteractions: z.ZodOptional<z.ZodObject<{
                        permissionCount: z.ZodNumber;
                        userInputCount: z.ZodNumber;
                    }, z.core.$strip>>;
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
                }, z.core.$strict>>;
                searchSnippets: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strict>;
        }, z.core.$strict>, z.ZodObject<{
            op: z.ZodLiteral<"task.removed">;
            address: z.ZodObject<{
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                taskId: z.ZodString;
            }, z.core.$strict>;
        }, z.core.$strict>], "op">>;
    }, z.core.$strict>], "kind">;
}, z.core.$strict>;
export type WindowHostControllerTaskFrame = z.infer<typeof windowHostControllerTaskFrameSchema>;
export declare const controllerSubscribeParamsSchema: z.ZodObject<{
    topic: z.ZodEnum<{
        "controller/workspaces": "controller/workspaces";
        "controller/tasks-index": "controller/tasks-index";
    }>;
    base: z.ZodOptional<z.ZodObject<{
        logEpoch: z.ZodString;
        seq: z.ZodNumber;
    }, z.core.$strict>>;
    visibility: z.ZodOptional<z.ZodEnum<{
        background: "background";
        foreground: "foreground";
    }>>;
}, z.core.$strict>;
export type ControllerSubscribeParams = z.infer<typeof controllerSubscribeParamsSchema>;
export declare const controllerSubscribeResultSchema: z.ZodObject<{
    ack: z.ZodObject<{
        subscriptionId: z.ZodString;
        mode: z.ZodEnum<{
            snapshot: "snapshot";
            resume: "resume";
        }>;
        logEpoch: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strict>;
export type ControllerSubscribeResult = z.infer<typeof controllerSubscribeResultSchema>;
export declare const controllerResyncParamsSchema: z.ZodObject<{
    subscriptionId: z.ZodString;
    base: z.ZodNullable<z.ZodObject<{
        logEpoch: z.ZodString;
        seq: z.ZodNumber;
    }, z.core.$strict>>;
    forceSnapshot: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ControllerResyncParams = z.infer<typeof controllerResyncParamsSchema>;
export declare const controllerResyncResultSchema: z.ZodObject<{
    ack: z.ZodObject<{
        subscriptionId: z.ZodString;
        mode: z.ZodEnum<{
            snapshot: "snapshot";
            resume: "resume";
        }>;
        logEpoch: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strict>;
export type ControllerResyncResult = z.infer<typeof controllerResyncResultSchema>;
export declare const controllerUnsubscribeParamsSchema: z.ZodObject<{
    subscriptionId: z.ZodString;
}, z.core.$strict>;
export type ControllerUnsubscribeParams = z.infer<typeof controllerUnsubscribeParamsSchema>;
export interface WindowHostControllerCursor {
    subscriptionId: string;
    logEpoch: string;
    seq: number;
}
export interface WindowHostControllerFrameStart {
    subscriptionId: string;
    logEpoch: string;
    fromSeq: number;
}
export declare function isWindowHostControllerFrameGap(cursor: WindowHostControllerCursor, frame: WindowHostControllerFrameStart): boolean;
//# sourceMappingURL=controller.d.ts.map