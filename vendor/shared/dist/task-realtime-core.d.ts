import { z } from "zod";
export declare function resolveWorkspaceKey(params: {
    workspacePath: string;
    workspaceIdentity?: string;
}): string;
export declare const taskRealtimeReasonSchema: z.ZodEnum<{
    task_created: "task_created";
    user_message_saved: "user_message_saved";
    assistant_message_saved: "assistant_message_saved";
    task_status_changed: "task_status_changed";
    task_meta_changed: "task_meta_changed";
    task_model_changed: "task_model_changed";
    task_title_changed: "task_title_changed";
    task_pinned: "task_pinned";
    task_unpinned: "task_unpinned";
    task_archived: "task_archived";
    task_unarchived: "task_unarchived";
    task_deleted: "task_deleted";
    stream_mirror_gap: "stream_mirror_gap";
    stream_mirror_owner_lost: "stream_mirror_owner_lost";
}>;
export declare const taskRealtimeDeliveryPurposeSchema: z.ZodEnum<{
    observer: "observer";
    relay_owner: "relay_owner";
}>;
export declare const taskRealtimeHostDeliveryKindSchema: z.ZodEnum<{
    desktop_window: "desktop_window";
    relay_bridge: "relay_bridge";
}>;
export declare const taskSnapshotInvalidatedEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    traceId: z.ZodString;
    createdAt: z.ZodNumber;
    reason: z.ZodEnum<{
        task_created: "task_created";
        user_message_saved: "user_message_saved";
        assistant_message_saved: "assistant_message_saved";
        task_status_changed: "task_status_changed";
        task_meta_changed: "task_meta_changed";
        task_model_changed: "task_model_changed";
        task_title_changed: "task_title_changed";
        task_pinned: "task_pinned";
        task_unpinned: "task_unpinned";
        task_archived: "task_archived";
        task_unarchived: "task_unarchived";
        task_deleted: "task_deleted";
        stream_mirror_gap: "stream_mirror_gap";
        stream_mirror_owner_lost: "stream_mirror_owner_lost";
    }>;
    streamWatermark: z.ZodOptional<z.ZodObject<{
        runId: z.ZodString;
        opSeq: z.ZodNumber;
    }, z.core.$strict>>;
    type: z.ZodLiteral<"task_snapshot_invalidated">;
    taskId: z.ZodString;
}, z.core.$strict>;
export declare const workspaceTaskListInvalidatedEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    traceId: z.ZodString;
    createdAt: z.ZodNumber;
    reason: z.ZodEnum<{
        task_created: "task_created";
        user_message_saved: "user_message_saved";
        assistant_message_saved: "assistant_message_saved";
        task_status_changed: "task_status_changed";
        task_meta_changed: "task_meta_changed";
        task_model_changed: "task_model_changed";
        task_title_changed: "task_title_changed";
        task_pinned: "task_pinned";
        task_unpinned: "task_unpinned";
        task_archived: "task_archived";
        task_unarchived: "task_unarchived";
        task_deleted: "task_deleted";
        stream_mirror_gap: "stream_mirror_gap";
        stream_mirror_owner_lost: "stream_mirror_owner_lost";
    }>;
    streamWatermark: z.ZodOptional<z.ZodObject<{
        runId: z.ZodString;
        opSeq: z.ZodNumber;
    }, z.core.$strict>>;
    type: z.ZodLiteral<"workspace_task_list_invalidated">;
    taskId: z.ZodOptional<z.ZodString>;
    taskMeta: z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
        traceId: z.ZodString;
        title: z.ZodString;
        titleOverridden: z.ZodOptional<z.ZodBoolean>;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
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
        unreadAt: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<{
            running: "running";
            completed: "completed";
            error: "error";
        }>>;
        lastError: z.ZodOptional<z.ZodObject<{
            code: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strip>>;
}, z.core.$strict>;
export declare const taskStreamMirrorPublishOpSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"user_message">;
    messageId: z.ZodString;
    content: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"image">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodNumber>;
        dataBase64: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"audio">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        dataBase64: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"video">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodNumber>;
        dataBase64: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"pdf">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodNumber>;
        dataBase64: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"file">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodNumber;
        dataBase64: z.ZodOptional<z.ZodString>;
        textContent: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "kind">>>;
    timestamp: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"stream_event">;
    event: z.ZodObject<{
        type: z.ZodString;
        taskId: z.ZodString;
        traceId: z.ZodString;
    }, z.core.$loose>;
}, z.core.$strict>], "kind">;
export declare const taskStreamMirrorOpSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"user_message">;
    messageId: z.ZodString;
    content: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"image">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodNumber>;
        dataBase64: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"audio">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        dataBase64: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"video">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodNumber>;
        dataBase64: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"pdf">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodNumber>;
        dataBase64: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"file">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodNumber;
        dataBase64: z.ZodOptional<z.ZodString>;
        textContent: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "kind">>>;
    timestamp: z.ZodNumber;
    seq: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"stream_event">;
    event: z.ZodObject<{
        type: z.ZodString;
        taskId: z.ZodString;
        traceId: z.ZodString;
    }, z.core.$loose>;
    seq: z.ZodNumber;
}, z.core.$strict>], "kind">;
export declare const taskStreamMirrorTargetSchema: z.ZodObject<{
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    traceId: z.ZodString;
    ownerClientId: z.ZodOptional<z.ZodString>;
    ownerDeviceLabel: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const taskRunLeaseTargetSchema: z.ZodObject<{
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    traceId: z.ZodString;
    ownerClientId: z.ZodOptional<z.ZodString>;
    ownerDeviceLabel: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const taskRunLeaseAcquireRequestSchema: z.ZodObject<{
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    traceId: z.ZodString;
    ownerClientId: z.ZodOptional<z.ZodString>;
    ownerDeviceLabel: z.ZodOptional<z.ZodString>;
    leaseRequestId: z.ZodString;
}, z.core.$strict>;
export declare const taskRunLeaseResultSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    leaseRequestId: z.ZodString;
    acquired: z.ZodLiteral<true>;
    ownerHostId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    leaseRequestId: z.ZodString;
    acquired: z.ZodLiteral<false>;
    ownerHostId: z.ZodString;
    reason: z.ZodLiteral<"owned_by_other_host">;
}, z.core.$strict>], "acquired">;
export declare const taskOwnerCommandRequestSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"stop_generation">;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"respond_permission">;
    permissionRequestId: z.ZodString;
    optionId: z.ZodString;
    response: z.ZodObject<{
        decision: z.ZodEnum<{
            allow: "allow";
            deny: "deny";
            escalate: "escalate";
            modify: "modify";
        }>;
        reason: z.ZodOptional<z.ZodString>;
        modifiedInput: z.ZodOptional<z.ZodUnknown>;
        permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<"addRules">;
            behavior: z.ZodEnum<{
                ask: "ask";
                allow: "allow";
                deny: "deny";
            }>;
            rules: z.ZodArray<z.ZodObject<{
                toolName: z.ZodString;
                ruleContent: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"respond_elicitation">;
    elicitationRequestId: z.ZodString;
    action: z.ZodEnum<{
        accept: "accept";
        decline: "decline";
        cancel: "cancel";
    }>;
    content: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"respond_workspace_hook_review">;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodString;
    bundleDigest: z.ZodString;
    reviewFlowId: z.ZodString;
    generation: z.ZodNumber;
    interactionId: z.ZodString;
    decision: z.ZodObject<{
        action: z.ZodLiteral<"trust_selected">;
        reviewItemIds: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"enqueue_task_command">;
    taskCommand: z.ZodDiscriminatedUnion<[z.ZodObject<{
        commandId: z.ZodString;
        taskId: z.ZodString;
        traceId: z.ZodString;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
        status: z.ZodEnum<{
            running: "running";
            failed: "failed";
            accepted: "accepted";
        }>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        clientId: z.ZodOptional<z.ZodString>;
        clientLabel: z.ZodOptional<z.ZodString>;
        error: z.ZodOptional<z.ZodString>;
        type: z.ZodLiteral<"send_prompt">;
        content: z.ZodString;
        attachments: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"image">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"audio">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"video">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"pdf">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"file">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodNumber;
            dataBase64: z.ZodOptional<z.ZodString>;
            textContent: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "kind">>>;
        automationId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "type">;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"promote_task_command">;
    commandId: z.ZodString;
    clientMode: z.ZodLiteral<"web-remote-replayable">;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"cancel_task_command">;
    commandId: z.ZodString;
    clientMode: z.ZodLiteral<"web-remote-replayable">;
}, z.core.$strict>], "type">;
export declare const taskOwnerCommandDeliverySchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"stop_generation">;
    requesterHostId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"respond_permission">;
    permissionRequestId: z.ZodString;
    optionId: z.ZodString;
    response: z.ZodObject<{
        decision: z.ZodEnum<{
            allow: "allow";
            deny: "deny";
            escalate: "escalate";
            modify: "modify";
        }>;
        reason: z.ZodOptional<z.ZodString>;
        modifiedInput: z.ZodOptional<z.ZodUnknown>;
        permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<"addRules">;
            behavior: z.ZodEnum<{
                ask: "ask";
                allow: "allow";
                deny: "deny";
            }>;
            rules: z.ZodArray<z.ZodObject<{
                toolName: z.ZodString;
                ruleContent: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
    requesterHostId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"respond_elicitation">;
    elicitationRequestId: z.ZodString;
    action: z.ZodEnum<{
        accept: "accept";
        decline: "decline";
        cancel: "cancel";
    }>;
    content: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    requesterHostId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"respond_workspace_hook_review">;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodString;
    bundleDigest: z.ZodString;
    reviewFlowId: z.ZodString;
    generation: z.ZodNumber;
    interactionId: z.ZodString;
    decision: z.ZodObject<{
        action: z.ZodLiteral<"trust_selected">;
        reviewItemIds: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
    requesterHostId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"enqueue_task_command">;
    taskCommand: z.ZodDiscriminatedUnion<[z.ZodObject<{
        commandId: z.ZodString;
        taskId: z.ZodString;
        traceId: z.ZodString;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
        status: z.ZodEnum<{
            running: "running";
            failed: "failed";
            accepted: "accepted";
        }>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        clientId: z.ZodOptional<z.ZodString>;
        clientLabel: z.ZodOptional<z.ZodString>;
        error: z.ZodOptional<z.ZodString>;
        type: z.ZodLiteral<"send_prompt">;
        content: z.ZodString;
        attachments: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"image">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"audio">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"video">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"pdf">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"file">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodNumber;
            dataBase64: z.ZodOptional<z.ZodString>;
            textContent: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "kind">>>;
        automationId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "type">;
    requesterHostId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"promote_task_command">;
    commandId: z.ZodString;
    clientMode: z.ZodLiteral<"web-remote-replayable">;
    requesterHostId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodString;
    runId: z.ZodString;
    type: z.ZodLiteral<"cancel_task_command">;
    commandId: z.ZodString;
    clientMode: z.ZodLiteral<"web-remote-replayable">;
    requesterHostId: z.ZodString;
}, z.core.$strict>], "type">;
export declare const taskOwnerCommandErrorCodeSchema: z.ZodEnum<{
    NO_ACTIVE_TASK_OWNER: "NO_ACTIVE_TASK_OWNER";
    STALE_TASK_OWNER_COMMAND: "STALE_TASK_OWNER_COMMAND";
    OWNER_COMMAND_FAILED: "OWNER_COMMAND_FAILED";
}>;
export declare const taskOwnerCommandResultSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    commandRequestId: z.ZodString;
    success: z.ZodLiteral<true>;
    taskCommand: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        commandId: z.ZodString;
        taskId: z.ZodString;
        traceId: z.ZodString;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
        status: z.ZodEnum<{
            running: "running";
            failed: "failed";
            accepted: "accepted";
        }>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        clientId: z.ZodOptional<z.ZodString>;
        clientLabel: z.ZodOptional<z.ZodString>;
        error: z.ZodOptional<z.ZodString>;
        type: z.ZodLiteral<"send_prompt">;
        content: z.ZodString;
        attachments: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"image">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"audio">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"video">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"pdf">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"file">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodNumber;
            dataBase64: z.ZodOptional<z.ZodString>;
            textContent: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "kind">>>;
        automationId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "type">>;
}, z.core.$strict>, z.ZodObject<{
    commandRequestId: z.ZodString;
    success: z.ZodLiteral<false>;
    error: z.ZodString;
    code: z.ZodOptional<z.ZodEnum<{
        NO_ACTIVE_TASK_OWNER: "NO_ACTIVE_TASK_OWNER";
        STALE_TASK_OWNER_COMMAND: "STALE_TASK_OWNER_COMMAND";
        OWNER_COMMAND_FAILED: "OWNER_COMMAND_FAILED";
    }>>;
}, z.core.$strict>], "success">;
export declare const taskRealtimeEventSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    eventId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    traceId: z.ZodString;
    createdAt: z.ZodNumber;
    reason: z.ZodEnum<{
        task_created: "task_created";
        user_message_saved: "user_message_saved";
        assistant_message_saved: "assistant_message_saved";
        task_status_changed: "task_status_changed";
        task_meta_changed: "task_meta_changed";
        task_model_changed: "task_model_changed";
        task_title_changed: "task_title_changed";
        task_pinned: "task_pinned";
        task_unpinned: "task_unpinned";
        task_archived: "task_archived";
        task_unarchived: "task_unarchived";
        task_deleted: "task_deleted";
        stream_mirror_gap: "stream_mirror_gap";
        stream_mirror_owner_lost: "stream_mirror_owner_lost";
    }>;
    streamWatermark: z.ZodOptional<z.ZodObject<{
        runId: z.ZodString;
        opSeq: z.ZodNumber;
    }, z.core.$strict>>;
    type: z.ZodLiteral<"task_snapshot_invalidated">;
    taskId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    traceId: z.ZodString;
    createdAt: z.ZodNumber;
    reason: z.ZodEnum<{
        task_created: "task_created";
        user_message_saved: "user_message_saved";
        assistant_message_saved: "assistant_message_saved";
        task_status_changed: "task_status_changed";
        task_meta_changed: "task_meta_changed";
        task_model_changed: "task_model_changed";
        task_title_changed: "task_title_changed";
        task_pinned: "task_pinned";
        task_unpinned: "task_unpinned";
        task_archived: "task_archived";
        task_unarchived: "task_unarchived";
        task_deleted: "task_deleted";
        stream_mirror_gap: "stream_mirror_gap";
        stream_mirror_owner_lost: "stream_mirror_owner_lost";
    }>;
    streamWatermark: z.ZodOptional<z.ZodObject<{
        runId: z.ZodString;
        opSeq: z.ZodNumber;
    }, z.core.$strict>>;
    type: z.ZodLiteral<"workspace_task_list_invalidated">;
    taskId: z.ZodOptional<z.ZodString>;
    taskMeta: z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
        traceId: z.ZodString;
        title: z.ZodString;
        titleOverridden: z.ZodOptional<z.ZodBoolean>;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
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
        unreadAt: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<{
            running: "running";
            completed: "completed";
            error: "error";
        }>>;
        lastError: z.ZodOptional<z.ZodObject<{
            code: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strip>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    traceId: z.ZodString;
    createdAt: z.ZodNumber;
    type: z.ZodLiteral<"task_stream_mirror_batch">;
    taskId: z.ZodString;
    runId: z.ZodString;
    ownerClientId: z.ZodOptional<z.ZodString>;
    ownerDeviceLabel: z.ZodOptional<z.ZodString>;
    batchSeq: z.ZodNumber;
    fromSeq: z.ZodNumber;
    toSeq: z.ZodNumber;
    ops: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"user_message">;
        messageId: z.ZodString;
        content: z.ZodString;
        attachments: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"image">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"audio">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"video">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"pdf">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"file">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodNumber;
            dataBase64: z.ZodOptional<z.ZodString>;
            textContent: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "kind">>>;
        timestamp: z.ZodNumber;
        seq: z.ZodNumber;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"stream_event">;
        event: z.ZodObject<{
            type: z.ZodString;
            taskId: z.ZodString;
            traceId: z.ZodString;
        }, z.core.$loose>;
        seq: z.ZodNumber;
    }, z.core.$strict>], "kind">>;
    terminal: z.ZodBoolean;
}, z.core.$strict>], "type">;
export declare const taskRealtimeDeliveredEventSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    eventId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    traceId: z.ZodString;
    createdAt: z.ZodNumber;
    reason: z.ZodEnum<{
        task_created: "task_created";
        user_message_saved: "user_message_saved";
        assistant_message_saved: "assistant_message_saved";
        task_status_changed: "task_status_changed";
        task_meta_changed: "task_meta_changed";
        task_model_changed: "task_model_changed";
        task_title_changed: "task_title_changed";
        task_pinned: "task_pinned";
        task_unpinned: "task_unpinned";
        task_archived: "task_archived";
        task_unarchived: "task_unarchived";
        task_deleted: "task_deleted";
        stream_mirror_gap: "stream_mirror_gap";
        stream_mirror_owner_lost: "stream_mirror_owner_lost";
    }>;
    streamWatermark: z.ZodOptional<z.ZodObject<{
        runId: z.ZodString;
        opSeq: z.ZodNumber;
    }, z.core.$strict>>;
    type: z.ZodLiteral<"task_snapshot_invalidated">;
    taskId: z.ZodString;
    originHostId: z.ZodString;
    deliveryPurpose: z.ZodOptional<z.ZodEnum<{
        observer: "observer";
        relay_owner: "relay_owner";
    }>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    traceId: z.ZodString;
    createdAt: z.ZodNumber;
    reason: z.ZodEnum<{
        task_created: "task_created";
        user_message_saved: "user_message_saved";
        assistant_message_saved: "assistant_message_saved";
        task_status_changed: "task_status_changed";
        task_meta_changed: "task_meta_changed";
        task_model_changed: "task_model_changed";
        task_title_changed: "task_title_changed";
        task_pinned: "task_pinned";
        task_unpinned: "task_unpinned";
        task_archived: "task_archived";
        task_unarchived: "task_unarchived";
        task_deleted: "task_deleted";
        stream_mirror_gap: "stream_mirror_gap";
        stream_mirror_owner_lost: "stream_mirror_owner_lost";
    }>;
    streamWatermark: z.ZodOptional<z.ZodObject<{
        runId: z.ZodString;
        opSeq: z.ZodNumber;
    }, z.core.$strict>>;
    type: z.ZodLiteral<"workspace_task_list_invalidated">;
    taskId: z.ZodOptional<z.ZodString>;
    taskMeta: z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
        traceId: z.ZodString;
        title: z.ZodString;
        titleOverridden: z.ZodOptional<z.ZodBoolean>;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
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
        unreadAt: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<{
            running: "running";
            completed: "completed";
            error: "error";
        }>>;
        lastError: z.ZodOptional<z.ZodObject<{
            code: z.ZodOptional<z.ZodString>;
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
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strip>>;
    originHostId: z.ZodString;
    deliveryPurpose: z.ZodOptional<z.ZodEnum<{
        observer: "observer";
        relay_owner: "relay_owner";
    }>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    traceId: z.ZodString;
    createdAt: z.ZodNumber;
    type: z.ZodLiteral<"task_stream_mirror_batch">;
    taskId: z.ZodString;
    runId: z.ZodString;
    ownerClientId: z.ZodOptional<z.ZodString>;
    ownerDeviceLabel: z.ZodOptional<z.ZodString>;
    batchSeq: z.ZodNumber;
    fromSeq: z.ZodNumber;
    toSeq: z.ZodNumber;
    ops: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"user_message">;
        messageId: z.ZodString;
        content: z.ZodString;
        attachments: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"image">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"audio">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"video">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"pdf">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"file">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodNumber;
            dataBase64: z.ZodOptional<z.ZodString>;
            textContent: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "kind">>>;
        timestamp: z.ZodNumber;
        seq: z.ZodNumber;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"stream_event">;
        event: z.ZodObject<{
            type: z.ZodString;
            taskId: z.ZodString;
            traceId: z.ZodString;
        }, z.core.$loose>;
        seq: z.ZodNumber;
    }, z.core.$strict>], "kind">>;
    terminal: z.ZodBoolean;
    originHostId: z.ZodString;
    deliveryPurpose: z.ZodOptional<z.ZodEnum<{
        observer: "observer";
        relay_owner: "relay_owner";
    }>>;
}, z.core.$strict>], "type">;
//# sourceMappingURL=task-realtime-core.d.ts.map