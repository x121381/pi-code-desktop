import { z } from "zod";
import { zcodeProviderSchema } from "./providers.js";
import type { WebRemoteControlAppPayload } from "./web-remote-control.js";
export { appSettingsOccupationEnum, appSettingsPatchSchema, appSettingsSchema, localeSchema, postUpdateReleaseNotesPayloadSchema, } from "./validationAppSettings.js";
export { isValidWslUser, WSL_USER_MAX_LENGTH, wslUserSchema } from "./wslUserValidation.js";
export { zcodeTaskModeSchema } from "./zcode-task-mode-schema.js";
export declare function formatZodError(error: z.ZodError): string;
export declare const nonEmptyStringSchema: z.ZodString;
export declare const stringArraySchema: z.ZodArray<z.ZodString>;
export declare const webRemoteControlWorkspaceTargetSchema: z.ZodObject<{
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    label: z.ZodString;
    workspacePurpose: z.ZodOptional<z.ZodEnum<{
        project: "project";
        conversation: "conversation";
    }>>;
    kind: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    connectionState: z.ZodOptional<z.ZodEnum<{
        connected: "connected";
        disconnected: "disconnected";
        reconnecting: "reconnecting";
    }>>;
    lastConnectionError: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const webRemoteControlWorkspaceTargetsSchema: z.ZodArray<z.ZodObject<{
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    label: z.ZodString;
    workspacePurpose: z.ZodOptional<z.ZodEnum<{
        project: "project";
        conversation: "conversation";
    }>>;
    kind: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    connectionState: z.ZodOptional<z.ZodEnum<{
        connected: "connected";
        disconnected: "disconnected";
        reconnecting: "reconnecting";
    }>>;
    lastConnectionError: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export declare const webRemoteControlReconnectWorkspaceRequestSchema: z.ZodObject<{
    requestId: z.ZodString;
    workspaceKey: z.ZodString;
}, z.core.$strip>;
export declare const webRemoteControlReconnectWorkspaceResultSchema: z.ZodUnion<readonly [z.ZodObject<{
    requestId: z.ZodString;
    workspaceKey: z.ZodString;
    success: z.ZodLiteral<true>;
}, z.core.$strip>, z.ZodObject<{
    requestId: z.ZodString;
    workspaceKey: z.ZodString;
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, z.core.$strip>]>;
export declare const webRemoteControlTaskTargetSchema: z.ZodObject<{
    taskId: z.ZodString;
    title: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    workspaceLabel: z.ZodString;
    workspaceKind: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    provider: z.ZodOptional<z.ZodEnum<{
        glm: "glm";
    }>>;
    unreadAt: z.ZodOptional<z.ZodNumber>;
    displayStatus: z.ZodOptional<z.ZodEnum<{
        running: "running";
        completed: "completed";
        error: "error";
        idle: "idle";
    }>>;
    hasBackgroundWork: z.ZodOptional<z.ZodBoolean>;
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
    pinned: z.ZodOptional<z.ZodBoolean>;
    archived: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const webRemoteControlTaskTargetsSchema: z.ZodArray<z.ZodObject<{
    taskId: z.ZodString;
    title: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    workspaceLabel: z.ZodString;
    workspaceKind: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    provider: z.ZodOptional<z.ZodEnum<{
        glm: "glm";
    }>>;
    unreadAt: z.ZodOptional<z.ZodNumber>;
    displayStatus: z.ZodOptional<z.ZodEnum<{
        running: "running";
        completed: "completed";
        error: "error";
        idle: "idle";
    }>>;
    hasBackgroundWork: z.ZodOptional<z.ZodBoolean>;
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
    pinned: z.ZodOptional<z.ZodBoolean>;
    archived: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>>;
export declare const webRemoteControlFailureReasonSchema: z.ZodEnum<{
    "session-not-found": "session-not-found";
    "session-expired": "session-expired";
    "session-conflict": "session-conflict";
    "workspace-closed": "workspace-closed";
    "desktop-disconnected": "desktop-disconnected";
    "invalid-mobile-connection": "invalid-mobile-connection";
    "desktop-bootstrap-timeout": "desktop-bootstrap-timeout";
    "connection-recovery-timeout": "connection-recovery-timeout";
    "relay-unavailable": "relay-unavailable";
    "unsupported-action": "unsupported-action";
    "unexpected-error": "unexpected-error";
}>;
export declare const webRemoteControlExternalWorkspaceBridgeSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    kind: z.ZodLiteral<"local">;
    workspaceKey: z.ZodString;
    workspacePath: z.ZodString;
    initialTaskId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    kind: z.ZodLiteral<"remote">;
    workspaceKey: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodString;
    remoteSessionId: z.ZodString;
    initialTaskId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "kind">;
export declare const webRemoteControlMobileViewStateSchema: z.ZodObject<{
    activeWorkspaceKey: z.ZodOptional<z.ZodString>;
    activeTaskId: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
export declare const webRemoteControlMobileDeviceInfoSchema: z.ZodObject<{
    platform: z.ZodString;
    version: z.ZodString;
    name: z.ZodString;
    userAgent: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    languages: z.ZodOptional<z.ZodArray<z.ZodString>>;
    browserPlatform: z.ZodOptional<z.ZodString>;
    viewport: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        devicePixelRatio: z.ZodNumber;
    }, z.core.$strip>>;
    screen: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>>;
    timezone: z.ZodOptional<z.ZodString>;
    online: z.ZodOptional<z.ZodBoolean>;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
export declare const webRemoteControlWindowBootstrapResultSchema: z.ZodObject<{
    windowControlSessionId: z.ZodString;
    desktopAppVersion: z.ZodOptional<z.ZodString>;
    workspaces: z.ZodArray<z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        label: z.ZodString;
        workspacePurpose: z.ZodOptional<z.ZodEnum<{
            project: "project";
            conversation: "conversation";
        }>>;
        kind: z.ZodEnum<{
            local: "local";
            remote: "remote";
        }>;
        connectionState: z.ZodOptional<z.ZodEnum<{
            connected: "connected";
            disconnected: "disconnected";
            reconnecting: "reconnecting";
        }>>;
        lastConnectionError: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    tasks: z.ZodArray<z.ZodObject<{
        taskId: z.ZodString;
        title: z.ZodString;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceLabel: z.ZodString;
        workspaceKind: z.ZodEnum<{
            local: "local";
            remote: "remote";
        }>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        provider: z.ZodOptional<z.ZodEnum<{
            glm: "glm";
        }>>;
        unreadAt: z.ZodOptional<z.ZodNumber>;
        displayStatus: z.ZodOptional<z.ZodEnum<{
            running: "running";
            completed: "completed";
            error: "error";
            idle: "idle";
        }>>;
        hasBackgroundWork: z.ZodOptional<z.ZodBoolean>;
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
        pinned: z.ZodOptional<z.ZodBoolean>;
        archived: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    initialViewState: z.ZodOptional<z.ZodObject<{
        activeWorkspaceKey: z.ZodOptional<z.ZodString>;
        activeTaskId: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodNumber;
    }, z.core.$strip>>;
    mobileViewState: z.ZodOptional<z.ZodObject<{
        activeWorkspaceKey: z.ZodOptional<z.ZodString>;
        activeTaskId: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const webRemoteControlWorkspaceListResultSchema: z.ZodObject<{
    workspaces: z.ZodArray<z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        label: z.ZodString;
        workspacePurpose: z.ZodOptional<z.ZodEnum<{
            project: "project";
            conversation: "conversation";
        }>>;
        kind: z.ZodEnum<{
            local: "local";
            remote: "remote";
        }>;
        connectionState: z.ZodOptional<z.ZodEnum<{
            connected: "connected";
            disconnected: "disconnected";
            reconnecting: "reconnecting";
        }>>;
        lastConnectionError: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    tasks: z.ZodOptional<z.ZodArray<z.ZodObject<{
        taskId: z.ZodString;
        title: z.ZodString;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceLabel: z.ZodString;
        workspaceKind: z.ZodEnum<{
            local: "local";
            remote: "remote";
        }>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        provider: z.ZodOptional<z.ZodEnum<{
            glm: "glm";
        }>>;
        unreadAt: z.ZodOptional<z.ZodNumber>;
        displayStatus: z.ZodOptional<z.ZodEnum<{
            running: "running";
            completed: "completed";
            error: "error";
            idle: "idle";
        }>>;
        hasBackgroundWork: z.ZodOptional<z.ZodBoolean>;
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
        pinned: z.ZodOptional<z.ZodBoolean>;
        archived: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    activeWorkspaceKey: z.ZodOptional<z.ZodString>;
    activeTaskId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const webRemoteControlPlatformMethodSchema: z.ZodEnum<{
    isDockerAvailable: "isDockerAvailable";
    listWSLDistros: "listWSLDistros";
    listDockerContainers: "listDockerContainers";
    listSSHConfigAliases: "listSSHConfigAliases";
    loadMcpFromUserDirectory: "loadMcpFromUserDirectory";
    saveMcpToUserDirectory: "saveMcpToUserDirectory";
    migrateLegacyCommonMcp: "migrateLegacyCommonMcp";
}>;
export declare const webRemoteControlAppPayloadSchema: z.ZodUnion<readonly [z.ZodObject<{
    zcode_type: z.ZodLiteral<"telemetry-report">;
    event: z.ZodObject<{
        elementName: z.ZodLiteral<"session_create">;
        eventRegion: z.ZodLiteral<"app">;
        eventType: z.ZodLiteral<"result">;
        talkId: z.ZodString;
        messageId: z.ZodString;
        context: z.ZodObject<{
            clientTimezone: z.ZodString;
            clientLanguage: z.ZodString;
            screenResolution: z.ZodString;
        }, z.core.$strict>;
        eventExtraDetail: z.ZodObject<{
            create_source: z.ZodEnum<{
                project: "project";
                session: "session";
                group: "group";
            }>;
            client_kind: z.ZodLiteral<"mobile">;
            workspace_kind: z.ZodEnum<{
                local: "local";
                remote: "remote";
            }>;
            remote_kind: z.ZodEnum<{
                "": "";
                ssh: "ssh";
                wsl: "wsl";
                docker: "docker";
                server: "server";
            }>;
        }, z.core.$strict>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"bootstrap-request">;
    requestId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"bootstrap-response">;
    requestId: z.ZodString;
    success: z.ZodLiteral<true>;
    result: z.ZodObject<{
        windowControlSessionId: z.ZodString;
        desktopAppVersion: z.ZodOptional<z.ZodString>;
        workspaces: z.ZodArray<z.ZodObject<{
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            remoteSessionId: z.ZodOptional<z.ZodString>;
            label: z.ZodString;
            workspacePurpose: z.ZodOptional<z.ZodEnum<{
                project: "project";
                conversation: "conversation";
            }>>;
            kind: z.ZodEnum<{
                local: "local";
                remote: "remote";
            }>;
            connectionState: z.ZodOptional<z.ZodEnum<{
                connected: "connected";
                disconnected: "disconnected";
                reconnecting: "reconnecting";
            }>>;
            lastConnectionError: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        tasks: z.ZodArray<z.ZodObject<{
            taskId: z.ZodString;
            title: z.ZodString;
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            remoteSessionId: z.ZodOptional<z.ZodString>;
            workspaceLabel: z.ZodString;
            workspaceKind: z.ZodEnum<{
                local: "local";
                remote: "remote";
            }>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
            provider: z.ZodOptional<z.ZodEnum<{
                glm: "glm";
            }>>;
            unreadAt: z.ZodOptional<z.ZodNumber>;
            displayStatus: z.ZodOptional<z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
                idle: "idle";
            }>>;
            hasBackgroundWork: z.ZodOptional<z.ZodBoolean>;
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
            pinned: z.ZodOptional<z.ZodBoolean>;
            archived: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        initialViewState: z.ZodOptional<z.ZodObject<{
            activeWorkspaceKey: z.ZodOptional<z.ZodString>;
            activeTaskId: z.ZodOptional<z.ZodString>;
            updatedAt: z.ZodNumber;
        }, z.core.$strip>>;
        mobileViewState: z.ZodOptional<z.ZodObject<{
            activeWorkspaceKey: z.ZodOptional<z.ZodString>;
            activeTaskId: z.ZodOptional<z.ZodString>;
            updatedAt: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"workspace-list-request">;
    requestId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"workspace-list-response">;
    requestId: z.ZodString;
    success: z.ZodLiteral<true>;
    result: z.ZodObject<{
        workspaces: z.ZodArray<z.ZodObject<{
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            remoteSessionId: z.ZodOptional<z.ZodString>;
            label: z.ZodString;
            workspacePurpose: z.ZodOptional<z.ZodEnum<{
                project: "project";
                conversation: "conversation";
            }>>;
            kind: z.ZodEnum<{
                local: "local";
                remote: "remote";
            }>;
            connectionState: z.ZodOptional<z.ZodEnum<{
                connected: "connected";
                disconnected: "disconnected";
                reconnecting: "reconnecting";
            }>>;
            lastConnectionError: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        tasks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            taskId: z.ZodString;
            title: z.ZodString;
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            remoteSessionId: z.ZodOptional<z.ZodString>;
            workspaceLabel: z.ZodString;
            workspaceKind: z.ZodEnum<{
                local: "local";
                remote: "remote";
            }>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
            provider: z.ZodOptional<z.ZodEnum<{
                glm: "glm";
            }>>;
            unreadAt: z.ZodOptional<z.ZodNumber>;
            displayStatus: z.ZodOptional<z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
                idle: "idle";
            }>>;
            hasBackgroundWork: z.ZodOptional<z.ZodBoolean>;
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
            pinned: z.ZodOptional<z.ZodBoolean>;
            archived: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>;
        activeWorkspaceKey: z.ZodOptional<z.ZodString>;
        activeTaskId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"workspace-list-updated">;
    result: z.ZodObject<{
        workspaces: z.ZodArray<z.ZodObject<{
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            remoteSessionId: z.ZodOptional<z.ZodString>;
            label: z.ZodString;
            workspacePurpose: z.ZodOptional<z.ZodEnum<{
                project: "project";
                conversation: "conversation";
            }>>;
            kind: z.ZodEnum<{
                local: "local";
                remote: "remote";
            }>;
            connectionState: z.ZodOptional<z.ZodEnum<{
                connected: "connected";
                disconnected: "disconnected";
                reconnecting: "reconnecting";
            }>>;
            lastConnectionError: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        tasks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            taskId: z.ZodString;
            title: z.ZodString;
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            remoteSessionId: z.ZodOptional<z.ZodString>;
            workspaceLabel: z.ZodString;
            workspaceKind: z.ZodEnum<{
                local: "local";
                remote: "remote";
            }>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
            provider: z.ZodOptional<z.ZodEnum<{
                glm: "glm";
            }>>;
            unreadAt: z.ZodOptional<z.ZodNumber>;
            displayStatus: z.ZodOptional<z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
                idle: "idle";
            }>>;
            hasBackgroundWork: z.ZodOptional<z.ZodBoolean>;
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
            pinned: z.ZodOptional<z.ZodBoolean>;
            archived: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>;
        activeWorkspaceKey: z.ZodOptional<z.ZodString>;
        activeTaskId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"workspace-bridge-open">;
    requestId: z.ZodString;
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    taskId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"workspace-bridge-ready">;
    requestId: z.ZodString;
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    bridge: z.ZodDiscriminatedUnion<[z.ZodObject<{
        bridgeSessionId: z.ZodString;
        bridgeGeneration: z.ZodOptional<z.ZodNumber>;
        recoveryId: z.ZodOptional<z.ZodString>;
        kind: z.ZodLiteral<"local">;
        workspaceKey: z.ZodString;
        workspacePath: z.ZodString;
        initialTaskId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        bridgeSessionId: z.ZodString;
        bridgeGeneration: z.ZodOptional<z.ZodNumber>;
        recoveryId: z.ZodOptional<z.ZodString>;
        kind: z.ZodLiteral<"remote">;
        workspaceKey: z.ZodString;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodString;
        remoteSessionId: z.ZodString;
        initialTaskId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"workspace-bridge-error">;
    requestId: z.ZodString;
    bridgeSessionId: z.ZodOptional<z.ZodString>;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    reason: z.ZodEnum<{
        "session-not-found": "session-not-found";
        "session-expired": "session-expired";
        "session-conflict": "session-conflict";
        "workspace-closed": "workspace-closed";
        "desktop-disconnected": "desktop-disconnected";
        "invalid-mobile-connection": "invalid-mobile-connection";
        "desktop-bootstrap-timeout": "desktop-bootstrap-timeout";
        "connection-recovery-timeout": "connection-recovery-timeout";
        "relay-unavailable": "relay-unavailable";
        "unsupported-action": "unsupported-action";
        "unexpected-error": "unexpected-error";
    }>;
    error: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"workspace-reconnect-request">;
    requestId: z.ZodString;
    workspaceKey: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"workspace-reconnect-response">;
    requestId: z.ZodString;
    workspaceKey: z.ZodString;
    success: z.ZodLiteral<true>;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"workspace-reconnect-response">;
    requestId: z.ZodString;
    workspaceKey: z.ZodString;
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"mobile-view-state-update">;
    viewState: z.ZodObject<{
        activeWorkspaceKey: z.ZodOptional<z.ZodString>;
        activeTaskId: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodNumber;
    }, z.core.$strip>;
    deviceInfo: z.ZodOptional<z.ZodObject<{
        platform: z.ZodString;
        version: z.ZodString;
        name: z.ZodString;
        userAgent: z.ZodOptional<z.ZodString>;
        language: z.ZodOptional<z.ZodString>;
        languages: z.ZodOptional<z.ZodArray<z.ZodString>>;
        browserPlatform: z.ZodOptional<z.ZodString>;
        viewport: z.ZodOptional<z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
            devicePixelRatio: z.ZodNumber;
        }, z.core.$strip>>;
        screen: z.ZodOptional<z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strip>>;
        timezone: z.ZodOptional<z.ZodString>;
        online: z.ZodOptional<z.ZodBoolean>;
        updatedAt: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"platform-request">;
    requestId: z.ZodString;
    method: z.ZodEnum<{
        isDockerAvailable: "isDockerAvailable";
        listWSLDistros: "listWSLDistros";
        listDockerContainers: "listDockerContainers";
        listSSHConfigAliases: "listSSHConfigAliases";
        loadMcpFromUserDirectory: "loadMcpFromUserDirectory";
        saveMcpToUserDirectory: "saveMcpToUserDirectory";
        migrateLegacyCommonMcp: "migrateLegacyCommonMcp";
    }>;
    args: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"platform-response">;
    requestId: z.ZodString;
    method: z.ZodEnum<{
        isDockerAvailable: "isDockerAvailable";
        listWSLDistros: "listWSLDistros";
        listDockerContainers: "listDockerContainers";
        listSSHConfigAliases: "listSSHConfigAliases";
        loadMcpFromUserDirectory: "loadMcpFromUserDirectory";
        saveMcpToUserDirectory: "saveMcpToUserDirectory";
        migrateLegacyCommonMcp: "migrateLegacyCommonMcp";
    }>;
    success: z.ZodLiteral<true>;
    result: z.ZodUnknown;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"platform-response">;
    requestId: z.ZodString;
    method: z.ZodEnum<{
        isDockerAvailable: "isDockerAvailable";
        listWSLDistros: "listWSLDistros";
        listDockerContainers: "listDockerContainers";
        listSSHConfigAliases: "listSSHConfigAliases";
        loadMcpFromUserDirectory: "loadMcpFromUserDirectory";
        saveMcpToUserDirectory: "saveMcpToUserDirectory";
        migrateLegacyCommonMcp: "migrateLegacyCommonMcp";
    }>;
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"rpc-frame">;
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    messageSeq: z.ZodNumber;
    fragmentIndex: z.ZodNumber;
    fragmentCount: z.ZodNumber;
    messageBytes: z.ZodNumber;
    checksum: z.ZodObject<{
        algorithm: z.ZodLiteral<"crc32">;
        value: z.ZodString;
    }, z.core.$strict>;
    dataBase64: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"rpc-frame-ack">;
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    ackMessageSeq: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"bridge-degraded">;
    bridgeSessionId: z.ZodString;
    bridgeGeneration: z.ZodOptional<z.ZodNumber>;
    recoveryId: z.ZodOptional<z.ZodString>;
    reason: z.ZodEnum<{
        "rpc-transport-fault": "rpc-transport-fault";
        "rpc-frame-gap": "rpc-frame-gap";
        "buffer-overflow": "buffer-overflow";
        "buffer-timeout": "buffer-timeout";
    }>;
    seq: z.ZodOptional<z.ZodNumber>;
    expectedSeq: z.ZodOptional<z.ZodNumber>;
    droppedCount: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"app-error">;
    requestId: z.ZodOptional<z.ZodString>;
    bridgeSessionId: z.ZodOptional<z.ZodString>;
    reason: z.ZodEnum<{
        "session-not-found": "session-not-found";
        "session-expired": "session-expired";
        "session-conflict": "session-conflict";
        "workspace-closed": "workspace-closed";
        "desktop-disconnected": "desktop-disconnected";
        "invalid-mobile-connection": "invalid-mobile-connection";
        "desktop-bootstrap-timeout": "desktop-bootstrap-timeout";
        "connection-recovery-timeout": "connection-recovery-timeout";
        "relay-unavailable": "relay-unavailable";
        "unsupported-action": "unsupported-action";
        "unexpected-error": "unexpected-error";
    }>;
    error: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    zcode_type: z.ZodLiteral<"mobile-diagnostic">;
    event: z.ZodEnum<{
        failure: "failure";
        "state-transition": "state-transition";
        "socket-close": "socket-close";
        "socket-error": "socket-error";
        "recover-start": "recover-start";
        "recover-scheduled": "recover-scheduled";
        "pair-status": "pair-status";
    }>;
    timestamp: z.ZodNumber;
    state: z.ZodOptional<z.ZodString>;
    previousState: z.ZodOptional<z.ZodString>;
    pairStatus: z.ZodOptional<z.ZodEnum<{
        waiting: "waiting";
        matched: "matched";
    }>>;
    closeCode: z.ZodOptional<z.ZodNumber>;
    closeReason: z.ZodOptional<z.ZodString>;
    wasClean: z.ZodOptional<z.ZodBoolean>;
    wasPaired: z.ZodOptional<z.ZodBoolean>;
    failureReason: z.ZodOptional<z.ZodEnum<{
        "session-not-found": "session-not-found";
        "session-expired": "session-expired";
        "session-conflict": "session-conflict";
        "workspace-closed": "workspace-closed";
        "desktop-disconnected": "desktop-disconnected";
        "invalid-mobile-connection": "invalid-mobile-connection";
        "desktop-bootstrap-timeout": "desktop-bootstrap-timeout";
        "connection-recovery-timeout": "connection-recovery-timeout";
        "relay-unavailable": "relay-unavailable";
        "unsupported-action": "unsupported-action";
        "unexpected-error": "unexpected-error";
    }>>;
    failureMessage: z.ZodOptional<z.ZodString>;
    visibilityState: z.ZodOptional<z.ZodString>;
    online: z.ZodOptional<z.ZodBoolean>;
    hiddenDurationMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>]>;
export declare function parseWebRemoteControlAppPayload(payload: unknown): WebRemoteControlAppPayload | null;
export declare const credentialRecordSchema: z.ZodRecord<z.ZodString, z.ZodString>;
export declare const credentialKeySchema: z.ZodString;
export declare const credentialValueSchema: z.ZodString;
export declare const sshConnectOptionsSchema: z.ZodObject<{
    kind: z.ZodLiteral<"ssh">;
    host: z.ZodString;
    port: z.ZodOptional<z.ZodNumber>;
    username: z.ZodString;
    sshConfigAlias: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    privateKeyPath: z.ZodOptional<z.ZodString>;
    privateKeyPassphrase: z.ZodOptional<z.ZodString>;
    assetInstallMode: z.ZodOptional<z.ZodEnum<{
        "local-download-upload": "local-download-upload";
        "remote-download": "remote-download";
    }>>;
    resourcePackages: z.ZodOptional<z.ZodObject<{
        selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const wslConnectOptionsSchema: z.ZodObject<{
    kind: z.ZodLiteral<"wsl">;
    distro: z.ZodOptional<z.ZodString>;
    user: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const dockerConnectOptionsSchema: z.ZodObject<{
    kind: z.ZodLiteral<"docker">;
    container: z.ZodString;
}, z.core.$strip>;
export declare const serverConnectOptionsSchema: z.ZodObject<{
    kind: z.ZodLiteral<"server">;
    url: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
    workspacePath: z.ZodOptional<z.ZodString>;
    serverId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const remoteTargetSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"ssh">;
    host: z.ZodString;
    port: z.ZodOptional<z.ZodNumber>;
    username: z.ZodString;
    sshConfigAlias: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    privateKeyPath: z.ZodOptional<z.ZodString>;
    privateKeyPassphrase: z.ZodOptional<z.ZodString>;
    assetInstallMode: z.ZodOptional<z.ZodEnum<{
        "local-download-upload": "local-download-upload";
        "remote-download": "remote-download";
    }>>;
    resourcePackages: z.ZodOptional<z.ZodObject<{
        selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"wsl">;
    distro: z.ZodOptional<z.ZodString>;
    user: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"docker">;
    container: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"server">;
    url: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
    workspacePath: z.ZodOptional<z.ZodString>;
    serverId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "kind">;
export declare const helloMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"zcode-hello">;
    version: z.ZodString;
    platform: z.ZodString;
    arch: z.ZodString;
    pid: z.ZodNumber;
}, z.core.$strip>;
export declare const helloAckMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"zcode-hello-ack">;
    version: z.ZodString;
    clientId: z.ZodString;
}, z.core.$strip>;
export declare const rendererLogPayloadSchema: z.ZodObject<{
    level: z.ZodEnum<{
        error: "error";
        info: "info";
        warn: "warn";
    }>;
    args: z.ZodArray<z.ZodUnknown>;
}, z.core.$strip>;
export declare const taskNotificationPayloadSchema: z.ZodObject<{
    taskId: z.ZodString;
    status: z.ZodEnum<{
        completed: "completed";
        failed: "failed";
        permission_request: "permission_request";
        elicitation_request: "elicitation_request";
        feedback_update: "feedback_update";
    }>;
    requestId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    body: z.ZodString;
}, z.core.$strip>;
export declare const telemetryRendererContextSchema: z.ZodObject<{
    clientTimezone: z.ZodString;
    clientLanguage: z.ZodString;
    screenResolution: z.ZodString;
}, z.core.$strip>;
export declare const rendererTelemetryEventPayloadSchema: z.ZodObject<{
    context: z.ZodObject<{
        clientTimezone: z.ZodString;
        clientLanguage: z.ZodString;
        screenResolution: z.ZodString;
    }, z.core.$strip>;
    elementName: z.ZodString;
    eventRegion: z.ZodString;
    eventType: z.ZodString;
    eventText: z.ZodOptional<z.ZodString>;
    eventExtraDetail: z.ZodRecord<z.ZodString, z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    talkId: z.ZodOptional<z.ZodString>;
    messageId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const armsCustomEventPayloadSchema: z.ZodObject<{
    name: z.ZodString;
    group: z.ZodString;
    value: z.ZodOptional<z.ZodNumber>;
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodUndefined]>>>;
}, z.core.$strip>;
export declare const broadcastMessageSchema: z.ZodObject<{
    channel: z.ZodString;
    payload: z.ZodUnknown;
    sourceWindowId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const remoteAssetDirsSchema: z.ZodObject<{
    mockCdnDir: z.ZodOptional<z.ZodString>;
    remoteCdnBaseUrl: z.ZodOptional<z.ZodString>;
    remoteCdnBaseUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
    remoteCacheDir: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const hostInitLocalMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"init-local">;
    databaseStartupId: z.ZodOptional<z.ZodString>;
    hostId: z.ZodOptional<z.ZodString>;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        desktop_window: "desktop_window";
        relay_bridge: "relay_bridge";
    }>>;
    deviceMid: z.ZodOptional<z.ZodString>;
    feedbackApiBase: z.ZodOptional<z.ZodString>;
    workspacePath: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    agentWarmupTargets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    agentSpawnFallbackCwd: z.ZodOptional<z.ZodString>;
    zcodeBuiltinProviderConfigFilePath: z.ZodString;
    runtimeProcessEnvPatch: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
export declare const windowHostRemoteWorkspaceDescriptorSchema: z.ZodObject<{
    remoteSessionId: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"ssh">;
        host: z.ZodString;
        port: z.ZodOptional<z.ZodNumber>;
        username: z.ZodString;
        sshConfigAlias: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        privateKeyPath: z.ZodOptional<z.ZodString>;
        privateKeyPassphrase: z.ZodOptional<z.ZodString>;
        assetInstallMode: z.ZodOptional<z.ZodEnum<{
            "local-download-upload": "local-download-upload";
            "remote-download": "remote-download";
        }>>;
        resourcePackages: z.ZodOptional<z.ZodObject<{
            selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"wsl">;
        distro: z.ZodOptional<z.ZodString>;
        user: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"docker">;
        container: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"server">;
        url: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodOptional<z.ZodString>;
        serverId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">;
    workspacePath: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    generation: z.ZodNumber;
}, z.core.$strict>;
export type WindowHostRemoteWorkspaceDescriptor = z.infer<typeof windowHostRemoteWorkspaceDescriptorSchema>;
export declare const windowHostAttachmentScopeSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"local">;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"remote">;
    remoteSessionId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodString;
}, z.core.$strict>], "kind">;
export type WindowHostAttachmentScope = z.infer<typeof windowHostAttachmentScopeSchema>;
export declare const hostConnectRemoteWorkspaceMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"connect-remote-workspace">;
    requestId: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"ssh">;
        host: z.ZodString;
        port: z.ZodOptional<z.ZodNumber>;
        username: z.ZodString;
        sshConfigAlias: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        privateKeyPath: z.ZodOptional<z.ZodString>;
        privateKeyPassphrase: z.ZodOptional<z.ZodString>;
        assetInstallMode: z.ZodOptional<z.ZodEnum<{
            "local-download-upload": "local-download-upload";
            "remote-download": "remote-download";
        }>>;
        resourcePackages: z.ZodOptional<z.ZodObject<{
            selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"wsl">;
        distro: z.ZodOptional<z.ZodString>;
        user: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"docker">;
        container: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"server">;
        url: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodOptional<z.ZodString>;
        serverId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">;
    remoteAssets: z.ZodObject<{
        mockCdnDir: z.ZodOptional<z.ZodString>;
        remoteCdnBaseUrl: z.ZodOptional<z.ZodString>;
        remoteCdnBaseUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
        remoteCacheDir: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    workspacePath: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const hostCancelRemoteWorkspaceConnectMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"cancel-remote-workspace-connect">;
    requestId: z.ZodString;
}, z.core.$strict>;
export declare const hostBindRemoteWorkspaceContextMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"bind-remote-workspace-context">;
    requestId: z.ZodString;
    remoteSessionId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodString;
}, z.core.$strict>;
export declare const hostDisposeRemoteWorkspaceSessionMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"dispose-remote-workspace-session">;
    requestId: z.ZodString;
    remoteSessionId: z.ZodString;
}, z.core.$strict>;
export declare const hostAttachServicePortMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"attach-service-port">;
    requestId: z.ZodString;
    attachmentId: z.ZodString;
    clientMode: z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>;
    scope: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"local">;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"remote">;
        remoteSessionId: z.ZodString;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodString;
    }, z.core.$strict>], "kind">;
}, z.core.$strict>;
export declare const hostDetachServicePortMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"detach-service-port">;
    attachmentId: z.ZodString;
}, z.core.$strip>;
export declare const hostDisposeMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"dispose">;
}, z.core.$strip>;
export declare const hostBroadcastEnvelopeSchema: z.ZodObject<{
    type: z.ZodLiteral<"broadcast">;
    message: z.ZodObject<{
        channel: z.ZodString;
        payload: z.ZodUnknown;
        sourceWindowId: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const hostBroadcastClaimResultMessageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-result">;
    requestId: z.ZodString;
    status: z.ZodLiteral<"acquired">;
    claimToken: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-result">;
    requestId: z.ZodString;
    status: z.ZodLiteral<"busy">;
    retryAfterMs: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-result">;
    requestId: z.ZodString;
    status: z.ZodLiteral<"committed">;
}, z.core.$strip>], "status">;
export declare const hostTaskRealtimeDeliverMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"task-realtime-deliver">;
    event: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>;
export declare const hostTaskRunLeaseResultMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"task-run-lease-result">;
    result: z.ZodDiscriminatedUnion<[z.ZodObject<{
        leaseRequestId: z.ZodString;
        acquired: z.ZodLiteral<true>;
        ownerHostId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        leaseRequestId: z.ZodString;
        acquired: z.ZodLiteral<false>;
        ownerHostId: z.ZodString;
        reason: z.ZodLiteral<"owned_by_other_host">;
    }, z.core.$strict>], "acquired">;
}, z.core.$strip>;
export declare const hostTaskOwnerCommandDeliverMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"task-owner-command-deliver">;
    command: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>;
export declare const hostTaskOwnerCommandResultMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"task-owner-command-result">;
    result: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>;
export declare const hostBotRemoteWorkspaceReconnectResultMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-reconnect-result">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    sessionId: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const hostBotRemoteWorkspaceConnectionStatusResultMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-connection-status-result">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    connected: z.ZodOptional<z.ZodBoolean>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const hostBotRemoteWorkspaceRuntimePortMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-runtime-port">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const sessionMessageRequestSchema: z.ZodObject<{
    content: z.ZodString;
    createdAt: z.ZodString;
    fromSessionId: z.ZodString;
    messageId: z.ZodString;
    requestId: z.ZodString;
    toSessionId: z.ZodString;
}, z.core.$strip>;
export declare const sessionMessageDeliveryResultSchema: z.ZodObject<{
    error: z.ZodOptional<z.ZodString>;
    messageId: z.ZodString;
    requestId: z.ZodString;
    sessionId: z.ZodString;
    status: z.ZodEnum<{
        failed: "failed";
        success: "success";
    }>;
}, z.core.$strip>;
export declare const sessionRouteSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strip>;
export declare const hostSessionMessageDeliverMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"session-message-deliver">;
    request: z.ZodObject<{
        content: z.ZodString;
        createdAt: z.ZodString;
        fromSessionId: z.ZodString;
        messageId: z.ZodString;
        requestId: z.ZodString;
        toSessionId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const hostSessionMessageDeliveryResultMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"session-message-delivery-result">;
    result: z.ZodObject<{
        error: z.ZodOptional<z.ZodString>;
        messageId: z.ZodString;
        requestId: z.ZodString;
        sessionId: z.ZodString;
        status: z.ZodEnum<{
            failed: "failed";
            success: "success";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const hostFeedbackLogArchiveResultMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"feedback-log-archive-result">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    path: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const hostCronRunMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"cron-run">;
    automationId: z.ZodString;
    runId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    prompt: z.ZodString;
    targetTaskId: z.ZodOptional<z.ZodString>;
    modelSelection: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    mode: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const hostOffPeakRunMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"off-peak-run">;
    offPeakTaskId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    prompt: z.ZodString;
    permissionMode: z.ZodString;
    modelSelection: z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    conversationId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    serverTicketId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const hostBrowserExecuteResultMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"browser-execute-result">;
    requestId: z.ZodString;
    result: z.ZodObject<{
        ok: z.ZodBoolean;
        state: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
            title: z.ZodString;
            canGoBack: z.ZodBoolean;
            canGoForward: z.ZodBoolean;
            scrollX: z.ZodOptional<z.ZodNumber>;
            scrollY: z.ZodOptional<z.ZodNumber>;
            viewportWidth: z.ZodOptional<z.ZodNumber>;
            viewportHeight: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        snapshot: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
            title: z.ZodString;
            dom: z.ZodOptional<z.ZodArray<z.ZodObject<{
                tag: z.ZodString;
                depth: z.ZodNumber;
                inViewport: z.ZodBoolean;
                ref: z.ZodOptional<z.ZodString>;
                role: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                text: z.ZodOptional<z.ZodString>;
                attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$strict>>>;
            domTruncated: z.ZodOptional<z.ZodBoolean>;
            elements: z.ZodArray<z.ZodObject<{
                ref: z.ZodString;
                tag: z.ZodString;
                role: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                text: z.ZodOptional<z.ZodString>;
                value: z.ZodOptional<z.ZodString>;
                disabled: z.ZodOptional<z.ZodBoolean>;
                checked: z.ZodOptional<z.ZodBoolean>;
                selector: z.ZodString;
                xpath: z.ZodString;
                rect: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    width: z.ZodNumber;
                    height: z.ZodNumber;
                }, z.core.$strict>;
                inViewport: z.ZodBoolean;
                parentRef: z.ZodOptional<z.ZodString>;
                framePath: z.ZodOptional<z.ZodString>;
                attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$strict>>;
            truncated: z.ZodBoolean;
        }, z.core.$strict>>;
        image: z.ZodOptional<z.ZodObject<{
            base64: z.ZodString;
            mimeType: z.ZodLiteral<"image/png">;
        }, z.core.$strict>>;
        tabs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            tabId: z.ZodString;
            url: z.ZodString;
            title: z.ZodString;
            viewport: z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>;
            active: z.ZodOptional<z.ZodBoolean>;
            lifecycle: z.ZodOptional<z.ZodEnum<{
                active: "active";
                handoff: "handoff";
                deliverable: "deliverable";
            }>>;
        }, z.core.$strict>>>;
        userTabs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            lastOpened: z.ZodOptional<z.ZodString>;
            tabGroup: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        tab: z.ZodOptional<z.ZodObject<{
            tabId: z.ZodString;
            url: z.ZodString;
            title: z.ZodString;
            viewport: z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>;
            active: z.ZodOptional<z.ZodBoolean>;
            lifecycle: z.ZodOptional<z.ZodEnum<{
                active: "active";
                handoff: "handoff";
                deliverable: "deliverable";
            }>>;
        }, z.core.$strict>>;
        value: z.ZodOptional<z.ZodUnknown>;
        element: z.ZodOptional<z.ZodObject<{
            ref: z.ZodString;
            tag: z.ZodString;
            role: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            text: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodString>;
            disabled: z.ZodOptional<z.ZodBoolean>;
            checked: z.ZodOptional<z.ZodBoolean>;
            selector: z.ZodString;
            xpath: z.ZodString;
            rect: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>;
            inViewport: z.ZodBoolean;
            parentRef: z.ZodOptional<z.ZodString>;
            framePath: z.ZodOptional<z.ZodString>;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$strict>>;
        dialog: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            type: z.ZodEnum<{
                prompt: "prompt";
                alert: "alert";
                confirm: "confirm";
                beforeunload: "beforeunload";
            }>;
            message: z.ZodString;
            defaultPrompt: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        recording: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            status: z.ZodEnum<{
                running: "running";
                completed: "completed";
                failed: "failed";
                cancelled: "cancelled";
            }>;
            phase: z.ZodEnum<{
                completed: "completed";
                failed: "failed";
                cancelled: "cancelled";
                preparing: "preparing";
                capturing: "capturing";
                finalizing: "finalizing";
            }>;
            progress: z.ZodNumber;
            startedAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
            artifact: z.ZodOptional<z.ZodObject<{
                path: z.ZodString;
                mimeType: z.ZodLiteral<"video/webm">;
                width: z.ZodNumber;
                height: z.ZodNumber;
                fps: z.ZodNumber;
                durationMs: z.ZodNumber;
                frameCount: z.ZodNumber;
            }, z.core.$strict>>;
            error: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodEnum<{
                cancelled: "cancelled";
                timeout: "timeout";
                backend_unavailable: "backend_unavailable";
                capability_unsupported: "capability_unsupported";
                duplicate_request_id: "duplicate_request_id";
                ref_not_found: "ref_not_found";
                navigation_blocked: "navigation_blocked";
                renderer_unreachable: "renderer_unreachable";
                execution_error: "execution_error";
            }>;
            message: z.ZodString;
            sideEffect: z.ZodOptional<z.ZodEnum<{
                none: "none";
                uncertain: "uncertain";
            }>>;
        }, z.core.$strict>>;
        meta: z.ZodOptional<z.ZodObject<{
            browserUse: z.ZodLiteral<true>;
            backendType: z.ZodEnum<{
                iab: "iab";
                extension: "extension";
                cdp: "cdp";
            }>;
            browserId: z.ZodString;
            browserGeneration: z.ZodNumber;
            openTabIds: z.ZodArray<z.ZodString>;
            tabId: z.ZodOptional<z.ZodString>;
            currentUrl: z.ZodOptional<z.ZodString>;
            lifecycle: z.ZodOptional<z.ZodEnum<{
                active: "active";
                handoff: "handoff";
                deliverable: "deliverable";
                closed: "closed";
            }>>;
        }, z.core.$strict>>;
        elapsedMs: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const hostLocalMediaPreviewPathAuthorizeResultMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"local-media-preview-path-authorize-result">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    path: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
/** main → host：插件 UI 沙箱登记结果（PluginSandboxRegisterResultPayload）。 */
export declare const hostPluginSandboxRegisterResultMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"plugin-sandbox-register-result">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    instance: z.ZodOptional<z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>>;
    sandboxId: z.ZodOptional<z.ZodString>;
    initId: z.ZodOptional<z.ZodNumber>;
    shellUrl: z.ZodOptional<z.ZodString>;
    partition: z.ZodOptional<z.ZodString>;
    resourceMeta: z.ZodOptional<z.ZodObject<{
        prefersBorder: z.ZodOptional<z.ZodBoolean>;
        heightHint: z.ZodOptional<z.ZodNumber>;
        minFrameHeight: z.ZodOptional<z.ZodNumber>;
        showInline: z.ZodOptional<z.ZodBoolean>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            camera: "camera";
            microphone: "microphone";
            geolocation: "geolocation";
            clipboardWrite: "clipboardWrite";
        }>>>;
    }, z.core.$strict>>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const hostCuaPipFocusChangedMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"cua-pip-focus-changed">;
    event: z.ZodObject<{
        kind: z.ZodLiteral<"focus-changed">;
        revision: z.ZodNumber;
        sourceWindowId: z.ZodString;
        sessionId: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const hostProviderProvisioningExecuteMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"provider-provisioning-execute">;
    requestId: z.ZodString;
    environmentKey: z.ZodString;
    remoteSessionId: z.ZodString;
    trigger: z.ZodEnum<{
        "environment-online": "environment-online";
        "personal-config": "personal-config";
        "configured-default": "configured-default";
        "account-settings": "account-settings";
        credential: "credential";
    }>;
}, z.core.$strict>;
export declare const hostResourceUsageSnapshotRequestMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"resource-usage-snapshot-request">;
    requestId: z.ZodString;
}, z.core.$strict>;
export type HostResourceUsageSnapshotRequestMessage = z.infer<typeof hostResourceUsageSnapshotRequestMessageSchema>;
export declare const hostIncomingMessageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"network-capture">;
    control: z.ZodObject<{
        captureId: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"database-startup-control">;
    control: z.ZodDiscriminatedUnion<[z.ZodObject<{
        action: z.ZodLiteral<"snapshot">;
    }, z.core.$strict>, z.ZodObject<{
        action: z.ZodLiteral<"exit">;
    }, z.core.$strict>, z.ZodObject<{
        action: z.ZodLiteral<"retry">;
        attemptId: z.ZodString;
    }, z.core.$strict>], "action">;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"resource-usage-snapshot-request">;
    requestId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"resource-usage-snapshot-cancel">;
    requestId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"init-local">;
    databaseStartupId: z.ZodOptional<z.ZodString>;
    hostId: z.ZodOptional<z.ZodString>;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        desktop_window: "desktop_window";
        relay_bridge: "relay_bridge";
    }>>;
    deviceMid: z.ZodOptional<z.ZodString>;
    feedbackApiBase: z.ZodOptional<z.ZodString>;
    workspacePath: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    agentWarmupTargets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    agentSpawnFallbackCwd: z.ZodOptional<z.ZodString>;
    zcodeBuiltinProviderConfigFilePath: z.ZodString;
    runtimeProcessEnvPatch: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"connect-remote-workspace">;
    requestId: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"ssh">;
        host: z.ZodString;
        port: z.ZodOptional<z.ZodNumber>;
        username: z.ZodString;
        sshConfigAlias: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        privateKeyPath: z.ZodOptional<z.ZodString>;
        privateKeyPassphrase: z.ZodOptional<z.ZodString>;
        assetInstallMode: z.ZodOptional<z.ZodEnum<{
            "local-download-upload": "local-download-upload";
            "remote-download": "remote-download";
        }>>;
        resourcePackages: z.ZodOptional<z.ZodObject<{
            selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"wsl">;
        distro: z.ZodOptional<z.ZodString>;
        user: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"docker">;
        container: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"server">;
        url: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodOptional<z.ZodString>;
        serverId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">;
    remoteAssets: z.ZodObject<{
        mockCdnDir: z.ZodOptional<z.ZodString>;
        remoteCdnBaseUrl: z.ZodOptional<z.ZodString>;
        remoteCdnBaseUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
        remoteCacheDir: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    workspacePath: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"cancel-remote-workspace-connect">;
    requestId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"bind-remote-workspace-context">;
    requestId: z.ZodString;
    remoteSessionId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"dispose-remote-workspace-session">;
    requestId: z.ZodString;
    remoteSessionId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"attach-service-port">;
    requestId: z.ZodString;
    attachmentId: z.ZodString;
    clientMode: z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>;
    scope: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"local">;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"remote">;
        remoteSessionId: z.ZodString;
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodString;
    }, z.core.$strict>], "kind">;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"detach-service-port">;
    attachmentId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"dispose">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"broadcast">;
    message: z.ZodObject<{
        channel: z.ZodString;
        payload: z.ZodUnknown;
        sourceWindowId: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-result">;
    requestId: z.ZodString;
    status: z.ZodLiteral<"acquired">;
    claimToken: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-result">;
    requestId: z.ZodString;
    status: z.ZodLiteral<"busy">;
    retryAfterMs: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-result">;
    requestId: z.ZodString;
    status: z.ZodLiteral<"committed">;
}, z.core.$strip>], "status">, z.ZodObject<{
    type: z.ZodLiteral<"task-realtime-deliver">;
    event: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"task-run-lease-result">;
    result: z.ZodDiscriminatedUnion<[z.ZodObject<{
        leaseRequestId: z.ZodString;
        acquired: z.ZodLiteral<true>;
        ownerHostId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        leaseRequestId: z.ZodString;
        acquired: z.ZodLiteral<false>;
        ownerHostId: z.ZodString;
        reason: z.ZodLiteral<"owned_by_other_host">;
    }, z.core.$strict>], "acquired">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"task-owner-command-deliver">;
    command: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"task-owner-command-result">;
    result: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-reconnect-result">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    sessionId: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-connection-status-result">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    connected: z.ZodOptional<z.ZodBoolean>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-runtime-port">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"session-message-deliver">;
    request: z.ZodObject<{
        content: z.ZodString;
        createdAt: z.ZodString;
        fromSessionId: z.ZodString;
        messageId: z.ZodString;
        requestId: z.ZodString;
        toSessionId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"session-message-delivery-result">;
    result: z.ZodObject<{
        error: z.ZodOptional<z.ZodString>;
        messageId: z.ZodString;
        requestId: z.ZodString;
        sessionId: z.ZodString;
        status: z.ZodEnum<{
            failed: "failed";
            success: "success";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"feedback-log-archive-result">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    path: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"cron-run">;
    automationId: z.ZodString;
    runId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    prompt: z.ZodString;
    targetTaskId: z.ZodOptional<z.ZodString>;
    modelSelection: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    mode: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"off-peak-run">;
    offPeakTaskId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    prompt: z.ZodString;
    permissionMode: z.ZodString;
    modelSelection: z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    conversationId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    serverTicketId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"browser-execute-result">;
    requestId: z.ZodString;
    result: z.ZodObject<{
        ok: z.ZodBoolean;
        state: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
            title: z.ZodString;
            canGoBack: z.ZodBoolean;
            canGoForward: z.ZodBoolean;
            scrollX: z.ZodOptional<z.ZodNumber>;
            scrollY: z.ZodOptional<z.ZodNumber>;
            viewportWidth: z.ZodOptional<z.ZodNumber>;
            viewportHeight: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        snapshot: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
            title: z.ZodString;
            dom: z.ZodOptional<z.ZodArray<z.ZodObject<{
                tag: z.ZodString;
                depth: z.ZodNumber;
                inViewport: z.ZodBoolean;
                ref: z.ZodOptional<z.ZodString>;
                role: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                text: z.ZodOptional<z.ZodString>;
                attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$strict>>>;
            domTruncated: z.ZodOptional<z.ZodBoolean>;
            elements: z.ZodArray<z.ZodObject<{
                ref: z.ZodString;
                tag: z.ZodString;
                role: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                text: z.ZodOptional<z.ZodString>;
                value: z.ZodOptional<z.ZodString>;
                disabled: z.ZodOptional<z.ZodBoolean>;
                checked: z.ZodOptional<z.ZodBoolean>;
                selector: z.ZodString;
                xpath: z.ZodString;
                rect: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    width: z.ZodNumber;
                    height: z.ZodNumber;
                }, z.core.$strict>;
                inViewport: z.ZodBoolean;
                parentRef: z.ZodOptional<z.ZodString>;
                framePath: z.ZodOptional<z.ZodString>;
                attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$strict>>;
            truncated: z.ZodBoolean;
        }, z.core.$strict>>;
        image: z.ZodOptional<z.ZodObject<{
            base64: z.ZodString;
            mimeType: z.ZodLiteral<"image/png">;
        }, z.core.$strict>>;
        tabs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            tabId: z.ZodString;
            url: z.ZodString;
            title: z.ZodString;
            viewport: z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>;
            active: z.ZodOptional<z.ZodBoolean>;
            lifecycle: z.ZodOptional<z.ZodEnum<{
                active: "active";
                handoff: "handoff";
                deliverable: "deliverable";
            }>>;
        }, z.core.$strict>>>;
        userTabs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            lastOpened: z.ZodOptional<z.ZodString>;
            tabGroup: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        tab: z.ZodOptional<z.ZodObject<{
            tabId: z.ZodString;
            url: z.ZodString;
            title: z.ZodString;
            viewport: z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>;
            active: z.ZodOptional<z.ZodBoolean>;
            lifecycle: z.ZodOptional<z.ZodEnum<{
                active: "active";
                handoff: "handoff";
                deliverable: "deliverable";
            }>>;
        }, z.core.$strict>>;
        value: z.ZodOptional<z.ZodUnknown>;
        element: z.ZodOptional<z.ZodObject<{
            ref: z.ZodString;
            tag: z.ZodString;
            role: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            text: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodString>;
            disabled: z.ZodOptional<z.ZodBoolean>;
            checked: z.ZodOptional<z.ZodBoolean>;
            selector: z.ZodString;
            xpath: z.ZodString;
            rect: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>;
            inViewport: z.ZodBoolean;
            parentRef: z.ZodOptional<z.ZodString>;
            framePath: z.ZodOptional<z.ZodString>;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$strict>>;
        dialog: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            type: z.ZodEnum<{
                prompt: "prompt";
                alert: "alert";
                confirm: "confirm";
                beforeunload: "beforeunload";
            }>;
            message: z.ZodString;
            defaultPrompt: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        recording: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            status: z.ZodEnum<{
                running: "running";
                completed: "completed";
                failed: "failed";
                cancelled: "cancelled";
            }>;
            phase: z.ZodEnum<{
                completed: "completed";
                failed: "failed";
                cancelled: "cancelled";
                preparing: "preparing";
                capturing: "capturing";
                finalizing: "finalizing";
            }>;
            progress: z.ZodNumber;
            startedAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
            artifact: z.ZodOptional<z.ZodObject<{
                path: z.ZodString;
                mimeType: z.ZodLiteral<"video/webm">;
                width: z.ZodNumber;
                height: z.ZodNumber;
                fps: z.ZodNumber;
                durationMs: z.ZodNumber;
                frameCount: z.ZodNumber;
            }, z.core.$strict>>;
            error: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodEnum<{
                cancelled: "cancelled";
                timeout: "timeout";
                backend_unavailable: "backend_unavailable";
                capability_unsupported: "capability_unsupported";
                duplicate_request_id: "duplicate_request_id";
                ref_not_found: "ref_not_found";
                navigation_blocked: "navigation_blocked";
                renderer_unreachable: "renderer_unreachable";
                execution_error: "execution_error";
            }>;
            message: z.ZodString;
            sideEffect: z.ZodOptional<z.ZodEnum<{
                none: "none";
                uncertain: "uncertain";
            }>>;
        }, z.core.$strict>>;
        meta: z.ZodOptional<z.ZodObject<{
            browserUse: z.ZodLiteral<true>;
            backendType: z.ZodEnum<{
                iab: "iab";
                extension: "extension";
                cdp: "cdp";
            }>;
            browserId: z.ZodString;
            browserGeneration: z.ZodNumber;
            openTabIds: z.ZodArray<z.ZodString>;
            tabId: z.ZodOptional<z.ZodString>;
            currentUrl: z.ZodOptional<z.ZodString>;
            lifecycle: z.ZodOptional<z.ZodEnum<{
                active: "active";
                handoff: "handoff";
                deliverable: "deliverable";
                closed: "closed";
            }>>;
        }, z.core.$strict>>;
        elapsedMs: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"local-media-preview-path-authorize-result">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    path: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"plugin-sandbox-register-result">;
    requestId: z.ZodString;
    ok: z.ZodBoolean;
    instance: z.ZodOptional<z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>>;
    sandboxId: z.ZodOptional<z.ZodString>;
    initId: z.ZodOptional<z.ZodNumber>;
    shellUrl: z.ZodOptional<z.ZodString>;
    partition: z.ZodOptional<z.ZodString>;
    resourceMeta: z.ZodOptional<z.ZodObject<{
        prefersBorder: z.ZodOptional<z.ZodBoolean>;
        heightHint: z.ZodOptional<z.ZodNumber>;
        minFrameHeight: z.ZodOptional<z.ZodNumber>;
        showInline: z.ZodOptional<z.ZodBoolean>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            camera: "camera";
            microphone: "microphone";
            geolocation: "geolocation";
            clipboardWrite: "clipboardWrite";
        }>>>;
    }, z.core.$strict>>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"cua-pip-focus-changed">;
    event: z.ZodObject<{
        kind: z.ZodLiteral<"focus-changed">;
        revision: z.ZodNumber;
        sourceWindowId: z.ZodString;
        sessionId: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"provider-provisioning-execute">;
    requestId: z.ZodString;
    environmentKey: z.ZodString;
    remoteSessionId: z.ZodString;
    trigger: z.ZodEnum<{
        "environment-online": "environment-online";
        "personal-config": "personal-config";
        "configured-default": "configured-default";
        "account-settings": "account-settings";
        credential: "credential";
    }>;
}, z.core.$strict>], "type">;
export declare const hostRemoteWorkspaceConnectedResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"remote-workspace-connected">;
    requestId: z.ZodString;
    descriptor: z.ZodObject<{
        remoteSessionId: z.ZodString;
        target: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"ssh">;
            host: z.ZodString;
            port: z.ZodOptional<z.ZodNumber>;
            username: z.ZodString;
            sshConfigAlias: z.ZodOptional<z.ZodString>;
            password: z.ZodOptional<z.ZodString>;
            privateKeyPath: z.ZodOptional<z.ZodString>;
            privateKeyPassphrase: z.ZodOptional<z.ZodString>;
            assetInstallMode: z.ZodOptional<z.ZodEnum<{
                "local-download-upload": "local-download-upload";
                "remote-download": "remote-download";
            }>>;
            resourcePackages: z.ZodOptional<z.ZodObject<{
                selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"wsl">;
            distro: z.ZodOptional<z.ZodString>;
            user: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"docker">;
            container: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"server">;
            url: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            token: z.ZodOptional<z.ZodString>;
            workspacePath: z.ZodOptional<z.ZodString>;
            serverId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>], "kind">;
        workspacePath: z.ZodOptional<z.ZodString>;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        generation: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const hostRemoteWorkspaceConnectionLogResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"remote-workspace-connection-log">;
    requestId: z.ZodString;
    level: z.ZodEnum<{
        error: "error";
        info: "info";
        warn: "warn";
    }>;
    message: z.ZodString;
}, z.core.$strict>;
export declare const hostRemoteWorkspaceConnectFailedResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"remote-workspace-connect-failed">;
    requestId: z.ZodString;
    error: z.ZodString;
}, z.core.$strict>;
export declare const hostRemoteWorkspaceClosedResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"remote-workspace-closed">;
    remoteSessionId: z.ZodString;
    reason: z.ZodEnum<{
        "connection-closed": "connection-closed";
        disposed: "disposed";
        "connect-cancelled": "connect-cancelled";
    }>;
    exitCode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const hostLogResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"log">;
    level: z.ZodEnum<{
        error: "error";
        info: "info";
        warn: "warn";
    }>;
    source: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
export { zcodeProviderSchema };
export declare const zcodeTaskMigrationSourceSchema: z.ZodEnum<{
    claudeCode: "claudeCode";
}>;
export declare const hostAgentProcessSpawnedResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"agent-process-spawned">;
    lane: z.ZodOptional<z.ZodString>;
    pid: z.ZodNumber;
    provider: z.ZodEnum<{
        glm: "glm";
    }>;
    workspacePath: z.ZodString;
    command: z.ZodString;
    args: z.ZodArray<z.ZodString>;
    startedAt: z.ZodNumber;
    runtimeGeneration: z.ZodOptional<z.ZodNumber>;
    runtimeInstanceId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type HostAgentProcessSpawnedResponse = z.infer<typeof hostAgentProcessSpawnedResponseSchema>;
export declare const hostAgentProcessReadyResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"agent-process-ready">;
    lane: z.ZodOptional<z.ZodString>;
    pid: z.ZodNumber;
    provider: z.ZodEnum<{
        glm: "glm";
    }>;
    workspacePath: z.ZodString;
    readyAt: z.ZodNumber;
    startupDurationMs: z.ZodNumber;
    runtimeGeneration: z.ZodNumber;
    runtimeInstanceId: z.ZodString;
}, z.core.$strip>;
export type HostAgentProcessReadyResponse = z.infer<typeof hostAgentProcessReadyResponseSchema>;
export declare const hostAgentProcessExitedResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"agent-process-exited">;
    lane: z.ZodOptional<z.ZodString>;
    pid: z.ZodNumber;
    provider: z.ZodEnum<{
        glm: "glm";
    }>;
    workspacePath: z.ZodString;
    exitCode: z.ZodNullable<z.ZodNumber>;
    signal: z.ZodNullable<z.ZodString>;
    endedAt: z.ZodNumber;
    terminationKind: z.ZodEnum<{
        expected: "expected";
        unexpected: "unexpected";
        watchdog_recycle: "watchdog_recycle";
    }>;
    terminationReason: z.ZodOptional<z.ZodString>;
    runtimeReady: z.ZodOptional<z.ZodBoolean>;
    runtimeGeneration: z.ZodNumber;
    runtimeInstanceId: z.ZodOptional<z.ZodString>;
    uptimeMs: z.ZodNumber;
    stderrLineCount: z.ZodNumber;
    stderrTail: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type HostAgentProcessExitedResponse = z.infer<typeof hostAgentProcessExitedResponseSchema>;
export declare const hostAgentProcessErrorResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"agent-process-error">;
    lane: z.ZodOptional<z.ZodString>;
    pid: z.ZodNullable<z.ZodNumber>;
    provider: z.ZodEnum<{
        glm: "glm";
    }>;
    workspacePath: z.ZodString;
    command: z.ZodString;
    args: z.ZodArray<z.ZodString>;
    errorName: z.ZodString;
    errorCode: z.ZodOptional<z.ZodString>;
    errorMessage: z.ZodString;
    errorStack: z.ZodOptional<z.ZodString>;
    runtimeGeneration: z.ZodNumber;
    runtimeInstanceId: z.ZodOptional<z.ZodString>;
    occurredAt: z.ZodNumber;
}, z.core.$strip>;
export type HostAgentProcessErrorResponse = z.infer<typeof hostAgentProcessErrorResponseSchema>;
export declare const hostAgentProcessExceptionResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"agent-process-exception">;
    lane: z.ZodOptional<z.ZodString>;
    pid: z.ZodNumber;
    provider: z.ZodEnum<{
        glm: "glm";
    }>;
    workspacePath: z.ZodString;
    runtimeGeneration: z.ZodNumber;
    runtimeInstanceId: z.ZodString;
    diagnostic: z.ZodObject<{
        version: z.ZodLiteral<1>;
        errorId: z.ZodUUID;
        kind: z.ZodEnum<{
            uncaughtException: "uncaughtException";
            unhandledRejection: "unhandledRejection";
        }>;
        origin: z.ZodEnum<{
            uncaughtException: "uncaughtException";
            unhandledRejection: "unhandledRejection";
        }>;
        name: z.ZodString;
        message: z.ZodString;
        stack: z.ZodOptional<z.ZodString>;
        occurredAt: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>;
export type HostAgentProcessExceptionResponse = z.infer<typeof hostAgentProcessExceptionResponseSchema>;
/**
 * services 打标后的 CLI 资源样本。
 *
 * `lane` 不是 CLI 协议字段：CLI 进程不知道自己被哪个进程管理器拉起，由 services 层在解析
 * 协议样本时按所属进程管理器补上。样本自身仍按 CLI 协议 schema 严格校验，因此 CLI 自报 lane
 * 会被协议层直接拒绝。`lane` 可选是为了兼容版本落后、还没打标的远端 server。
 */
export declare const processResourceCliLaneSchema: z.ZodEnum<{
    plugin: "plugin";
    chat: "chat";
    "mcp-status": "mcp-status";
}>;
export declare const agentLaneResourceSampleSchema: z.ZodObject<{
    platform: z.ZodEnum<{
        darwin: "darwin";
        aix: "aix";
        android: "android";
        freebsd: "freebsd";
        haiku: "haiku";
        linux: "linux";
        netbsd: "netbsd";
        openbsd: "openbsd";
        sunos: "sunos";
        win32: "win32";
        cygwin: "cygwin";
    }>;
    arch: z.ZodEnum<{
        arm: "arm";
        arm64: "arm64";
        ia32: "ia32";
        loong64: "loong64";
        mips: "mips";
        mipsel: "mipsel";
        ppc: "ppc";
        ppc64: "ppc64";
        riscv64: "riscv64";
        s390: "s390";
        s390x: "s390x";
        x64: "x64";
    }>;
    logicalCpuCount: z.ZodNumber;
    intervalMs: z.ZodNumber;
    cpuCores: z.ZodNumber;
    cpuPercent: z.ZodNumber;
    rssKb: z.ZodNumber;
    heapUsedKb: z.ZodOptional<z.ZodNumber>;
    uptimeMinutes: z.ZodOptional<z.ZodNumber>;
    totalMemoryGb: z.ZodOptional<z.ZodNumber>;
    instanceToken: z.ZodOptional<z.ZodString>;
    lane: z.ZodOptional<z.ZodEnum<{
        plugin: "plugin";
        chat: "chat";
        "mcp-status": "mcp-status";
    }>>;
}, z.core.$strict>;
export type AgentLaneResourceSample = z.infer<typeof agentLaneResourceSampleSchema>;
export declare const hostAgentResourceSampleResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"agent-resource-sample">;
    runtimeSurface: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    environmentKey: z.ZodOptional<z.ZodString>;
    sample: z.ZodObject<{
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        logicalCpuCount: z.ZodNumber;
        intervalMs: z.ZodNumber;
        cpuCores: z.ZodNumber;
        cpuPercent: z.ZodNumber;
        rssKb: z.ZodNumber;
        heapUsedKb: z.ZodOptional<z.ZodNumber>;
        uptimeMinutes: z.ZodOptional<z.ZodNumber>;
        totalMemoryGb: z.ZodOptional<z.ZodNumber>;
        instanceToken: z.ZodOptional<z.ZodString>;
        lane: z.ZodOptional<z.ZodEnum<{
            plugin: "plugin";
            chat: "chat";
            "mcp-status": "mcp-status";
        }>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type HostAgentResourceSampleResponse = z.infer<typeof hostAgentResourceSampleResponseSchema>;
/**
 * Node 进程（host / scheduler）每 60 秒自采的瞬时事实
 *
 * 只带这三项：CPU 与 RSS 由 main 的 `getAppMetrics()` 负责，heap 只有进程自己读得到。
 */
export declare const nodeSelfResourceSampleSchema: z.ZodObject<{
    cpuPercent: z.ZodNumber;
    rssKb: z.ZodNumber;
    heapUsedKb: z.ZodNumber;
}, z.core.$strict>;
export type NodeSelfResourceSample = z.infer<typeof nodeSelfResourceSampleSchema>;
/**
 * 主窗口 renderer 每 60 秒经 preload 桥送 main 的 heap 读数
 *
 * 只带 heap：renderer 的 CPU 与 RSS 由 main 的 `getAppMetrics()` 负责，
 * renderer 自己也读不到。`strict` 保证 UI 侧不会顺手夹带路径、session 等隐私字段。
 */
export declare const rendererHeapSampleSchema: z.ZodObject<{
    heapUsedKb: z.ZodNumber;
}, z.core.$strict>;
export type RendererHeapSample = z.infer<typeof rendererHeapSampleSchema>;
export declare const hostResourceSampleResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"host-resource-sample">;
    sample: z.ZodObject<{
        cpuPercent: z.ZodNumber;
        rssKb: z.ZodNumber;
        heapUsedKb: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>;
export type HostResourceSampleResponse = z.infer<typeof hostResourceSampleResponseSchema>;
export declare const hostMcpResourceSamplesResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"mcp-resource-samples">;
    runtimeSurface: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    environmentKey: z.ZodOptional<z.ZodString>;
    samples: z.ZodArray<z.ZodObject<{
        mcpId: z.ZodString;
        instanceToken: z.ZodString;
        sampledAt: z.ZodNumber;
        intervalMs: z.ZodNumber;
        processCount: z.ZodNumber;
        rssKbTotal: z.ZodNumber;
        rssKbMaxProcess: z.ZodNumber;
        cpuTimeMsDelta: z.ZodNumber;
        uptimeMinutes: z.ZodNumber;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        logicalCpuCount: z.ZodNumber;
        totalMemoryGb: z.ZodNumber;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type HostMcpResourceSamplesResponse = z.infer<typeof hostMcpResourceSamplesResponseSchema>;
export declare const hostToolExecResourceResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"tool-exec-resource">;
    runtimeSurface: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    sample: z.ZodObject<{
        completionToken: z.ZodOptional<z.ZodString>;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        toolName: z.ZodLiteral<"bash">;
        durationMs: z.ZodNumber;
        exitKind: z.ZodEnum<{
            completed: "completed";
            killed: "killed";
            error: "error";
            timeout: "timeout";
        }>;
        treeRssKbPeak: z.ZodOptional<z.ZodNumber>;
        treeCpuTimeMs: z.ZodOptional<z.ZodNumber>;
        sampleCount: z.ZodNumber;
        cliRssKb: z.ZodNumber;
        systemFreeMemoryKb: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>;
export type HostToolExecResourceResponse = z.infer<typeof hostToolExecResourceResponseSchema>;
export declare const hostMcpTelemetryResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"mcp-telemetry">;
    runtimeSurface: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    event: z.ZodDiscriminatedUnion<[z.ZodObject<{
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        occurredAt: z.ZodNumber;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        mcpId: z.ZodString;
        mcpInstanceId: z.ZodString;
        mcpIsolation: z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>;
        mcpSource: z.ZodEnum<{
            custom: "custom";
            plugin: "plugin";
            builtin: "builtin";
        }>;
        kind: z.ZodLiteral<"process_start">;
    }, z.core.$strict>, z.ZodObject<{
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        occurredAt: z.ZodNumber;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        affectedSessionCount: z.ZodNumber;
        exitCode: z.ZodNullable<z.ZodNumber>;
        signal: z.ZodNullable<z.ZodString>;
        uptimeMs: z.ZodNumber;
        mcpId: z.ZodString;
        mcpInstanceId: z.ZodString;
        mcpIsolation: z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>;
        mcpSource: z.ZodEnum<{
            custom: "custom";
            plugin: "plugin";
            builtin: "builtin";
        }>;
        kind: z.ZodLiteral<"process_crash">;
    }, z.core.$strict>, z.ZodObject<{
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        occurredAt: z.ZodNumber;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        kind: z.ZodLiteral<"session_startup">;
        configuredCount: z.ZodNumber;
        connectedCount: z.ZodNumber;
        failedCount: z.ZodNumber;
        processCount: z.ZodNumber;
        sessionId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        occurredAt: z.ZodNumber;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        memoryKb: z.ZodNumber;
        memoryScope: z.ZodEnum<{
            process_tree: "process_tree";
            direct_process: "direct_process";
        }>;
        orphanSuspected: z.ZodBoolean;
        ownerSessionCount: z.ZodNumber;
        unownedSeconds: z.ZodNumber;
        mcpId: z.ZodString;
        mcpInstanceId: z.ZodString;
        mcpIsolation: z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>;
        mcpSource: z.ZodEnum<{
            custom: "custom";
            plugin: "plugin";
            builtin: "builtin";
        }>;
        kind: z.ZodLiteral<"memory">;
    }, z.core.$strict>], "kind">;
}, z.core.$strict>;
export type HostMcpTelemetryResponse = z.infer<typeof hostMcpTelemetryResponseSchema>;
export declare const hostSessionCreateTelemetryResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"session-create-telemetry">;
    event: z.ZodObject<{
        elementName: z.ZodLiteral<"session_create">;
        eventRegion: z.ZodLiteral<"app">;
        eventType: z.ZodLiteral<"result">;
        talkId: z.ZodString;
        messageId: z.ZodString;
        context: z.ZodObject<{
            clientTimezone: z.ZodString;
            clientLanguage: z.ZodString;
            screenResolution: z.ZodString;
        }, z.core.$strict>;
        eventExtraDetail: z.ZodObject<{
            workspace_kind: z.ZodEnum<{
                local: "local";
                remote: "remote";
            }>;
            remote_kind: z.ZodEnum<{
                "": "";
                ssh: "ssh";
                wsl: "wsl";
                docker: "docker";
                server: "server";
            }>;
            create_source: z.ZodEnum<{
                automation_idle: "automation_idle";
                automation_scheduled: "automation_scheduled";
            }>;
            client_kind: z.ZodLiteral<"desktop">;
        }, z.core.$strict>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type HostSessionCreateTelemetryResponse = z.infer<typeof hostSessionCreateTelemetryResponseSchema>;
export declare const hostAgentRunningTaskCountChangedResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"agent-running-task-count-changed">;
    runningTaskCount: z.ZodNumber;
}, z.core.$strip>;
export declare const hostWorkspaceRunningTaskCountChangedResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"workspace-running-task-count-changed">;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    runningTaskCount: z.ZodNumber;
}, z.core.$strip>;
export declare const hostCuaOperationStateResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"cua-operation-state">;
    active: z.ZodBoolean;
    sessionId: z.ZodString;
    turnId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type HostCuaOperationStateResponse = z.infer<typeof hostCuaOperationStateResponseSchema>;
export declare const hostBroadcastClaimRequestResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-request">;
    requestId: z.ZodString;
    key: z.ZodString;
}, z.core.$strip>;
export declare const hostBroadcastClaimCommitResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-commit">;
    key: z.ZodString;
    claimToken: z.ZodString;
}, z.core.$strip>;
export declare const hostBroadcastClaimReleaseResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-release">;
    key: z.ZodString;
    claimToken: z.ZodString;
}, z.core.$strip>;
export declare const hostTaskRealtimePublishResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"task-realtime-publish">;
    event: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>;
export declare const hostTaskStreamOpPublishResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"task-stream-op-publish">;
    target: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
        taskId: z.ZodString;
        runId: z.ZodString;
        traceId: z.ZodString;
        ownerClientId: z.ZodOptional<z.ZodString>;
        ownerDeviceLabel: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    op: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>;
export declare const hostTaskRunLeaseAcquireResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"task-run-lease-acquire">;
    request: z.ZodObject<{
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
}, z.core.$strip>;
export declare const hostTaskRunLeaseReleaseResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"task-run-lease-release">;
    target: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
        taskId: z.ZodString;
        runId: z.ZodString;
        traceId: z.ZodString;
        ownerClientId: z.ZodOptional<z.ZodString>;
        ownerDeviceLabel: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const hostTaskOwnerCommandRequestResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"task-owner-command-request">;
    command: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>;
export declare const hostTaskOwnerCommandResultResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"task-owner-command-result">;
    result: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>;
export declare const hostBotRemoteWorkspaceReconnectRequestResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-reconnect-request">;
    requestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"ssh">;
        host: z.ZodString;
        port: z.ZodOptional<z.ZodNumber>;
        username: z.ZodString;
        sshConfigAlias: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        privateKeyPath: z.ZodOptional<z.ZodString>;
        privateKeyPassphrase: z.ZodOptional<z.ZodString>;
        assetInstallMode: z.ZodOptional<z.ZodEnum<{
            "local-download-upload": "local-download-upload";
            "remote-download": "remote-download";
        }>>;
        resourcePackages: z.ZodOptional<z.ZodObject<{
            selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"wsl">;
        distro: z.ZodOptional<z.ZodString>;
        user: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"docker">;
        container: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"server">;
        url: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodOptional<z.ZodString>;
        serverId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">;
}, z.core.$strip>;
export declare const hostBotRemoteWorkspaceConnectionStatusRequestResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-connection-status-request">;
    requestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"ssh">;
        host: z.ZodString;
        port: z.ZodOptional<z.ZodNumber>;
        username: z.ZodString;
        sshConfigAlias: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        privateKeyPath: z.ZodOptional<z.ZodString>;
        privateKeyPassphrase: z.ZodOptional<z.ZodString>;
        assetInstallMode: z.ZodOptional<z.ZodEnum<{
            "local-download-upload": "local-download-upload";
            "remote-download": "remote-download";
        }>>;
        resourcePackages: z.ZodOptional<z.ZodObject<{
            selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"wsl">;
        distro: z.ZodOptional<z.ZodString>;
        user: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"docker">;
        container: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"server">;
        url: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodOptional<z.ZodString>;
        serverId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">;
}, z.core.$strip>;
export declare const hostBotRemoteWorkspaceRuntimePortRequestResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-runtime-port-request">;
    requestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"ssh">;
        host: z.ZodString;
        port: z.ZodOptional<z.ZodNumber>;
        username: z.ZodString;
        sshConfigAlias: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        privateKeyPath: z.ZodOptional<z.ZodString>;
        privateKeyPassphrase: z.ZodOptional<z.ZodString>;
        assetInstallMode: z.ZodOptional<z.ZodEnum<{
            "local-download-upload": "local-download-upload";
            "remote-download": "remote-download";
        }>>;
        resourcePackages: z.ZodOptional<z.ZodObject<{
            selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"wsl">;
        distro: z.ZodOptional<z.ZodString>;
        user: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"docker">;
        container: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"server">;
        url: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodOptional<z.ZodString>;
        serverId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">;
}, z.core.$strip>;
export declare const hostSessionMessageSendRequestedResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"session-message-send-requested">;
    request: z.ZodObject<{
        content: z.ZodString;
        createdAt: z.ZodString;
        fromSessionId: z.ZodString;
        messageId: z.ZodString;
        requestId: z.ZodString;
        toSessionId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const hostSessionRouteAnnounceResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"session-route-announce">;
    route: z.ZodObject<{
        sessionId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const hostSessionMessageDeliverResultResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"session-message-deliver-result">;
    result: z.ZodObject<{
        error: z.ZodOptional<z.ZodString>;
        messageId: z.ZodString;
        requestId: z.ZodString;
        sessionId: z.ZodString;
        status: z.ZodEnum<{
            failed: "failed";
            success: "success";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const hostFeedbackLogArchiveRequestResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"feedback-log-archive-request">;
    requestId: z.ZodString;
    sourceDir: z.ZodString;
}, z.core.$strip>;
export declare const hostCronRunResultResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"cron-run-result">;
    runId: z.ZodString;
    ok: z.ZodBoolean;
    taskId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    failureKind: z.ZodOptional<z.ZodEnum<{
        transient: "transient";
        permanent: "permanent";
    }>>;
}, z.core.$strip>;
export declare const hostOffPeakRunResultResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"off-peak-run-result">;
    offPeakTaskId: z.ZodString;
    ok: z.ZodBoolean;
    conversationId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    failureKind: z.ZodOptional<z.ZodEnum<{
        transient: "transient";
        permanent: "permanent";
    }>>;
}, z.core.$strip>;
export declare const hostCronSchedulerWakeRequestResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"cron-scheduler-wake-request">;
    automationId: z.ZodString;
}, z.core.$strip>;
export declare const hostOffPeakSchedulerWakeRequestResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"off-peak-scheduler-wake-request">;
    offPeakTaskId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const hostBrowserExecuteRequestResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"browser-execute-request">;
    requestId: z.ZodString;
    browserId: z.ZodOptional<z.ZodString>;
    browserGeneration: z.ZodOptional<z.ZodNumber>;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodOptional<z.ZodString>;
    workspacePath: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    clientMode: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    sessionContext: z.ZodOptional<z.ZodEnum<{
        cached: "cached";
        live: "live";
    }>>;
    command: z.ZodDiscriminatedUnion<[z.ZodObject<{
        method: z.ZodLiteral<"navigate">;
        url: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"back">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"forward">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"reload">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"snapshot">;
        maxElements: z.ZodOptional<z.ZodNumber>;
        includeHidden: z.ZodOptional<z.ZodBoolean>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"click">;
        ref: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        button: z.ZodOptional<z.ZodEnum<{
            left: "left";
            right: "right";
            middle: "middle";
        }>>;
        doubleClick: z.ZodOptional<z.ZodBoolean>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"fill">;
        ref: z.ZodString;
        value: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"type">;
        ref: z.ZodOptional<z.ZodString>;
        text: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"press">;
        key: z.ZodString;
        ref: z.ZodOptional<z.ZodString>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cuaKeypress">;
        keys: z.ZodArray<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"scroll">;
        ref: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cuaScroll">;
        x: z.ZodNumber;
        y: z.ZodNumber;
        scrollX: z.ZodNumber;
        scrollY: z.ZodNumber;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"domCuaScroll">;
        nodeId: z.ZodOptional<z.ZodString>;
        scrollX: z.ZodNumber;
        scrollY: z.ZodNumber;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"screenshot">;
        ref: z.ZodOptional<z.ZodString>;
        fullPage: z.ZodOptional<z.ZodBoolean>;
        clip: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"getState">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"hover">;
        ref: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"select">;
        ref: z.ZodString;
        values: z.ZodArray<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"check">;
        ref: z.ZodString;
        checked: z.ZodOptional<z.ZodBoolean>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"drag">;
        fromRef: z.ZodOptional<z.ZodString>;
        toRef: z.ZodOptional<z.ZodString>;
        from: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>>;
        to: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cuaDrag">;
        path: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"elementInfo">;
        x: z.ZodNumber;
        y: z.ZodNumber;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"evaluate">;
        expression: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"getDialog">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"handleDialog">;
        accept: z.ZodBoolean;
        promptText: z.ZodOptional<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"waitFor">;
        selector: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        textGone: z.ZodOptional<z.ZodString>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"playwrightWaitForTimeout">;
        timeoutMs: z.ZodNumber;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"playwright">;
        action: z.ZodDiscriminatedUnion<[z.ZodObject<{
            name: z.ZodLiteral<"domSnapshot">;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"elementInfo">;
            x: z.ZodNumber;
            y: z.ZodNumber;
            includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"elementScreenshot">;
            x: z.ZodNumber;
            y: z.ZodNumber;
            includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"evaluate">;
            expression: z.ZodString;
            expressionKind: z.ZodEnum<{
                string: "string";
                function: "function";
            }>;
            arg: z.ZodOptional<z.ZodUnknown>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"waitForLoadState">;
            state: z.ZodOptional<z.ZodEnum<{
                load: "load";
                domcontentloaded: "domcontentloaded";
                networkidle: "networkidle";
            }>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"waitForURL">;
            url: z.ZodString;
            waitUntil: z.ZodOptional<z.ZodEnum<{
                load: "load";
                domcontentloaded: "domcontentloaded";
                networkidle: "networkidle";
                commit: "commit";
            }>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"waitForEvent">;
            event: z.ZodEnum<{
                download: "download";
                filechooser: "filechooser";
            }>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"downloadPath">;
            downloadId: z.ZodString;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"fileChooserSetFiles">;
            fileChooserId: z.ZodString;
            files: z.ZodArray<z.ZodString>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"locator">;
            selector: z.ZodString;
            operation: z.ZodEnum<{
                fill: "fill";
                click: "click";
                press: "press";
                evaluate: "evaluate";
                waitFor: "waitFor";
                count: "count";
                allTextContents: "allTextContents";
                dblclick: "dblclick";
                downloadMedia: "downloadMedia";
                getAttribute: "getAttribute";
                innerText: "innerText";
                isEnabled: "isEnabled";
                isVisible: "isVisible";
                selectOption: "selectOption";
                setChecked: "setChecked";
                textContent: "textContent";
            }>;
            value: z.ZodOptional<z.ZodUnknown>;
            arg: z.ZodOptional<z.ZodUnknown>;
            expression: z.ZodOptional<z.ZodString>;
            expressionKind: z.ZodOptional<z.ZodEnum<{
                string: "string";
                function: "function";
            }>>;
            attribute: z.ZodOptional<z.ZodString>;
            checked: z.ZodOptional<z.ZodBoolean>;
            replace: z.ZodOptional<z.ZodBoolean>;
            force: z.ZodOptional<z.ZodBoolean>;
            button: z.ZodOptional<z.ZodEnum<{
                left: "left";
                right: "right";
                middle: "middle";
            }>>;
            modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                Alt: "Alt";
                Shift: "Shift";
                Control: "Control";
                ControlOrMeta: "ControlOrMeta";
                Meta: "Meta";
            }>>>;
            state: z.ZodOptional<z.ZodEnum<{
                visible: "visible";
                hidden: "hidden";
                attached: "attached";
                detached: "detached";
            }>>;
            selections: z.ZodOptional<z.ZodArray<z.ZodObject<{
                value: z.ZodOptional<z.ZodString>;
                label: z.ZodOptional<z.ZodString>;
                index: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>], "name">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"capabilities">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"browserVisibilityGet">;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"browserVisibilitySet">;
        visible: z.ZodBoolean;
    }, z.core.$strict>, z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        method: z.ZodLiteral<"browserViewportSet">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"browserViewportReset">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"recordingStart">;
        options: z.ZodOptional<z.ZodObject<{
            viewport: z.ZodOptional<z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>>;
            fps: z.ZodOptional<z.ZodNumber>;
            jpegQuality: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            settleMs: z.ZodOptional<z.ZodNumber>;
            showCursor: z.ZodOptional<z.ZodBoolean>;
            actions: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"wait">;
                durationMs: z.ZodNumber;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"click">;
                selector: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                button: z.ZodOptional<z.ZodEnum<{
                    left: "left";
                    right: "right";
                    middle: "middle";
                }>>;
                doubleClick: z.ZodOptional<z.ZodBoolean>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"type">;
                selector: z.ZodString;
                text: z.ZodString;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"hover">;
                selector: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"move">;
                x: z.ZodNumber;
                y: z.ZodNumber;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"scroll">;
                deltaX: z.ZodOptional<z.ZodNumber>;
                deltaY: z.ZodNumber;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"scrollTo">;
                selector: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"wheel">;
                deltaX: z.ZodOptional<z.ZodNumber>;
                deltaY: z.ZodNumber;
                times: z.ZodOptional<z.ZodNumber>;
                intervalMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"drag">;
                path: z.ZodArray<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"waitFor">;
                selector: z.ZodString;
                state: z.ZodOptional<z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                    attached: "attached";
                    detached: "detached";
                }>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>], "type">>>;
        }, z.core.$strict>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"recordingStatus">;
        recordingId: z.ZodString;
        outputPath: z.ZodOptional<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"recordingCancel">;
        recordingId: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"activateTab">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"newTab">;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"listUserTabs">;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"claimTab">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"finalizeTabs">;
        keep: z.ZodArray<z.ZodObject<{
            tabId: z.ZodString;
            status: z.ZodEnum<{
                handoff: "handoff";
                deliverable: "deliverable";
            }>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"markDeliverable">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"markHandoff">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"nameSession">;
        name: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"finalize">;
        tabId: z.ZodOptional<z.ZodString>;
        deliverable: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"turnEnded">;
        turnId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"closeSession">;
        closeTabs: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cancelRequest">;
        requestId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"close">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"list">;
    }, z.core.$strict>], "method">;
}, z.core.$strip>;
export declare const hostLocalMediaPreviewPathAuthorizeRequestResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"local-media-preview-path-authorize-request">;
    requestId: z.ZodString;
    path: z.ZodString;
}, z.core.$strict>;
/** host → main：登记已校验的插件 UI HTML。 */
export declare const hostPluginSandboxRegisterRequestResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"plugin-sandbox-register-request">;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    requestId: z.ZodString;
    workspacePath: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    ownerWebContentsId: z.ZodNumber;
    sessionId: z.ZodString;
    contentKind: z.ZodOptional<z.ZodLiteral<"gen-ui">>;
    pluginId: z.ZodOptional<z.ZodString>;
    serverName: z.ZodOptional<z.ZodString>;
    scopeId: z.ZodString;
    html: z.ZodString;
    csp: z.ZodOptional<z.ZodObject<{
        connectDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        resourceDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        frameDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        baseUriDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    cspRelaxations: z.ZodOptional<z.ZodObject<{
        unsafeEval: z.ZodOptional<z.ZodBoolean>;
        wasmUnsafeEval: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        camera: "camera";
        microphone: "microphone";
        geolocation: "geolocation";
        clipboardWrite: "clipboardWrite";
    }>>>;
    prefersBorder: z.ZodOptional<z.ZodBoolean>;
    heightHint: z.ZodOptional<z.ZodNumber>;
    minFrameHeight: z.ZodOptional<z.ZodNumber>;
    showInline: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const networkObservationSchema: z.ZodObject<{
    transport: z.ZodEnum<{
        http: "http";
        websocket: "websocket";
        rpc: "rpc";
    }>;
    interface: z.ZodString;
    durationMs: z.ZodNumber;
    ok: z.ZodBoolean;
    statusCode: z.ZodOptional<z.ZodNumber>;
    errorKind: z.ZodOptional<z.ZodString>;
    attempt: z.ZodOptional<z.ZodNumber>;
    dnsMs: z.ZodOptional<z.ZodNumber>;
    tcpMs: z.ZodOptional<z.ZodNumber>;
    tlsMs: z.ZodOptional<z.ZodNumber>;
    ttfbMs: z.ZodOptional<z.ZodNumber>;
    downloadMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const hostNetworkTelemetryBatchResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"network-telemetry-batch">;
    observations: z.ZodArray<z.ZodObject<{
        transport: z.ZodEnum<{
            http: "http";
            websocket: "websocket";
            rpc: "rpc";
        }>;
        interface: z.ZodString;
        durationMs: z.ZodNumber;
        ok: z.ZodBoolean;
        statusCode: z.ZodOptional<z.ZodNumber>;
        errorKind: z.ZodOptional<z.ZodString>;
        attempt: z.ZodOptional<z.ZodNumber>;
        dnsMs: z.ZodOptional<z.ZodNumber>;
        tcpMs: z.ZodOptional<z.ZodNumber>;
        tlsMs: z.ZodOptional<z.ZodNumber>;
        ttfbMs: z.ZodOptional<z.ZodNumber>;
        downloadMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const hostProviderProvisioningSourceChangedResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"provider-provisioning-source-changed">;
    trigger: z.ZodEnum<{
        "personal-config": "personal-config";
        "configured-default": "configured-default";
        "account-settings": "account-settings";
        credential: "credential";
    }>;
}, z.core.$strict>;
export declare const hostProviderProvisioningExecutionResultResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"provider-provisioning-execution-result">;
    requestId: z.ZodString;
    environmentKey: z.ZodString;
    status: z.ZodEnum<{
        failed: "failed";
        applied: "applied";
        unsupported: "unsupported";
        "already-applied": "already-applied";
        rollback_failed: "rollback_failed";
    }>;
    error: z.ZodOptional<z.ZodString>;
    errorCode: z.ZodOptional<z.ZodEnum<{
        "source-read-failed": "source-read-failed";
        "target-call-failed": "target-call-failed";
        "target-write-failed": "target-write-failed";
        "target-refresh-failed": "target-refresh-failed";
        "target-commit-failed": "target-commit-failed";
        "target-apply-failed": "target-apply-failed";
        "capability-unavailable": "capability-unavailable";
        "session-unavailable": "session-unavailable";
        "host-execution-failed": "host-execution-failed";
    }>>;
}, z.core.$strict>;
export declare const hostResourceUsageProcessSchema: z.ZodObject<{
    pid: z.ZodNumber;
    name: z.ZodString;
    category: z.ZodEnum<{
        base: "base";
        "builtin-plugin": "builtin-plugin";
        "community-plugin": "community-plugin";
    }>;
    groupKey: z.ZodString;
    groupLabel: z.ZodString;
    cpuPercent: z.ZodNumber;
    memoryBytes: z.ZodNumber;
}, z.core.$strict>;
export declare const hostResourceUsageSnapshotResultResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"resource-usage-snapshot-result">;
    requestId: z.ZodString;
    sampledAt: z.ZodNumber;
    processes: z.ZodArray<z.ZodObject<{
        pid: z.ZodNumber;
        name: z.ZodString;
        category: z.ZodEnum<{
            base: "base";
            "builtin-plugin": "builtin-plugin";
            "community-plugin": "community-plugin";
        }>;
        groupKey: z.ZodString;
        groupLabel: z.ZodString;
        cpuPercent: z.ZodNumber;
        memoryBytes: z.ZodNumber;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type HostResourceUsageSnapshotResultResponse = z.infer<typeof hostResourceUsageSnapshotResultResponseSchema>;
export declare const hostResponseMessageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"network-capture-batch">;
    batch: z.ZodObject<{
        captureId: z.ZodString;
        records: z.ZodArray<z.ZodObject<{
            timestamp: z.ZodNumber;
            processType: z.ZodEnum<{
                main: "main";
                renderer: "renderer";
                host: "host";
                cli: "cli";
            }>;
            pid: z.ZodNumber;
            method: z.ZodString;
            url: z.ZodString;
        }, z.core.$strict>>;
        dropped: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"database-startup-state">;
    state: z.ZodObject<{
        disk: z.ZodArray<z.ZodObject<{
            scopeId: z.ZodString;
            observedAvailableDropPeakBytes: z.ZodNullable<z.ZodNumber>;
            minAvailableBytes: z.ZodNullable<z.ZodNumber>;
            quality: z.ZodEnum<{
                complete: "complete";
                unknown: "unknown";
                partial: "partial";
            }>;
            sampledAt: z.ZodNullable<z.ZodNumber>;
        }, z.core.$strict>>;
        sqliteCode: z.ZodOptional<z.ZodNumber>;
        systemCode: z.ZodOptional<z.ZodString>;
        migrationId: z.ZodOptional<z.ZodString>;
        schemaVersion: z.ZodLiteral<1>;
        startupId: z.ZodString;
        attemptId: z.ZodString;
        sequence: z.ZodNumber;
        startedAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        phase: z.ZodEnum<{
            failed: "failed";
            starting: "starting";
            ready: "ready";
            preparing_host_storage: "preparing_host_storage";
            preparing_session_storage: "preparing_session_storage";
            starting_services: "starting_services";
        }>;
        databasePhase: z.ZodOptional<z.ZodEnum<{
            ready: "ready";
            checking: "checking";
            waiting_for_lock: "waiting_for_lock";
            migrating: "migrating";
            committing: "committing";
            maintaining: "maintaining";
        }>>;
        migration: z.ZodOptional<z.ZodObject<{
            kind: z.ZodEnum<{
                none: "none";
                initialize: "initialize";
                upgrade: "upgrade";
            }>;
            executedCount: z.ZodNumber;
            committedCount: z.ZodNumber;
            lastAppliedMigrationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>;
        currentMigration: z.ZodOptional<z.ZodObject<{
            kind: z.ZodEnum<{
                none: "none";
                initialize: "initialize";
                upgrade: "upgrade";
            }>;
            executedCount: z.ZodNumber;
            committedCount: z.ZodNumber;
            lastAppliedMigrationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>;
        migrationBaselines: z.ZodOptional<z.ZodArray<z.ZodObject<{
            databaseId: z.ZodString;
            databaseKind: z.ZodEnum<{
                session: "session";
                "tasks-index": "tasks-index";
            }>;
            lastAppliedMigrationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>>;
        finalDatabase: z.ZodOptional<z.ZodBoolean>;
        failedPhase: z.ZodOptional<z.ZodEnum<{
            failed: "failed";
            starting: "starting";
            ready: "ready";
            preparing_host_storage: "preparing_host_storage";
            preparing_session_storage: "preparing_session_storage";
            starting_services: "starting_services";
        }>>;
        errorCode: z.ZodOptional<z.ZodEnum<{
            storage_full: "storage_full";
            permission_denied: "permission_denied";
            io_error: "io_error";
            out_of_memory: "out_of_memory";
            corrupt: "corrupt";
            open_failed: "open_failed";
            lock_timeout: "lock_timeout";
            checksum_mismatch: "checksum_mismatch";
            sql_failed: "sql_failed";
            startup_status_timeout: "startup_status_timeout";
            transport_closed: "transport_closed";
            unsupported_runtime: "unsupported_runtime";
        }>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"resource-usage-snapshot-result">;
    requestId: z.ZodString;
    sampledAt: z.ZodNumber;
    processes: z.ZodArray<z.ZodObject<{
        pid: z.ZodNumber;
        name: z.ZodString;
        category: z.ZodEnum<{
            base: "base";
            "builtin-plugin": "builtin-plugin";
            "community-plugin": "community-plugin";
        }>;
        groupKey: z.ZodString;
        groupLabel: z.ZodString;
        cpuPercent: z.ZodNumber;
        memoryBytes: z.ZodNumber;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"remote-workspace-connection-log">;
    requestId: z.ZodString;
    level: z.ZodEnum<{
        error: "error";
        info: "info";
        warn: "warn";
    }>;
    message: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"remote-workspace-connected">;
    requestId: z.ZodString;
    descriptor: z.ZodObject<{
        remoteSessionId: z.ZodString;
        target: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"ssh">;
            host: z.ZodString;
            port: z.ZodOptional<z.ZodNumber>;
            username: z.ZodString;
            sshConfigAlias: z.ZodOptional<z.ZodString>;
            password: z.ZodOptional<z.ZodString>;
            privateKeyPath: z.ZodOptional<z.ZodString>;
            privateKeyPassphrase: z.ZodOptional<z.ZodString>;
            assetInstallMode: z.ZodOptional<z.ZodEnum<{
                "local-download-upload": "local-download-upload";
                "remote-download": "remote-download";
            }>>;
            resourcePackages: z.ZodOptional<z.ZodObject<{
                selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"wsl">;
            distro: z.ZodOptional<z.ZodString>;
            user: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"docker">;
            container: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"server">;
            url: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            token: z.ZodOptional<z.ZodString>;
            workspacePath: z.ZodOptional<z.ZodString>;
            serverId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>], "kind">;
        workspacePath: z.ZodOptional<z.ZodString>;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        generation: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"remote-workspace-connect-failed">;
    requestId: z.ZodString;
    error: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"remote-workspace-closed">;
    remoteSessionId: z.ZodString;
    reason: z.ZodEnum<{
        "connection-closed": "connection-closed";
        disposed: "disposed";
        "connect-cancelled": "connect-cancelled";
    }>;
    exitCode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"log">;
    level: z.ZodEnum<{
        error: "error";
        info: "info";
        warn: "warn";
    }>;
    source: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"agent-process-spawned">;
    lane: z.ZodOptional<z.ZodString>;
    pid: z.ZodNumber;
    provider: z.ZodEnum<{
        glm: "glm";
    }>;
    workspacePath: z.ZodString;
    command: z.ZodString;
    args: z.ZodArray<z.ZodString>;
    startedAt: z.ZodNumber;
    runtimeGeneration: z.ZodOptional<z.ZodNumber>;
    runtimeInstanceId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"agent-process-ready">;
    lane: z.ZodOptional<z.ZodString>;
    pid: z.ZodNumber;
    provider: z.ZodEnum<{
        glm: "glm";
    }>;
    workspacePath: z.ZodString;
    readyAt: z.ZodNumber;
    startupDurationMs: z.ZodNumber;
    runtimeGeneration: z.ZodNumber;
    runtimeInstanceId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"agent-process-exited">;
    lane: z.ZodOptional<z.ZodString>;
    pid: z.ZodNumber;
    provider: z.ZodEnum<{
        glm: "glm";
    }>;
    workspacePath: z.ZodString;
    exitCode: z.ZodNullable<z.ZodNumber>;
    signal: z.ZodNullable<z.ZodString>;
    endedAt: z.ZodNumber;
    terminationKind: z.ZodEnum<{
        expected: "expected";
        unexpected: "unexpected";
        watchdog_recycle: "watchdog_recycle";
    }>;
    terminationReason: z.ZodOptional<z.ZodString>;
    runtimeReady: z.ZodOptional<z.ZodBoolean>;
    runtimeGeneration: z.ZodNumber;
    runtimeInstanceId: z.ZodOptional<z.ZodString>;
    uptimeMs: z.ZodNumber;
    stderrLineCount: z.ZodNumber;
    stderrTail: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"agent-process-error">;
    lane: z.ZodOptional<z.ZodString>;
    pid: z.ZodNullable<z.ZodNumber>;
    provider: z.ZodEnum<{
        glm: "glm";
    }>;
    workspacePath: z.ZodString;
    command: z.ZodString;
    args: z.ZodArray<z.ZodString>;
    errorName: z.ZodString;
    errorCode: z.ZodOptional<z.ZodString>;
    errorMessage: z.ZodString;
    errorStack: z.ZodOptional<z.ZodString>;
    runtimeGeneration: z.ZodNumber;
    runtimeInstanceId: z.ZodOptional<z.ZodString>;
    occurredAt: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"agent-process-exception">;
    lane: z.ZodOptional<z.ZodString>;
    pid: z.ZodNumber;
    provider: z.ZodEnum<{
        glm: "glm";
    }>;
    workspacePath: z.ZodString;
    runtimeGeneration: z.ZodNumber;
    runtimeInstanceId: z.ZodString;
    diagnostic: z.ZodObject<{
        version: z.ZodLiteral<1>;
        errorId: z.ZodUUID;
        kind: z.ZodEnum<{
            uncaughtException: "uncaughtException";
            unhandledRejection: "unhandledRejection";
        }>;
        origin: z.ZodEnum<{
            uncaughtException: "uncaughtException";
            unhandledRejection: "unhandledRejection";
        }>;
        name: z.ZodString;
        message: z.ZodString;
        stack: z.ZodOptional<z.ZodString>;
        occurredAt: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"agent-resource-sample">;
    runtimeSurface: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    environmentKey: z.ZodOptional<z.ZodString>;
    sample: z.ZodObject<{
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        logicalCpuCount: z.ZodNumber;
        intervalMs: z.ZodNumber;
        cpuCores: z.ZodNumber;
        cpuPercent: z.ZodNumber;
        rssKb: z.ZodNumber;
        heapUsedKb: z.ZodOptional<z.ZodNumber>;
        uptimeMinutes: z.ZodOptional<z.ZodNumber>;
        totalMemoryGb: z.ZodOptional<z.ZodNumber>;
        instanceToken: z.ZodOptional<z.ZodString>;
        lane: z.ZodOptional<z.ZodEnum<{
            plugin: "plugin";
            chat: "chat";
            "mcp-status": "mcp-status";
        }>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"host-resource-sample">;
    sample: z.ZodObject<{
        cpuPercent: z.ZodNumber;
        rssKb: z.ZodNumber;
        heapUsedKb: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"mcp-telemetry">;
    runtimeSurface: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    event: z.ZodDiscriminatedUnion<[z.ZodObject<{
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        occurredAt: z.ZodNumber;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        mcpId: z.ZodString;
        mcpInstanceId: z.ZodString;
        mcpIsolation: z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>;
        mcpSource: z.ZodEnum<{
            custom: "custom";
            plugin: "plugin";
            builtin: "builtin";
        }>;
        kind: z.ZodLiteral<"process_start">;
    }, z.core.$strict>, z.ZodObject<{
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        occurredAt: z.ZodNumber;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        affectedSessionCount: z.ZodNumber;
        exitCode: z.ZodNullable<z.ZodNumber>;
        signal: z.ZodNullable<z.ZodString>;
        uptimeMs: z.ZodNumber;
        mcpId: z.ZodString;
        mcpInstanceId: z.ZodString;
        mcpIsolation: z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>;
        mcpSource: z.ZodEnum<{
            custom: "custom";
            plugin: "plugin";
            builtin: "builtin";
        }>;
        kind: z.ZodLiteral<"process_crash">;
    }, z.core.$strict>, z.ZodObject<{
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        occurredAt: z.ZodNumber;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        kind: z.ZodLiteral<"session_startup">;
        configuredCount: z.ZodNumber;
        connectedCount: z.ZodNumber;
        failedCount: z.ZodNumber;
        processCount: z.ZodNumber;
        sessionId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        occurredAt: z.ZodNumber;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        memoryKb: z.ZodNumber;
        memoryScope: z.ZodEnum<{
            process_tree: "process_tree";
            direct_process: "direct_process";
        }>;
        orphanSuspected: z.ZodBoolean;
        ownerSessionCount: z.ZodNumber;
        unownedSeconds: z.ZodNumber;
        mcpId: z.ZodString;
        mcpInstanceId: z.ZodString;
        mcpIsolation: z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>;
        mcpSource: z.ZodEnum<{
            custom: "custom";
            plugin: "plugin";
            builtin: "builtin";
        }>;
        kind: z.ZodLiteral<"memory">;
    }, z.core.$strict>], "kind">;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"mcp-resource-samples">;
    runtimeSurface: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    environmentKey: z.ZodOptional<z.ZodString>;
    samples: z.ZodArray<z.ZodObject<{
        mcpId: z.ZodString;
        instanceToken: z.ZodString;
        sampledAt: z.ZodNumber;
        intervalMs: z.ZodNumber;
        processCount: z.ZodNumber;
        rssKbTotal: z.ZodNumber;
        rssKbMaxProcess: z.ZodNumber;
        cpuTimeMsDelta: z.ZodNumber;
        uptimeMinutes: z.ZodNumber;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        arch: z.ZodEnum<{
            arm: "arm";
            arm64: "arm64";
            ia32: "ia32";
            loong64: "loong64";
            mips: "mips";
            mipsel: "mipsel";
            ppc: "ppc";
            ppc64: "ppc64";
            riscv64: "riscv64";
            s390: "s390";
            s390x: "s390x";
            x64: "x64";
        }>;
        logicalCpuCount: z.ZodNumber;
        totalMemoryGb: z.ZodNumber;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"tool-exec-resource">;
    runtimeSurface: z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>;
    sample: z.ZodObject<{
        completionToken: z.ZodOptional<z.ZodString>;
        platform: z.ZodEnum<{
            darwin: "darwin";
            aix: "aix";
            android: "android";
            freebsd: "freebsd";
            haiku: "haiku";
            linux: "linux";
            netbsd: "netbsd";
            openbsd: "openbsd";
            sunos: "sunos";
            win32: "win32";
            cygwin: "cygwin";
        }>;
        toolName: z.ZodLiteral<"bash">;
        durationMs: z.ZodNumber;
        exitKind: z.ZodEnum<{
            completed: "completed";
            killed: "killed";
            error: "error";
            timeout: "timeout";
        }>;
        treeRssKbPeak: z.ZodOptional<z.ZodNumber>;
        treeCpuTimeMs: z.ZodOptional<z.ZodNumber>;
        sampleCount: z.ZodNumber;
        cliRssKb: z.ZodNumber;
        systemFreeMemoryKb: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"session-create-telemetry">;
    event: z.ZodObject<{
        elementName: z.ZodLiteral<"session_create">;
        eventRegion: z.ZodLiteral<"app">;
        eventType: z.ZodLiteral<"result">;
        talkId: z.ZodString;
        messageId: z.ZodString;
        context: z.ZodObject<{
            clientTimezone: z.ZodString;
            clientLanguage: z.ZodString;
            screenResolution: z.ZodString;
        }, z.core.$strict>;
        eventExtraDetail: z.ZodObject<{
            workspace_kind: z.ZodEnum<{
                local: "local";
                remote: "remote";
            }>;
            remote_kind: z.ZodEnum<{
                "": "";
                ssh: "ssh";
                wsl: "wsl";
                docker: "docker";
                server: "server";
            }>;
            create_source: z.ZodEnum<{
                automation_idle: "automation_idle";
                automation_scheduled: "automation_scheduled";
            }>;
            client_kind: z.ZodLiteral<"desktop">;
        }, z.core.$strict>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"agent-running-task-count-changed">;
    runningTaskCount: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"workspace-running-task-count-changed">;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    runningTaskCount: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"cua-operation-state">;
    active: z.ZodBoolean;
    sessionId: z.ZodString;
    turnId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"broadcast">;
    message: z.ZodObject<{
        channel: z.ZodString;
        payload: z.ZodUnknown;
        sourceWindowId: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-request">;
    requestId: z.ZodString;
    key: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-commit">;
    key: z.ZodString;
    claimToken: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"broadcast-claim-release">;
    key: z.ZodString;
    claimToken: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"task-realtime-publish">;
    event: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"task-stream-op-publish">;
    target: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
        taskId: z.ZodString;
        runId: z.ZodString;
        traceId: z.ZodString;
        ownerClientId: z.ZodOptional<z.ZodString>;
        ownerDeviceLabel: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    op: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"task-run-lease-acquire">;
    request: z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"task-run-lease-release">;
    target: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
        taskId: z.ZodString;
        runId: z.ZodString;
        traceId: z.ZodString;
        ownerClientId: z.ZodOptional<z.ZodString>;
        ownerDeviceLabel: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"task-owner-command-request">;
    command: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"task-owner-command-result">;
    result: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-reconnect-request">;
    requestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"ssh">;
        host: z.ZodString;
        port: z.ZodOptional<z.ZodNumber>;
        username: z.ZodString;
        sshConfigAlias: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        privateKeyPath: z.ZodOptional<z.ZodString>;
        privateKeyPassphrase: z.ZodOptional<z.ZodString>;
        assetInstallMode: z.ZodOptional<z.ZodEnum<{
            "local-download-upload": "local-download-upload";
            "remote-download": "remote-download";
        }>>;
        resourcePackages: z.ZodOptional<z.ZodObject<{
            selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"wsl">;
        distro: z.ZodOptional<z.ZodString>;
        user: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"docker">;
        container: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"server">;
        url: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodOptional<z.ZodString>;
        serverId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-connection-status-request">;
    requestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"ssh">;
        host: z.ZodString;
        port: z.ZodOptional<z.ZodNumber>;
        username: z.ZodString;
        sshConfigAlias: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        privateKeyPath: z.ZodOptional<z.ZodString>;
        privateKeyPassphrase: z.ZodOptional<z.ZodString>;
        assetInstallMode: z.ZodOptional<z.ZodEnum<{
            "local-download-upload": "local-download-upload";
            "remote-download": "remote-download";
        }>>;
        resourcePackages: z.ZodOptional<z.ZodObject<{
            selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"wsl">;
        distro: z.ZodOptional<z.ZodString>;
        user: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"docker">;
        container: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"server">;
        url: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodOptional<z.ZodString>;
        serverId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"bot-remote-workspace-runtime-port-request">;
    requestId: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"ssh">;
        host: z.ZodString;
        port: z.ZodOptional<z.ZodNumber>;
        username: z.ZodString;
        sshConfigAlias: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        privateKeyPath: z.ZodOptional<z.ZodString>;
        privateKeyPassphrase: z.ZodOptional<z.ZodString>;
        assetInstallMode: z.ZodOptional<z.ZodEnum<{
            "local-download-upload": "local-download-upload";
            "remote-download": "remote-download";
        }>>;
        resourcePackages: z.ZodOptional<z.ZodObject<{
            selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"wsl">;
        distro: z.ZodOptional<z.ZodString>;
        user: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"docker">;
        container: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"server">;
        url: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodOptional<z.ZodString>;
        serverId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"session-message-send-requested">;
    request: z.ZodObject<{
        content: z.ZodString;
        createdAt: z.ZodString;
        fromSessionId: z.ZodString;
        messageId: z.ZodString;
        requestId: z.ZodString;
        toSessionId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"session-route-announce">;
    route: z.ZodObject<{
        sessionId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"session-message-deliver-result">;
    result: z.ZodObject<{
        error: z.ZodOptional<z.ZodString>;
        messageId: z.ZodString;
        requestId: z.ZodString;
        sessionId: z.ZodString;
        status: z.ZodEnum<{
            failed: "failed";
            success: "success";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"feedback-log-archive-request">;
    requestId: z.ZodString;
    sourceDir: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"browser-execute-request">;
    requestId: z.ZodString;
    browserId: z.ZodOptional<z.ZodString>;
    browserGeneration: z.ZodOptional<z.ZodNumber>;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodOptional<z.ZodString>;
    workspacePath: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    clientMode: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    sessionContext: z.ZodOptional<z.ZodEnum<{
        cached: "cached";
        live: "live";
    }>>;
    command: z.ZodDiscriminatedUnion<[z.ZodObject<{
        method: z.ZodLiteral<"navigate">;
        url: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"back">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"forward">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"reload">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"snapshot">;
        maxElements: z.ZodOptional<z.ZodNumber>;
        includeHidden: z.ZodOptional<z.ZodBoolean>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"click">;
        ref: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        button: z.ZodOptional<z.ZodEnum<{
            left: "left";
            right: "right";
            middle: "middle";
        }>>;
        doubleClick: z.ZodOptional<z.ZodBoolean>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"fill">;
        ref: z.ZodString;
        value: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"type">;
        ref: z.ZodOptional<z.ZodString>;
        text: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"press">;
        key: z.ZodString;
        ref: z.ZodOptional<z.ZodString>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cuaKeypress">;
        keys: z.ZodArray<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"scroll">;
        ref: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cuaScroll">;
        x: z.ZodNumber;
        y: z.ZodNumber;
        scrollX: z.ZodNumber;
        scrollY: z.ZodNumber;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"domCuaScroll">;
        nodeId: z.ZodOptional<z.ZodString>;
        scrollX: z.ZodNumber;
        scrollY: z.ZodNumber;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"screenshot">;
        ref: z.ZodOptional<z.ZodString>;
        fullPage: z.ZodOptional<z.ZodBoolean>;
        clip: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"getState">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"hover">;
        ref: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"select">;
        ref: z.ZodString;
        values: z.ZodArray<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"check">;
        ref: z.ZodString;
        checked: z.ZodOptional<z.ZodBoolean>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"drag">;
        fromRef: z.ZodOptional<z.ZodString>;
        toRef: z.ZodOptional<z.ZodString>;
        from: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>>;
        to: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cuaDrag">;
        path: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"elementInfo">;
        x: z.ZodNumber;
        y: z.ZodNumber;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"evaluate">;
        expression: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"getDialog">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"handleDialog">;
        accept: z.ZodBoolean;
        promptText: z.ZodOptional<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"waitFor">;
        selector: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        textGone: z.ZodOptional<z.ZodString>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"playwrightWaitForTimeout">;
        timeoutMs: z.ZodNumber;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"playwright">;
        action: z.ZodDiscriminatedUnion<[z.ZodObject<{
            name: z.ZodLiteral<"domSnapshot">;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"elementInfo">;
            x: z.ZodNumber;
            y: z.ZodNumber;
            includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"elementScreenshot">;
            x: z.ZodNumber;
            y: z.ZodNumber;
            includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"evaluate">;
            expression: z.ZodString;
            expressionKind: z.ZodEnum<{
                string: "string";
                function: "function";
            }>;
            arg: z.ZodOptional<z.ZodUnknown>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"waitForLoadState">;
            state: z.ZodOptional<z.ZodEnum<{
                load: "load";
                domcontentloaded: "domcontentloaded";
                networkidle: "networkidle";
            }>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"waitForURL">;
            url: z.ZodString;
            waitUntil: z.ZodOptional<z.ZodEnum<{
                load: "load";
                domcontentloaded: "domcontentloaded";
                networkidle: "networkidle";
                commit: "commit";
            }>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"waitForEvent">;
            event: z.ZodEnum<{
                download: "download";
                filechooser: "filechooser";
            }>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"downloadPath">;
            downloadId: z.ZodString;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"fileChooserSetFiles">;
            fileChooserId: z.ZodString;
            files: z.ZodArray<z.ZodString>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"locator">;
            selector: z.ZodString;
            operation: z.ZodEnum<{
                fill: "fill";
                click: "click";
                press: "press";
                evaluate: "evaluate";
                waitFor: "waitFor";
                count: "count";
                allTextContents: "allTextContents";
                dblclick: "dblclick";
                downloadMedia: "downloadMedia";
                getAttribute: "getAttribute";
                innerText: "innerText";
                isEnabled: "isEnabled";
                isVisible: "isVisible";
                selectOption: "selectOption";
                setChecked: "setChecked";
                textContent: "textContent";
            }>;
            value: z.ZodOptional<z.ZodUnknown>;
            arg: z.ZodOptional<z.ZodUnknown>;
            expression: z.ZodOptional<z.ZodString>;
            expressionKind: z.ZodOptional<z.ZodEnum<{
                string: "string";
                function: "function";
            }>>;
            attribute: z.ZodOptional<z.ZodString>;
            checked: z.ZodOptional<z.ZodBoolean>;
            replace: z.ZodOptional<z.ZodBoolean>;
            force: z.ZodOptional<z.ZodBoolean>;
            button: z.ZodOptional<z.ZodEnum<{
                left: "left";
                right: "right";
                middle: "middle";
            }>>;
            modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                Alt: "Alt";
                Shift: "Shift";
                Control: "Control";
                ControlOrMeta: "ControlOrMeta";
                Meta: "Meta";
            }>>>;
            state: z.ZodOptional<z.ZodEnum<{
                visible: "visible";
                hidden: "hidden";
                attached: "attached";
                detached: "detached";
            }>>;
            selections: z.ZodOptional<z.ZodArray<z.ZodObject<{
                value: z.ZodOptional<z.ZodString>;
                label: z.ZodOptional<z.ZodString>;
                index: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>], "name">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"capabilities">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"browserVisibilityGet">;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"browserVisibilitySet">;
        visible: z.ZodBoolean;
    }, z.core.$strict>, z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        method: z.ZodLiteral<"browserViewportSet">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"browserViewportReset">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"recordingStart">;
        options: z.ZodOptional<z.ZodObject<{
            viewport: z.ZodOptional<z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>>;
            fps: z.ZodOptional<z.ZodNumber>;
            jpegQuality: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            settleMs: z.ZodOptional<z.ZodNumber>;
            showCursor: z.ZodOptional<z.ZodBoolean>;
            actions: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"wait">;
                durationMs: z.ZodNumber;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"click">;
                selector: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                button: z.ZodOptional<z.ZodEnum<{
                    left: "left";
                    right: "right";
                    middle: "middle";
                }>>;
                doubleClick: z.ZodOptional<z.ZodBoolean>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"type">;
                selector: z.ZodString;
                text: z.ZodString;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"hover">;
                selector: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"move">;
                x: z.ZodNumber;
                y: z.ZodNumber;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"scroll">;
                deltaX: z.ZodOptional<z.ZodNumber>;
                deltaY: z.ZodNumber;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"scrollTo">;
                selector: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"wheel">;
                deltaX: z.ZodOptional<z.ZodNumber>;
                deltaY: z.ZodNumber;
                times: z.ZodOptional<z.ZodNumber>;
                intervalMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"drag">;
                path: z.ZodArray<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"waitFor">;
                selector: z.ZodString;
                state: z.ZodOptional<z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                    attached: "attached";
                    detached: "detached";
                }>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>], "type">>>;
        }, z.core.$strict>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"recordingStatus">;
        recordingId: z.ZodString;
        outputPath: z.ZodOptional<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"recordingCancel">;
        recordingId: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"activateTab">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"newTab">;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"listUserTabs">;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"claimTab">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"finalizeTabs">;
        keep: z.ZodArray<z.ZodObject<{
            tabId: z.ZodString;
            status: z.ZodEnum<{
                handoff: "handoff";
                deliverable: "deliverable";
            }>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"markDeliverable">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"markHandoff">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"nameSession">;
        name: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"finalize">;
        tabId: z.ZodOptional<z.ZodString>;
        deliverable: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"turnEnded">;
        turnId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"closeSession">;
        closeTabs: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cancelRequest">;
        requestId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"close">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"list">;
    }, z.core.$strict>], "method">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"local-media-preview-path-authorize-request">;
    requestId: z.ZodString;
    path: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"plugin-sandbox-register-request">;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    requestId: z.ZodString;
    workspacePath: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    ownerWebContentsId: z.ZodNumber;
    sessionId: z.ZodString;
    contentKind: z.ZodOptional<z.ZodLiteral<"gen-ui">>;
    pluginId: z.ZodOptional<z.ZodString>;
    serverName: z.ZodOptional<z.ZodString>;
    scopeId: z.ZodString;
    html: z.ZodString;
    csp: z.ZodOptional<z.ZodObject<{
        connectDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        resourceDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        frameDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        baseUriDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    cspRelaxations: z.ZodOptional<z.ZodObject<{
        unsafeEval: z.ZodOptional<z.ZodBoolean>;
        wasmUnsafeEval: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        camera: "camera";
        microphone: "microphone";
        geolocation: "geolocation";
        clipboardWrite: "clipboardWrite";
    }>>>;
    prefersBorder: z.ZodOptional<z.ZodBoolean>;
    heightHint: z.ZodOptional<z.ZodNumber>;
    minFrameHeight: z.ZodOptional<z.ZodNumber>;
    showInline: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"network-telemetry-batch">;
    observations: z.ZodArray<z.ZodObject<{
        transport: z.ZodEnum<{
            http: "http";
            websocket: "websocket";
            rpc: "rpc";
        }>;
        interface: z.ZodString;
        durationMs: z.ZodNumber;
        ok: z.ZodBoolean;
        statusCode: z.ZodOptional<z.ZodNumber>;
        errorKind: z.ZodOptional<z.ZodString>;
        attempt: z.ZodOptional<z.ZodNumber>;
        dnsMs: z.ZodOptional<z.ZodNumber>;
        tcpMs: z.ZodOptional<z.ZodNumber>;
        tlsMs: z.ZodOptional<z.ZodNumber>;
        ttfbMs: z.ZodOptional<z.ZodNumber>;
        downloadMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"provider-provisioning-source-changed">;
    trigger: z.ZodEnum<{
        "personal-config": "personal-config";
        "configured-default": "configured-default";
        "account-settings": "account-settings";
        credential: "credential";
    }>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"provider-provisioning-execution-result">;
    requestId: z.ZodString;
    environmentKey: z.ZodString;
    status: z.ZodEnum<{
        failed: "failed";
        applied: "applied";
        unsupported: "unsupported";
        "already-applied": "already-applied";
        rollback_failed: "rollback_failed";
    }>;
    error: z.ZodOptional<z.ZodString>;
    errorCode: z.ZodOptional<z.ZodEnum<{
        "source-read-failed": "source-read-failed";
        "target-call-failed": "target-call-failed";
        "target-write-failed": "target-write-failed";
        "target-refresh-failed": "target-refresh-failed";
        "target-commit-failed": "target-commit-failed";
        "target-apply-failed": "target-apply-failed";
        "capability-unavailable": "capability-unavailable";
        "session-unavailable": "session-unavailable";
        "host-execution-failed": "host-execution-failed";
    }>>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"cron-run-result">;
    runId: z.ZodString;
    ok: z.ZodBoolean;
    taskId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    failureKind: z.ZodOptional<z.ZodEnum<{
        transient: "transient";
        permanent: "permanent";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"off-peak-run-result">;
    offPeakTaskId: z.ZodString;
    ok: z.ZodBoolean;
    conversationId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    failureKind: z.ZodOptional<z.ZodEnum<{
        transient: "transient";
        permanent: "permanent";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"cron-scheduler-wake-request">;
    automationId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"off-peak-scheduler-wake-request">;
    offPeakTaskId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "type">;
export declare const zcodeTaskPersistStatusSchema: z.ZodEnum<{
    running: "running";
    completed: "completed";
    error: "error";
}>;
export declare const zcodePromptImageAttachmentSchema: z.ZodObject<{
    kind: z.ZodLiteral<"image">;
    filename: z.ZodString;
    mimeType: z.ZodString;
    sizeBytes: z.ZodOptional<z.ZodNumber>;
    dataBase64: z.ZodOptional<z.ZodString>;
    localPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const zcodePromptVideoAttachmentSchema: z.ZodObject<{
    kind: z.ZodLiteral<"video">;
    filename: z.ZodString;
    mimeType: z.ZodString;
    sizeBytes: z.ZodOptional<z.ZodNumber>;
    dataBase64: z.ZodOptional<z.ZodString>;
    localPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const zcodePromptPdfAttachmentSchema: z.ZodObject<{
    kind: z.ZodLiteral<"pdf">;
    filename: z.ZodString;
    mimeType: z.ZodString;
    sizeBytes: z.ZodOptional<z.ZodNumber>;
    dataBase64: z.ZodOptional<z.ZodString>;
    localPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const zcodePromptFileAttachmentSchema: z.ZodObject<{
    kind: z.ZodLiteral<"file">;
    filename: z.ZodString;
    mimeType: z.ZodString;
    sizeBytes: z.ZodNumber;
    dataBase64: z.ZodOptional<z.ZodString>;
    textContent: z.ZodOptional<z.ZodString>;
    localPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const zcodePromptAttachmentSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"image">;
    filename: z.ZodString;
    mimeType: z.ZodString;
    sizeBytes: z.ZodOptional<z.ZodNumber>;
    dataBase64: z.ZodOptional<z.ZodString>;
    localPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"video">;
    filename: z.ZodString;
    mimeType: z.ZodString;
    sizeBytes: z.ZodOptional<z.ZodNumber>;
    dataBase64: z.ZodOptional<z.ZodString>;
    localPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"pdf">;
    filename: z.ZodString;
    mimeType: z.ZodString;
    sizeBytes: z.ZodOptional<z.ZodNumber>;
    dataBase64: z.ZodOptional<z.ZodString>;
    localPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"file">;
    filename: z.ZodString;
    mimeType: z.ZodString;
    sizeBytes: z.ZodNumber;
    dataBase64: z.ZodOptional<z.ZodString>;
    textContent: z.ZodOptional<z.ZodString>;
    localPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "kind">;
export declare const zcodePersistedToolCallSchema: z.ZodObject<{
    toolName: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    kind: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        completed: "completed";
        failed: "failed";
        stopped: "stopped";
        denied: "denied";
    }>>;
    input: z.ZodUnknown;
    output: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodString>;
    raw: z.ZodOptional<z.ZodUnknown>;
    snapshotRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodEnum<{
            output: "output";
            input: "input";
            raw: "raw";
        }>;
        refId: z.ZodString;
        hash: z.ZodString;
        fullBytes: z.ZodNumber;
        previewBytes: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const zcodePersistedMessageSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
    }>;
    content: z.ZodString;
    timestamp: z.ZodNumber;
    model: z.ZodOptional<z.ZodString>;
    characterCount: z.ZodOptional<z.ZodNumber>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    interrupted: z.ZodOptional<z.ZodBoolean>;
    feedback: z.ZodOptional<z.ZodEnum<{
        like: "like";
        dislike: "dislike";
    }>>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"image">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodNumber>;
        dataBase64: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"video">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodNumber>;
        dataBase64: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"pdf">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodOptional<z.ZodNumber>;
        dataBase64: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"file">;
        filename: z.ZodString;
        mimeType: z.ZodString;
        sizeBytes: z.ZodNumber;
        dataBase64: z.ZodOptional<z.ZodString>;
        textContent: z.ZodOptional<z.ZodString>;
        localPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">>>;
    tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
        toolName: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        kind: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            completed: "completed";
            failed: "failed";
            stopped: "stopped";
            denied: "denied";
        }>>;
        input: z.ZodUnknown;
        output: z.ZodOptional<z.ZodUnknown>;
        error: z.ZodOptional<z.ZodString>;
        raw: z.ZodOptional<z.ZodUnknown>;
        snapshotRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<{
                output: "output";
                input: "input";
                raw: "raw";
            }>;
            refId: z.ZodString;
            hash: z.ZodString;
            fullBytes: z.ZodNumber;
            previewBytes: z.ZodNumber;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    thought: z.ZodOptional<z.ZodString>;
    parts: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"content">;
        content: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"thought">;
        content: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"tool-call">;
        toolIndex: z.ZodNumber;
    }, z.core.$strip>], "type">>>;
    checkpointState: z.ZodOptional<z.ZodEnum<{
        partial: "partial";
    }>>;
    checkpointReason: z.ZodOptional<z.ZodEnum<{
        tool_completed: "tool_completed";
        part_boundary: "part_boundary";
        periodic: "periodic";
    }>>;
    checkpointUpdatedAt: z.ZodOptional<z.ZodNumber>;
    turnIndex: z.ZodOptional<z.ZodNumber>;
    bodyRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodEnum<{
            content: "content";
            thought: "thought";
        }>;
        refId: z.ZodString;
        hash: z.ZodString;
        fullBytes: z.ZodNumber;
        previewBytes: z.ZodNumber;
    }, z.core.$strip>>>;
    toolSlice: z.ZodOptional<z.ZodObject<{
        persistedMessageIndex: z.ZodNumber;
        totalTools: z.ZodNumber;
        startToolIndex: z.ZodNumber;
        endToolIndexExclusive: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const zcodeTaskGoalStatusSchema: z.ZodEnum<{
    active: "active";
    complete: "complete";
    paused: "paused";
    budget_limited: "budget_limited";
}>;
export declare const zcodeTaskTargetChangedActionSchema: z.ZodEnum<{
    set: "set";
    status_updated: "status_updated";
    cleared: "cleared";
    usage_accounted: "usage_accounted";
    run_started: "run_started";
    run_finished: "run_finished";
    summary_updated: "summary_updated";
}>;
export declare const zcodeTaskTargetChangedSourceSchema: z.ZodEnum<{
    command: "command";
    tool: "tool";
    runtime: "runtime";
}>;
export declare const zcodeTaskGoalSchema: z.ZodObject<{
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
}, z.core.$strip>;
export declare const zcodeTaskGoalChangedPatchSchema: z.ZodObject<{
    action: z.ZodEnum<{
        set: "set";
        status_updated: "status_updated";
        cleared: "cleared";
        usage_accounted: "usage_accounted";
        run_started: "run_started";
        run_finished: "run_finished";
        summary_updated: "summary_updated";
    }>;
    source: z.ZodEnum<{
        command: "command";
        tool: "tool";
        runtime: "runtime";
    }>;
    target: z.ZodNullable<z.ZodObject<{
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
    }, z.core.$strip>>;
    previousTarget: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
export declare const zcodeTaskTargetStatusSchema: z.ZodEnum<{
    active: "active";
    complete: "complete";
    paused: "paused";
    budget_limited: "budget_limited";
}>;
export declare const zcodeTaskTargetSchema: z.ZodObject<{
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
}, z.core.$strip>;
export declare const zcodeTaskTargetChangedPatchSchema: z.ZodObject<{
    action: z.ZodEnum<{
        set: "set";
        status_updated: "status_updated";
        cleared: "cleared";
        usage_accounted: "usage_accounted";
        run_started: "run_started";
        run_finished: "run_finished";
        summary_updated: "summary_updated";
    }>;
    source: z.ZodEnum<{
        command: "command";
        tool: "tool";
        runtime: "runtime";
    }>;
    target: z.ZodNullable<z.ZodObject<{
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
    }, z.core.$strip>>;
    previousTarget: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
export declare const zcodeTaskMetaSchema: z.ZodObject<{
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
export declare const zcodeTaskSessionBindingStateSchema: z.ZodEnum<{
    failed: "failed";
    stale: "stale";
    idle: "idle";
    ready: "ready";
    syncing: "syncing";
}>;
export declare const zcodeTaskSessionBindingSchema: z.ZodObject<{
    provider: z.ZodPipe<z.ZodEnum<{
        claude: "claude";
        glm: "glm";
        opencode: "opencode";
        gemini: "gemini";
        codex: "codex";
    }>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>;
    sessionId: z.ZodString;
    lastSyncedTurnIndex: z.ZodNumber;
    state: z.ZodEnum<{
        failed: "failed";
        stale: "stale";
        idle: "idle";
        ready: "ready";
        syncing: "syncing";
    }>;
}, z.core.$strip>;
export declare const zcodeTaskIndexEntrySchema: z.ZodObject<{
    workspaceHash: z.ZodString;
    taskId: z.ZodString;
}, z.core.$strip>;
export declare const zcodePinnedTasksFileSchema: z.ZodObject<{
    version: z.ZodLiteral<"1">;
    tasks: z.ZodArray<z.ZodObject<{
        workspaceHash: z.ZodString;
        taskId: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const zcodeSessionFileSchema: z.ZodObject<{
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
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
        }>;
        content: z.ZodString;
        timestamp: z.ZodNumber;
        model: z.ZodOptional<z.ZodString>;
        characterCount: z.ZodOptional<z.ZodNumber>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        interrupted: z.ZodOptional<z.ZodBoolean>;
        feedback: z.ZodOptional<z.ZodEnum<{
            like: "like";
            dislike: "dislike";
        }>>;
        attachments: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"image">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"video">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"pdf">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            dataBase64: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"file">;
            filename: z.ZodString;
            mimeType: z.ZodString;
            sizeBytes: z.ZodNumber;
            dataBase64: z.ZodOptional<z.ZodString>;
            textContent: z.ZodOptional<z.ZodString>;
            localPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>], "kind">>>;
        tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
            toolName: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            kind: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                completed: "completed";
                failed: "failed";
                stopped: "stopped";
                denied: "denied";
            }>>;
            input: z.ZodUnknown;
            output: z.ZodOptional<z.ZodUnknown>;
            error: z.ZodOptional<z.ZodString>;
            raw: z.ZodOptional<z.ZodUnknown>;
            snapshotRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                field: z.ZodEnum<{
                    output: "output";
                    input: "input";
                    raw: "raw";
                }>;
                refId: z.ZodString;
                hash: z.ZodString;
                fullBytes: z.ZodNumber;
                previewBytes: z.ZodNumber;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
        thought: z.ZodOptional<z.ZodString>;
        parts: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"content">;
            content: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"thought">;
            content: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"tool-call">;
            toolIndex: z.ZodNumber;
        }, z.core.$strip>], "type">>>;
        checkpointState: z.ZodOptional<z.ZodEnum<{
            partial: "partial";
        }>>;
        checkpointReason: z.ZodOptional<z.ZodEnum<{
            tool_completed: "tool_completed";
            part_boundary: "part_boundary";
            periodic: "periodic";
        }>>;
        checkpointUpdatedAt: z.ZodOptional<z.ZodNumber>;
        turnIndex: z.ZodOptional<z.ZodNumber>;
        bodyRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<{
                content: "content";
                thought: "thought";
            }>;
            refId: z.ZodString;
            hash: z.ZodString;
            fullBytes: z.ZodNumber;
            previewBytes: z.ZodNumber;
        }, z.core.$strip>>>;
        toolSlice: z.ZodOptional<z.ZodObject<{
            persistedMessageIndex: z.ZodNumber;
            totalTools: z.ZodNumber;
            startToolIndex: z.ZodNumber;
            endToolIndexExclusive: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    fileChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
        turnIndex: z.ZodNumber;
        snapshots: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            beforeContent: z.ZodNullable<z.ZodString>;
            afterContent: z.ZodString;
            writeCount: z.ZodNumber;
            contentRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                field: z.ZodEnum<{
                    beforeContent: "beforeContent";
                    afterContent: "afterContent";
                }>;
                refId: z.ZodString;
                hash: z.ZodString;
                fullBytes: z.ZodNumber;
                previewBytes: z.ZodNumber;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
        fileState: z.ZodOptional<z.ZodEnum<{
            reverted: "reverted";
            applied: "applied";
        }>>;
    }, z.core.$strip>>>;
    turnCheckpoints: z.ZodOptional<z.ZodArray<z.ZodObject<{
        turnIndex: z.ZodNumber;
        baseFileCheckpointId: z.ZodString;
        resultFileCheckpointId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
//# sourceMappingURL=validation.d.ts.map