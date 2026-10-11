import { z } from "zod";
export declare const zcodeDeliveryKindSchema: z.ZodEnum<{
    "desktop-continuous": "desktop-continuous";
    "web-remote-replayable": "web-remote-replayable";
}>;
export declare const zcodeMessageVisibilitySchema: z.ZodEnum<{
    "user-visible": "user-visible";
    "model-only": "model-only";
}>;
export declare const zcodeSyntheticUserMessageSourceSchema: z.ZodEnum<{
    subagent: "subagent";
    agent_listing_delta: "agent_listing_delta";
    background_task: "background_task";
    fork: "fork";
    goal_state_change: "goal_state_change";
    "goal-continuation": "goal-continuation";
    plugin_reference: "plugin_reference";
    bot_topic_context: "bot_topic_context";
    rewind: "rewind";
    selection_side_chat: "selection_side_chat";
    subagent_message: "subagent_message";
    todo_reminder: "todo_reminder";
    workflow_launch: "workflow_launch";
    shared_context: "shared_context";
}>;
export declare const zcodeWorkspaceRefSchema: z.ZodObject<{
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
}, z.core.$strict>;
export declare const zcodePermissionDecisionSchema: z.ZodEnum<{
    allow: "allow";
    deny: "deny";
    escalate: "escalate";
    modify: "modify";
}>;
export declare const zcodePermissionRuleBehaviorSchema: z.ZodEnum<{
    ask: "ask";
    allow: "allow";
    deny: "deny";
}>;
/** Backward-compatible wire/storage key interpreted only for trusted official CUA tools. */
export declare const OFFICIAL_CUA_PERMISSION_RULE_TOOL_NAME = "zcode:permission-capability:official_cua";
/**
 * workflow 运行确认窗第三选项「Refine」（拒绝并附修改意见）的稳定 optionId。
 * CLI 侧 v4 投影合成选项、broker 应答映射与 GUI 特判共用同一常量；
 * 该选项只在 v4 链路投放。
 */
export declare const WORKFLOW_REFINE_PERMISSION_OPTION_ID = "workflowRefine";
export declare const zcodePermissionRuleValueSchema: z.ZodObject<{
    toolName: z.ZodString;
    ruleContent: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodePermissionUpdateSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const zcodePermissionResponseSchema: z.ZodObject<{
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
export type ZCodePermissionResponse = z.infer<typeof zcodePermissionResponseSchema>;
export declare const zcodeSessionModeSchema: z.ZodEnum<{
    plan: "plan";
    build: "build";
    edit: "edit";
    yolo: "yolo";
    guarded: "guarded";
    auto: "auto";
}>;
export declare const zcodeSessionStatusSchema: z.ZodEnum<{
    running: "running";
    completed: "completed";
    error: "error";
    idle: "idle";
    waiting: "waiting";
    paused: "paused";
}>;
export declare const zcodeSessionKindSchema: z.ZodEnum<{
    fork: "fork";
    selection_side_chat: "selection_side_chat";
    interactive: "interactive";
    workflow_parent: "workflow_parent";
    workflow_child: "workflow_child";
    subagent_child: "subagent_child";
    nested_workflow_child: "nested_workflow_child";
}>;
export declare const zcodeSessionGoalSchema: z.ZodObject<{
    sessionId: z.ZodString;
    targetId: z.ZodString;
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
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strict>;
export declare const zcodeSessionGoalVerificationSchema: z.ZodObject<{
    nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    passed: z.ZodBoolean;
    reason: z.ZodString;
}, z.core.$strict>;
export declare const zcodeSessionGoalVerificationTimelineSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    kind: z.ZodLiteral<"synthetic">;
    type: z.ZodLiteral<"goal_verification">;
    display: z.ZodLiteral<"separator">;
    targetId: z.ZodString;
    verificationId: z.ZodString;
    status: z.ZodEnum<{
        completed: "completed";
        started: "started";
        cancelled: "cancelled";
        failed_closed: "failed_closed";
    }>;
    verification: z.ZodOptional<z.ZodObject<{
        nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        passed: z.ZodBoolean;
        reason: z.ZodString;
    }, z.core.$strict>>;
    goalIteration: z.ZodOptional<z.ZodNumber>;
    anchorAssistantMessageId: z.ZodOptional<z.ZodString>;
    anchorTurnId: z.ZodOptional<z.ZodString>;
    startedAt: z.ZodOptional<z.ZodNumber>;
    updatedAt: z.ZodNumber;
}, z.core.$strict>;
export declare const zcodeSessionInfoSchema: z.ZodObject<{
    sessionId: z.ZodString;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    parentSessionId: z.ZodOptional<z.ZodString>;
    traceId: z.ZodOptional<z.ZodString>;
    sessionKind: z.ZodEnum<{
        fork: "fork";
        selection_side_chat: "selection_side_chat";
        interactive: "interactive";
        workflow_parent: "workflow_parent";
        workflow_child: "workflow_child";
        subagent_child: "subagent_child";
        nested_workflow_child: "nested_workflow_child";
    }>;
    title: z.ZodString;
    titleSource: z.ZodOptional<z.ZodEnum<{
        default: "default";
        custom: "custom";
        first_input: "first_input";
        generated: "generated";
    }>>;
    mode: z.ZodEnum<{
        plan: "plan";
        build: "build";
        edit: "edit";
        yolo: "yolo";
        guarded: "guarded";
        auto: "auto";
    }>;
    status: z.ZodEnum<{
        running: "running";
        completed: "completed";
        error: "error";
        idle: "idle";
        waiting: "waiting";
        paused: "paused";
    }>;
    model: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        sessionId: z.ZodString;
        targetId: z.ZodString;
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
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
    }, z.core.$strict>>>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    archivedAt: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeSessionInfo = z.infer<typeof zcodeSessionInfoSchema>;
export declare const zcodeInteractionRequestOriginSchema: z.ZodObject<{
    kind: z.ZodLiteral<"subagent">;
    agentId: z.ZodString;
    agentType: z.ZodString;
    childSessionId: z.ZodString;
    childTurnId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    parentSessionId: z.ZodString;
    parentToolCallId: z.ZodOptional<z.ZodString>;
    parentTurnId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeInteractionRequestOrigin = z.infer<typeof zcodeInteractionRequestOriginSchema>;
export declare const zcodeTokenUsageSchema: z.ZodObject<{
    total: z.ZodOptional<z.ZodNumber>;
    input: z.ZodNumber;
    output: z.ZodNumber;
    reasoning: z.ZodNumber;
    cache: z.ZodObject<{
        read: z.ZodNumber;
        write: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const zcodeMessageSemanticsSchema: z.ZodObject<{
    origin: z.ZodEnum<{
        real_user: "real_user";
        agent_runtime: "agent_runtime";
        system: "system";
        migration: "migration";
        import: "import";
    }>;
    kind: z.ZodEnum<{
        todo_reminder: "todo_reminder";
        shared_context: "shared_context";
        user_prompt: "user_prompt";
        slash_command: "slash_command";
        system_reminder: "system_reminder";
        background_notification: "background_notification";
        subagent_notification: "subagent_notification";
        rewind_notice: "rewind_notice";
        fork_notice: "fork_notice";
        timeline_event: "timeline_event";
        compact_summary: "compact_summary";
        assistant_response: "assistant_response";
    }>;
    source: z.ZodOptional<z.ZodString>;
    commandName: z.ZodOptional<z.ZodString>;
    uiVisibility: z.ZodEnum<{
        visible: "visible";
        hidden: "hidden";
        debug: "debug";
    }>;
    providerVisibility: z.ZodEnum<{
        visible: "visible";
        hidden: "hidden";
    }>;
    transcriptVisibility: z.ZodEnum<{
        visible: "visible";
        hidden: "hidden";
    }>;
}, z.core.$strict>;
export declare const zcodeUserMessageInfoSchema: z.ZodObject<{
    messageId: z.ZodString;
    sessionId: z.ZodString;
    role: z.ZodLiteral<"user">;
    time: z.ZodObject<{
        created: z.ZodNumber;
        completed: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    agent: z.ZodString;
    model: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    system: z.ZodOptional<z.ZodString>;
    tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    synthetic: z.ZodOptional<z.ZodBoolean>;
    source: z.ZodOptional<z.ZodEnum<{
        subagent: "subagent";
        agent_listing_delta: "agent_listing_delta";
        background_task: "background_task";
        fork: "fork";
        goal_state_change: "goal_state_change";
        "goal-continuation": "goal-continuation";
        plugin_reference: "plugin_reference";
        bot_topic_context: "bot_topic_context";
        rewind: "rewind";
        selection_side_chat: "selection_side_chat";
        subagent_message: "subagent_message";
        todo_reminder: "todo_reminder";
        workflow_launch: "workflow_launch";
        shared_context: "shared_context";
    }>>;
    visibility: z.ZodOptional<z.ZodEnum<{
        "user-visible": "user-visible";
        "model-only": "model-only";
    }>>;
    semantics: z.ZodOptional<z.ZodObject<{
        origin: z.ZodEnum<{
            real_user: "real_user";
            agent_runtime: "agent_runtime";
            system: "system";
            migration: "migration";
            import: "import";
        }>;
        kind: z.ZodEnum<{
            todo_reminder: "todo_reminder";
            shared_context: "shared_context";
            user_prompt: "user_prompt";
            slash_command: "slash_command";
            system_reminder: "system_reminder";
            background_notification: "background_notification";
            subagent_notification: "subagent_notification";
            rewind_notice: "rewind_notice";
            fork_notice: "fork_notice";
            timeline_event: "timeline_event";
            compact_summary: "compact_summary";
            assistant_response: "assistant_response";
        }>;
        source: z.ZodOptional<z.ZodString>;
        commandName: z.ZodOptional<z.ZodString>;
        uiVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
            debug: "debug";
        }>;
        providerVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
        }>;
        transcriptVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
        }>;
    }, z.core.$strict>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>;
export declare const zcodeAssistantMessageInfoSchema: z.ZodObject<{
    messageId: z.ZodString;
    sessionId: z.ZodString;
    role: z.ZodLiteral<"assistant">;
    time: z.ZodObject<{
        created: z.ZodNumber;
        completed: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    parentMessageId: z.ZodString;
    agent: z.ZodString;
    model: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    path: z.ZodObject<{
        cwd: z.ZodString;
        root: z.ZodString;
    }, z.core.$strict>;
    cost: z.ZodNumber;
    tokens: z.ZodObject<{
        total: z.ZodOptional<z.ZodNumber>;
        input: z.ZodNumber;
        output: z.ZodNumber;
        reasoning: z.ZodNumber;
        cache: z.ZodObject<{
            read: z.ZodNumber;
            write: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>;
    finish: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    semantics: z.ZodOptional<z.ZodObject<{
        origin: z.ZodEnum<{
            real_user: "real_user";
            agent_runtime: "agent_runtime";
            system: "system";
            migration: "migration";
            import: "import";
        }>;
        kind: z.ZodEnum<{
            todo_reminder: "todo_reminder";
            shared_context: "shared_context";
            user_prompt: "user_prompt";
            slash_command: "slash_command";
            system_reminder: "system_reminder";
            background_notification: "background_notification";
            subagent_notification: "subagent_notification";
            rewind_notice: "rewind_notice";
            fork_notice: "fork_notice";
            timeline_event: "timeline_event";
            compact_summary: "compact_summary";
            assistant_response: "assistant_response";
        }>;
        source: z.ZodOptional<z.ZodString>;
        commandName: z.ZodOptional<z.ZodString>;
        uiVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
            debug: "debug";
        }>;
        providerVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
        }>;
        transcriptVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
        }>;
    }, z.core.$strict>>;
    structured: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strict>;
export declare const zcodeMessageInfoSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    messageId: z.ZodString;
    sessionId: z.ZodString;
    role: z.ZodLiteral<"user">;
    time: z.ZodObject<{
        created: z.ZodNumber;
        completed: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    agent: z.ZodString;
    model: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    system: z.ZodOptional<z.ZodString>;
    tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    synthetic: z.ZodOptional<z.ZodBoolean>;
    source: z.ZodOptional<z.ZodEnum<{
        subagent: "subagent";
        agent_listing_delta: "agent_listing_delta";
        background_task: "background_task";
        fork: "fork";
        goal_state_change: "goal_state_change";
        "goal-continuation": "goal-continuation";
        plugin_reference: "plugin_reference";
        bot_topic_context: "bot_topic_context";
        rewind: "rewind";
        selection_side_chat: "selection_side_chat";
        subagent_message: "subagent_message";
        todo_reminder: "todo_reminder";
        workflow_launch: "workflow_launch";
        shared_context: "shared_context";
    }>>;
    visibility: z.ZodOptional<z.ZodEnum<{
        "user-visible": "user-visible";
        "model-only": "model-only";
    }>>;
    semantics: z.ZodOptional<z.ZodObject<{
        origin: z.ZodEnum<{
            real_user: "real_user";
            agent_runtime: "agent_runtime";
            system: "system";
            migration: "migration";
            import: "import";
        }>;
        kind: z.ZodEnum<{
            todo_reminder: "todo_reminder";
            shared_context: "shared_context";
            user_prompt: "user_prompt";
            slash_command: "slash_command";
            system_reminder: "system_reminder";
            background_notification: "background_notification";
            subagent_notification: "subagent_notification";
            rewind_notice: "rewind_notice";
            fork_notice: "fork_notice";
            timeline_event: "timeline_event";
            compact_summary: "compact_summary";
            assistant_response: "assistant_response";
        }>;
        source: z.ZodOptional<z.ZodString>;
        commandName: z.ZodOptional<z.ZodString>;
        uiVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
            debug: "debug";
        }>;
        providerVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
        }>;
        transcriptVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
        }>;
    }, z.core.$strict>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>, z.ZodObject<{
    messageId: z.ZodString;
    sessionId: z.ZodString;
    role: z.ZodLiteral<"assistant">;
    time: z.ZodObject<{
        created: z.ZodNumber;
        completed: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    parentMessageId: z.ZodString;
    agent: z.ZodString;
    model: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    path: z.ZodObject<{
        cwd: z.ZodString;
        root: z.ZodString;
    }, z.core.$strict>;
    cost: z.ZodNumber;
    tokens: z.ZodObject<{
        total: z.ZodOptional<z.ZodNumber>;
        input: z.ZodNumber;
        output: z.ZodNumber;
        reasoning: z.ZodNumber;
        cache: z.ZodObject<{
            read: z.ZodNumber;
            write: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>;
    finish: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    semantics: z.ZodOptional<z.ZodObject<{
        origin: z.ZodEnum<{
            real_user: "real_user";
            agent_runtime: "agent_runtime";
            system: "system";
            migration: "migration";
            import: "import";
        }>;
        kind: z.ZodEnum<{
            todo_reminder: "todo_reminder";
            shared_context: "shared_context";
            user_prompt: "user_prompt";
            slash_command: "slash_command";
            system_reminder: "system_reminder";
            background_notification: "background_notification";
            subagent_notification: "subagent_notification";
            rewind_notice: "rewind_notice";
            fork_notice: "fork_notice";
            timeline_event: "timeline_event";
            compact_summary: "compact_summary";
            assistant_response: "assistant_response";
        }>;
        source: z.ZodOptional<z.ZodString>;
        commandName: z.ZodOptional<z.ZodString>;
        uiVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
            debug: "debug";
        }>;
        providerVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
        }>;
        transcriptVisibility: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
        }>;
    }, z.core.$strict>>;
    structured: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strict>], "role">;
export type ZCodeMessageInfo = z.infer<typeof zcodeMessageInfoSchema>;
export declare const zcodeToolStateSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    status: z.ZodLiteral<"pending">;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    raw: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    status: z.ZodLiteral<"running">;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    title: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    startedAt: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    status: z.ZodLiteral<"completed">;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    output: z.ZodString;
    title: z.ZodString;
    metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    startedAt: z.ZodNumber;
    completedAt: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    status: z.ZodLiteral<"error">;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    error: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    startedAt: z.ZodNumber;
    completedAt: z.ZodNumber;
}, z.core.$strict>], "status">;
export declare const zcodeTimelinePartSchema: z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"timeline">;
    timelineType: z.ZodEnum<{
        goal_verification: "goal_verification";
        context_compaction: "context_compaction";
        session_fork: "session_fork";
        model_change: "model_change";
    }>;
    display: z.ZodEnum<{
        separator: "separator";
        worklog: "worklog";
    }>;
    status: z.ZodOptional<z.ZodString>;
    anchorMessageId: z.ZodOptional<z.ZodString>;
    anchorTurnId: z.ZodOptional<z.ZodString>;
    time: z.ZodOptional<z.ZodObject<{
        start: z.ZodOptional<z.ZodNumber>;
        end: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    operationId: z.ZodOptional<z.ZodString>;
    trigger: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        manual: "manual";
        partial: "partial";
        reactive: "reactive";
        session_memory: "session_memory";
    }>>;
    phase: z.ZodOptional<z.ZodEnum<{
        reactive: "reactive";
        standalone_turn: "standalone_turn";
        pre_request: "pre_request";
        mid_turn: "mid_turn";
    }>>;
    compactReason: z.ZodOptional<z.ZodString>;
    boundaryId: z.ZodOptional<z.ZodString>;
    summaryMessageId: z.ZodOptional<z.ZodString>;
    preCompactTokenCount: z.ZodOptional<z.ZodNumber>;
    postCompactTokenCount: z.ZodOptional<z.ZodNumber>;
    truePostCompactTokenCount: z.ZodOptional<z.ZodNumber>;
    attempt: z.ZodOptional<z.ZodNumber>;
    maxAttempts: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodOptional<z.ZodString>;
    targetId: z.ZodOptional<z.ZodString>;
    verificationId: z.ZodOptional<z.ZodString>;
    goalIteration: z.ZodOptional<z.ZodNumber>;
    verification: z.ZodOptional<z.ZodObject<{
        passed: z.ZodBoolean;
        reason: z.ZodString;
        nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>;
    parentSessionId: z.ZodOptional<z.ZodString>;
    targetMessageId: z.ZodOptional<z.ZodString>;
    targetCheckpointId: z.ZodOptional<z.ZodString>;
    restoredFileCount: z.ZodOptional<z.ZodNumber>;
    fromModel: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        label: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    toModel: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        label: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const zcodeMessagePartSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    synthetic: z.ZodOptional<z.ZodBoolean>;
    ignored: z.ZodOptional<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"reasoning">;
    text: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"file">;
    mime: z.ZodString;
    filename: z.ZodOptional<z.ZodString>;
    url: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"tool">;
    callId: z.ZodString;
    tool: z.ZodString;
    state: z.ZodDiscriminatedUnion<[z.ZodObject<{
        status: z.ZodLiteral<"pending">;
        input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        raw: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        status: z.ZodLiteral<"running">;
        input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        title: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        startedAt: z.ZodNumber;
    }, z.core.$strict>, z.ZodObject<{
        status: z.ZodLiteral<"completed">;
        input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        output: z.ZodString;
        title: z.ZodString;
        metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        startedAt: z.ZodNumber;
        completedAt: z.ZodNumber;
    }, z.core.$strict>, z.ZodObject<{
        status: z.ZodLiteral<"error">;
        input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        error: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        startedAt: z.ZodNumber;
        completedAt: z.ZodNumber;
    }, z.core.$strict>], "status">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"step-start">;
    snapshot: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"step-finish">;
    reason: z.ZodString;
    snapshot: z.ZodOptional<z.ZodString>;
    cost: z.ZodNumber;
    tokens: z.ZodObject<{
        total: z.ZodOptional<z.ZodNumber>;
        input: z.ZodNumber;
        output: z.ZodNumber;
        reasoning: z.ZodNumber;
        cache: z.ZodObject<{
            read: z.ZodNumber;
            write: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"snapshot">;
    snapshot: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"patch">;
    hash: z.ZodString;
    files: z.ZodArray<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"compaction">;
    auto: z.ZodBoolean;
    reason: z.ZodOptional<z.ZodString>;
    summaryMessageId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"timeline">;
    timelineType: z.ZodEnum<{
        goal_verification: "goal_verification";
        context_compaction: "context_compaction";
        session_fork: "session_fork";
        model_change: "model_change";
    }>;
    display: z.ZodEnum<{
        separator: "separator";
        worklog: "worklog";
    }>;
    status: z.ZodOptional<z.ZodString>;
    anchorMessageId: z.ZodOptional<z.ZodString>;
    anchorTurnId: z.ZodOptional<z.ZodString>;
    time: z.ZodOptional<z.ZodObject<{
        start: z.ZodOptional<z.ZodNumber>;
        end: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    operationId: z.ZodOptional<z.ZodString>;
    trigger: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        manual: "manual";
        partial: "partial";
        reactive: "reactive";
        session_memory: "session_memory";
    }>>;
    phase: z.ZodOptional<z.ZodEnum<{
        reactive: "reactive";
        standalone_turn: "standalone_turn";
        pre_request: "pre_request";
        mid_turn: "mid_turn";
    }>>;
    compactReason: z.ZodOptional<z.ZodString>;
    boundaryId: z.ZodOptional<z.ZodString>;
    summaryMessageId: z.ZodOptional<z.ZodString>;
    preCompactTokenCount: z.ZodOptional<z.ZodNumber>;
    postCompactTokenCount: z.ZodOptional<z.ZodNumber>;
    truePostCompactTokenCount: z.ZodOptional<z.ZodNumber>;
    attempt: z.ZodOptional<z.ZodNumber>;
    maxAttempts: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodOptional<z.ZodString>;
    targetId: z.ZodOptional<z.ZodString>;
    verificationId: z.ZodOptional<z.ZodString>;
    goalIteration: z.ZodOptional<z.ZodNumber>;
    verification: z.ZodOptional<z.ZodObject<{
        passed: z.ZodBoolean;
        reason: z.ZodString;
        nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>;
    parentSessionId: z.ZodOptional<z.ZodString>;
    targetMessageId: z.ZodOptional<z.ZodString>;
    targetCheckpointId: z.ZodOptional<z.ZodString>;
    restoredFileCount: z.ZodOptional<z.ZodNumber>;
    fromModel: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        label: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    toModel: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        label: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"subagent">;
    prompt: z.ZodString;
    description: z.ZodString;
    agent: z.ZodString;
    model: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    command: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"agent">;
    name: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    partId: z.ZodString;
    sessionId: z.ZodString;
    messageId: z.ZodString;
    type: z.ZodLiteral<"retry">;
    attempt: z.ZodNumber;
    error: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strict>], "type">;
export type ZCodeMessagePart = z.infer<typeof zcodeMessagePartSchema>;
export declare const zcodeMessageWithPartsSchema: z.ZodObject<{
    info: z.ZodDiscriminatedUnion<[z.ZodObject<{
        messageId: z.ZodString;
        sessionId: z.ZodString;
        role: z.ZodLiteral<"user">;
        time: z.ZodObject<{
            created: z.ZodNumber;
            completed: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>;
        agent: z.ZodString;
        model: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        system: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        synthetic: z.ZodOptional<z.ZodBoolean>;
        source: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            agent_listing_delta: "agent_listing_delta";
            background_task: "background_task";
            fork: "fork";
            goal_state_change: "goal_state_change";
            "goal-continuation": "goal-continuation";
            plugin_reference: "plugin_reference";
            bot_topic_context: "bot_topic_context";
            rewind: "rewind";
            selection_side_chat: "selection_side_chat";
            subagent_message: "subagent_message";
            todo_reminder: "todo_reminder";
            workflow_launch: "workflow_launch";
            shared_context: "shared_context";
        }>>;
        visibility: z.ZodOptional<z.ZodEnum<{
            "user-visible": "user-visible";
            "model-only": "model-only";
        }>>;
        semantics: z.ZodOptional<z.ZodObject<{
            origin: z.ZodEnum<{
                real_user: "real_user";
                agent_runtime: "agent_runtime";
                system: "system";
                migration: "migration";
                import: "import";
            }>;
            kind: z.ZodEnum<{
                todo_reminder: "todo_reminder";
                shared_context: "shared_context";
                user_prompt: "user_prompt";
                slash_command: "slash_command";
                system_reminder: "system_reminder";
                background_notification: "background_notification";
                subagent_notification: "subagent_notification";
                rewind_notice: "rewind_notice";
                fork_notice: "fork_notice";
                timeline_event: "timeline_event";
                compact_summary: "compact_summary";
                assistant_response: "assistant_response";
            }>;
            source: z.ZodOptional<z.ZodString>;
            commandName: z.ZodOptional<z.ZodString>;
            uiVisibility: z.ZodEnum<{
                visible: "visible";
                hidden: "hidden";
                debug: "debug";
            }>;
            providerVisibility: z.ZodEnum<{
                visible: "visible";
                hidden: "hidden";
            }>;
            transcriptVisibility: z.ZodEnum<{
                visible: "visible";
                hidden: "hidden";
            }>;
        }, z.core.$strict>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>, z.ZodObject<{
        messageId: z.ZodString;
        sessionId: z.ZodString;
        role: z.ZodLiteral<"assistant">;
        time: z.ZodObject<{
            created: z.ZodNumber;
            completed: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>;
        parentMessageId: z.ZodString;
        agent: z.ZodString;
        model: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        path: z.ZodObject<{
            cwd: z.ZodString;
            root: z.ZodString;
        }, z.core.$strict>;
        cost: z.ZodNumber;
        tokens: z.ZodObject<{
            total: z.ZodOptional<z.ZodNumber>;
            input: z.ZodNumber;
            output: z.ZodNumber;
            reasoning: z.ZodNumber;
            cache: z.ZodObject<{
                read: z.ZodNumber;
                write: z.ZodNumber;
            }, z.core.$strict>;
        }, z.core.$strict>;
        finish: z.ZodOptional<z.ZodString>;
        error: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        semantics: z.ZodOptional<z.ZodObject<{
            origin: z.ZodEnum<{
                real_user: "real_user";
                agent_runtime: "agent_runtime";
                system: "system";
                migration: "migration";
                import: "import";
            }>;
            kind: z.ZodEnum<{
                todo_reminder: "todo_reminder";
                shared_context: "shared_context";
                user_prompt: "user_prompt";
                slash_command: "slash_command";
                system_reminder: "system_reminder";
                background_notification: "background_notification";
                subagent_notification: "subagent_notification";
                rewind_notice: "rewind_notice";
                fork_notice: "fork_notice";
                timeline_event: "timeline_event";
                compact_summary: "compact_summary";
                assistant_response: "assistant_response";
            }>;
            source: z.ZodOptional<z.ZodString>;
            commandName: z.ZodOptional<z.ZodString>;
            uiVisibility: z.ZodEnum<{
                visible: "visible";
                hidden: "hidden";
                debug: "debug";
            }>;
            providerVisibility: z.ZodEnum<{
                visible: "visible";
                hidden: "hidden";
            }>;
            transcriptVisibility: z.ZodEnum<{
                visible: "visible";
                hidden: "hidden";
            }>;
        }, z.core.$strict>>;
        structured: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strict>], "role">;
    parts: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        synthetic: z.ZodOptional<z.ZodBoolean>;
        ignored: z.ZodOptional<z.ZodBoolean>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"reasoning">;
        text: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"file">;
        mime: z.ZodString;
        filename: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"tool">;
        callId: z.ZodString;
        tool: z.ZodString;
        state: z.ZodDiscriminatedUnion<[z.ZodObject<{
            status: z.ZodLiteral<"pending">;
            input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            raw: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            status: z.ZodLiteral<"running">;
            input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            title: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            startedAt: z.ZodNumber;
        }, z.core.$strict>, z.ZodObject<{
            status: z.ZodLiteral<"completed">;
            input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            output: z.ZodString;
            title: z.ZodString;
            metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            startedAt: z.ZodNumber;
            completedAt: z.ZodNumber;
        }, z.core.$strict>, z.ZodObject<{
            status: z.ZodLiteral<"error">;
            input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            error: z.ZodString;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            startedAt: z.ZodNumber;
            completedAt: z.ZodNumber;
        }, z.core.$strict>], "status">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"step-start">;
        snapshot: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"step-finish">;
        reason: z.ZodString;
        snapshot: z.ZodOptional<z.ZodString>;
        cost: z.ZodNumber;
        tokens: z.ZodObject<{
            total: z.ZodOptional<z.ZodNumber>;
            input: z.ZodNumber;
            output: z.ZodNumber;
            reasoning: z.ZodNumber;
            cache: z.ZodObject<{
                read: z.ZodNumber;
                write: z.ZodNumber;
            }, z.core.$strict>;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"snapshot">;
        snapshot: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"patch">;
        hash: z.ZodString;
        files: z.ZodArray<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"compaction">;
        auto: z.ZodBoolean;
        reason: z.ZodOptional<z.ZodString>;
        summaryMessageId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"timeline">;
        timelineType: z.ZodEnum<{
            goal_verification: "goal_verification";
            context_compaction: "context_compaction";
            session_fork: "session_fork";
            model_change: "model_change";
        }>;
        display: z.ZodEnum<{
            separator: "separator";
            worklog: "worklog";
        }>;
        status: z.ZodOptional<z.ZodString>;
        anchorMessageId: z.ZodOptional<z.ZodString>;
        anchorTurnId: z.ZodOptional<z.ZodString>;
        time: z.ZodOptional<z.ZodObject<{
            start: z.ZodOptional<z.ZodNumber>;
            end: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        operationId: z.ZodOptional<z.ZodString>;
        trigger: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            manual: "manual";
            partial: "partial";
            reactive: "reactive";
            session_memory: "session_memory";
        }>>;
        phase: z.ZodOptional<z.ZodEnum<{
            reactive: "reactive";
            standalone_turn: "standalone_turn";
            pre_request: "pre_request";
            mid_turn: "mid_turn";
        }>>;
        compactReason: z.ZodOptional<z.ZodString>;
        boundaryId: z.ZodOptional<z.ZodString>;
        summaryMessageId: z.ZodOptional<z.ZodString>;
        preCompactTokenCount: z.ZodOptional<z.ZodNumber>;
        postCompactTokenCount: z.ZodOptional<z.ZodNumber>;
        truePostCompactTokenCount: z.ZodOptional<z.ZodNumber>;
        attempt: z.ZodOptional<z.ZodNumber>;
        maxAttempts: z.ZodOptional<z.ZodNumber>;
        reason: z.ZodOptional<z.ZodString>;
        targetId: z.ZodOptional<z.ZodString>;
        verificationId: z.ZodOptional<z.ZodString>;
        goalIteration: z.ZodOptional<z.ZodNumber>;
        verification: z.ZodOptional<z.ZodObject<{
            passed: z.ZodBoolean;
            reason: z.ZodString;
            nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>;
        parentSessionId: z.ZodOptional<z.ZodString>;
        targetMessageId: z.ZodOptional<z.ZodString>;
        targetCheckpointId: z.ZodOptional<z.ZodString>;
        restoredFileCount: z.ZodOptional<z.ZodNumber>;
        fromModel: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            label: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        toModel: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            label: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"subagent">;
        prompt: z.ZodString;
        description: z.ZodString;
        agent: z.ZodString;
        model: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        command: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"agent">;
        name: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"retry">;
        attempt: z.ZodNumber;
        error: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, z.core.$strict>], "type">>;
}, z.core.$strict>;
export type ZCodeMessageWithParts = z.infer<typeof zcodeMessageWithPartsSchema>;
export declare const zcodeSessionApiRetryStatusSchema: z.ZodObject<{
    kind: z.ZodLiteral<"api_retry">;
    attempt: z.ZodNumber;
    maxRetries: z.ZodNumber;
    retryDelayMs: z.ZodNumber;
    errorStatus: z.ZodNullable<z.ZodNumber>;
    error: z.ZodString;
}, z.core.$strict>;
export declare const zcodeSessionContextCacheUsageSchema: z.ZodObject<{
    inputTokens: z.ZodNumber;
    cacheReadTokens: z.ZodNumber;
    cacheWriteTokens: z.ZodNumber;
    latestHitRate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    hitRateRequestCount: z.ZodOptional<z.ZodNumber>;
    totalInputTokens: z.ZodOptional<z.ZodNumber>;
    totalCacheReadTokens: z.ZodOptional<z.ZodNumber>;
    totalCacheWriteTokens: z.ZodOptional<z.ZodNumber>;
    hitRate: z.ZodNullable<z.ZodNumber>;
}, z.core.$strict>;
export declare const zcodeContextUsageBreakdownSourceSchema: z.ZodEnum<{
    system_prompt: "system_prompt";
    meta_user_context: "meta_user_context";
    skills: "skills";
    tool_prompt: "tool_prompt";
    system_tool_schemas: "system_tool_schemas";
    mcp_tool_schemas: "mcp_tool_schemas";
    messages: "messages";
}>;
export declare const zcodeContextUsageBreakdownItemSchema: z.ZodObject<{
    source: z.ZodEnum<{
        system_prompt: "system_prompt";
        meta_user_context: "meta_user_context";
        skills: "skills";
        tool_prompt: "tool_prompt";
        system_tool_schemas: "system_tool_schemas";
        mcp_tool_schemas: "mcp_tool_schemas";
        messages: "messages";
    }>;
    chars: z.ZodNumber;
}, z.core.$strict>;
export type ZCodeContextUsageBreakdownItem = z.infer<typeof zcodeContextUsageBreakdownItemSchema>;
export declare const zcodeContextUsageBreakdownSchema: z.ZodArray<z.ZodObject<{
    source: z.ZodEnum<{
        system_prompt: "system_prompt";
        meta_user_context: "meta_user_context";
        skills: "skills";
        tool_prompt: "tool_prompt";
        system_tool_schemas: "system_tool_schemas";
        mcp_tool_schemas: "mcp_tool_schemas";
        messages: "messages";
    }>;
    chars: z.ZodNumber;
}, z.core.$strict>>;
export declare const zcodeSessionContextUsageSchema: z.ZodObject<{
    used: z.ZodNumber;
    size: z.ZodNumber;
    cost: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodString;
    }, z.core.$strict>>>;
    cache: z.ZodOptional<z.ZodObject<{
        inputTokens: z.ZodNumber;
        cacheReadTokens: z.ZodNumber;
        cacheWriteTokens: z.ZodNumber;
        latestHitRate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        hitRateRequestCount: z.ZodOptional<z.ZodNumber>;
        totalInputTokens: z.ZodOptional<z.ZodNumber>;
        totalCacheReadTokens: z.ZodOptional<z.ZodNumber>;
        totalCacheWriteTokens: z.ZodOptional<z.ZodNumber>;
        hitRate: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strict>>;
    breakdown: z.ZodOptional<z.ZodArray<z.ZodObject<{
        source: z.ZodEnum<{
            system_prompt: "system_prompt";
            meta_user_context: "meta_user_context";
            skills: "skills";
            tool_prompt: "tool_prompt";
            system_tool_schemas: "system_tool_schemas";
            mcp_tool_schemas: "mcp_tool_schemas";
            messages: "messages";
        }>;
        chars: z.ZodNumber;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const zcodeSessionRuntimeStateSchema: z.ZodObject<{
    eventSeq: z.ZodNumber;
    stateRevision: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    activeTurnId: z.ZodOptional<z.ZodString>;
    activeTurnKind: z.ZodOptional<z.ZodEnum<{
        rewind: "rewind";
        regular: "regular";
        compact: "compact";
    }>>;
    pendingRequestIds: z.ZodArray<z.ZodString>;
    apiRetry: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        kind: z.ZodLiteral<"api_retry">;
        attempt: z.ZodNumber;
        maxRetries: z.ZodNumber;
        retryDelayMs: z.ZodNumber;
        errorStatus: z.ZodNullable<z.ZodNumber>;
        error: z.ZodString;
    }, z.core.$strict>>>;
    contextUsage: z.ZodOptional<z.ZodObject<{
        used: z.ZodNumber;
        size: z.ZodNumber;
        cost: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            amount: z.ZodNumber;
            currency: z.ZodString;
        }, z.core.$strict>>>;
        cache: z.ZodOptional<z.ZodObject<{
            inputTokens: z.ZodNumber;
            cacheReadTokens: z.ZodNumber;
            cacheWriteTokens: z.ZodNumber;
            latestHitRate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            hitRateRequestCount: z.ZodOptional<z.ZodNumber>;
            totalInputTokens: z.ZodOptional<z.ZodNumber>;
            totalCacheReadTokens: z.ZodOptional<z.ZodNumber>;
            totalCacheWriteTokens: z.ZodOptional<z.ZodNumber>;
            hitRate: z.ZodNullable<z.ZodNumber>;
        }, z.core.$strict>>;
        breakdown: z.ZodOptional<z.ZodArray<z.ZodObject<{
            source: z.ZodEnum<{
                system_prompt: "system_prompt";
                meta_user_context: "meta_user_context";
                skills: "skills";
                tool_prompt: "tool_prompt";
                system_tool_schemas: "system_tool_schemas";
                mcp_tool_schemas: "mcp_tool_schemas";
                messages: "messages";
            }>;
            chars: z.ZodNumber;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    goalVerifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
        nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        passed: z.ZodBoolean;
        reason: z.ZodString;
    }, z.core.$strict>>>;
    goalVerificationTimeline: z.ZodOptional<z.ZodArray<z.ZodObject<{
        version: z.ZodLiteral<1>;
        kind: z.ZodLiteral<"synthetic">;
        type: z.ZodLiteral<"goal_verification">;
        display: z.ZodLiteral<"separator">;
        targetId: z.ZodString;
        verificationId: z.ZodString;
        status: z.ZodEnum<{
            completed: "completed";
            started: "started";
            cancelled: "cancelled";
            failed_closed: "failed_closed";
        }>;
        verification: z.ZodOptional<z.ZodObject<{
            nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            passed: z.ZodBoolean;
            reason: z.ZodString;
        }, z.core.$strict>>;
        goalIteration: z.ZodOptional<z.ZodNumber>;
        anchorAssistantMessageId: z.ZodOptional<z.ZodString>;
        anchorTurnId: z.ZodOptional<z.ZodString>;
        startedAt: z.ZodOptional<z.ZodNumber>;
        updatedAt: z.ZodNumber;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export type ZCodeSessionRuntimeState = z.infer<typeof zcodeSessionRuntimeStateSchema>;
export type ZCodeSessionActiveTurnKind = NonNullable<ZCodeSessionRuntimeState["activeTurnKind"]>;
export declare function textFromZCodeMessageParts(parts: readonly ZCodeMessagePart[]): string;
//# sourceMappingURL=zcode-protocol-legacy-types.d.ts.map