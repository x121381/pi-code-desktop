import { z } from "zod";
import { zcodeTaskMetaSchema } from "../validation.js";
import { pendingInteractionSummarySchema } from "./sessions-index.js";
import { sessionWorkflowActivitySchema } from "./sessions-index-workflow-activity.js";
import { sessionPhaseSchema } from "./snapshot.js";
import { subscribeAckSchema } from "./transport.js";
export const CONTROLLER_WORKSPACES_TOPIC = "controller/workspaces";
export const CONTROLLER_TASKS_INDEX_TOPIC = "controller/tasks-index";
export const windowHostControllerTopicSchema = z.enum([
    CONTROLLER_WORKSPACES_TOPIC,
    CONTROLLER_TASKS_INDEX_TOPIC,
]);
export const windowHostTaskAddressSchema = z
    .object({
    remoteSessionId: z.string().trim().min(1).optional(),
    workspacePath: z.string().trim().min(1),
    workspaceIdentity: z.string().trim().min(1).optional(),
    taskId: z.string().trim().min(1),
})
    .strict()
    .superRefine((address, context) => {
    if (address.remoteSessionId && !address.workspaceIdentity) {
        context.addIssue({
            code: "custom",
            message: "remote task address requires workspaceIdentity",
            path: ["workspaceIdentity"],
        });
    }
});
export const windowHostControllerWorkspaceFactSchema = z
    .object({
    remoteSessionId: z.string().trim().min(1).optional(),
    workspacePath: z.string().trim().min(1),
    workspaceIdentity: z.string().trim().min(1).optional(),
    sourceAvailability: z.enum(["online", "offline"]),
    connectionState: z.enum([
        "connecting",
        "online",
        "closing",
        "failed",
        "disconnected",
        "reconnecting",
    ]),
})
    .strict()
    .superRefine((workspace, context) => {
    if (workspace.remoteSessionId && !workspace.workspaceIdentity) {
        context.addIssue({
            code: "custom",
            message: "remote workspace fact requires workspaceIdentity",
            path: ["workspaceIdentity"],
        });
    }
    if (workspace.sourceAvailability === "offline" &&
        workspace.connectionState !== "disconnected" &&
        workspace.connectionState !== "failed") {
        context.addIssue({
            code: "custom",
            message: "offline source must be disconnected or failed",
            path: ["connectionState"],
        });
    }
});
export const windowHostControllerTaskActivitySchema = z
    .object({
    phase: sessionPhaseSchema,
    lastActivityAt: z.number().finite().nonnegative(),
    hasBackgroundWork: z.boolean(),
    pendingInteractions: pendingInteractionSummarySchema.optional(),
    // 侧栏工作流运行行；无 run 时缺席。
    workflowActivity: sessionWorkflowActivitySchema.optional(),
})
    .strict();
export const windowHostControllerTaskRowSchema = z
    .object({
    address: windowHostTaskAddressSchema,
    meta: zcodeTaskMetaSchema,
    membership: z
        .object({
        pinned: z.boolean(),
        archived: z.boolean(),
        active: z.boolean(),
    })
        .strict(),
    sourceAvailability: z.enum(["online", "offline"]),
    liveStatus: z.enum(["idle", "running", "waiting", "completed", "error"]),
    activity: windowHostControllerTaskActivitySchema.optional(),
    searchSnippets: z.array(z.string()).optional(),
})
    .strict()
    .superRefine((row, context) => {
    if (row.address.taskId !== row.meta.taskId ||
        row.address.workspacePath !== row.meta.workspacePath ||
        row.address.workspaceIdentity !== row.meta.workspaceIdentity) {
        context.addIssue({
            code: "custom",
            message: "task address and meta identity must match",
            path: ["meta"],
        });
    }
});
/** Host 查询和各 Renderer 投影共用的 task list membership 判定。 */
export function matchesTaskListMembershipKind(membership, kind) {
    switch (kind) {
        case "pinned":
            return membership.pinned && !membership.archived;
        case "archived":
            return membership.archived;
        case "timeline":
            return !membership.pinned && !membership.archived;
        case "active":
            return !membership.archived;
    }
}
export const windowHostControllerWorkspacesSnapshotSchema = z
    .object({
    protocolVersion: z.literal(1),
    logEpoch: z.string().trim().min(1),
    workspaces: z.array(windowHostControllerWorkspaceFactSchema),
})
    .strict();
export const windowHostControllerTasksSnapshotSchema = z
    .object({
    protocolVersion: z.literal(1),
    logEpoch: z.string().trim().min(1),
    tasks: z.array(windowHostControllerTaskRowSchema),
})
    .strict();
export const windowHostControllerWorkspaceDeltaSchema = z.discriminatedUnion("op", [
    z
        .object({
        op: z.literal("workspace.upserted"),
        workspace: windowHostControllerWorkspaceFactSchema,
    })
        .strict(),
    z
        .object({
        op: z.literal("workspace.removed"),
        remoteSessionId: z.string().trim().min(1).optional(),
        workspacePath: z.string().trim().min(1),
        workspaceIdentity: z.string().trim().min(1).optional(),
    })
        .strict(),
]);
export const windowHostControllerTaskDeltaSchema = z.discriminatedUnion("op", [
    z.object({ op: z.literal("task.upserted"), task: windowHostControllerTaskRowSchema }).strict(),
    z.object({ op: z.literal("task.removed"), address: windowHostTaskAddressSchema }).strict(),
]);
function createControllerFrameSchema(topic, snapshotSchema, deltaSchema) {
    return z
        .object({
        topic: z.literal(topic),
        subscriptionId: z.string().trim().min(1),
        logEpoch: z.string().trim().min(1),
        fromSeq: z.number().int().nonnegative(),
        toSeq: z.number().int().nonnegative(),
        sentAt: z.number(),
        payload: z.discriminatedUnion("kind", [
            z.object({ kind: z.literal("snapshot"), snapshot: snapshotSchema }).strict(),
            z.object({ kind: z.literal("deltas"), deltas: z.array(deltaSchema) }).strict(),
        ]),
    })
        .strict()
        .superRefine((frame, context) => {
        if (frame.toSeq < frame.fromSeq) {
            context.addIssue({
                code: "custom",
                message: "toSeq must not be lower than fromSeq",
                path: ["toSeq"],
            });
        }
        const payload = frame.payload;
        if (payload.kind === "snapshot") {
            if (frame.fromSeq !== 0) {
                context.addIssue({
                    code: "custom",
                    message: "snapshot frame must start at seq zero",
                    path: ["fromSeq"],
                });
            }
            if (payload.snapshot.logEpoch !== frame.logEpoch) {
                context.addIssue({
                    code: "custom",
                    message: "frame and snapshot logEpoch must match",
                    path: ["logEpoch"],
                });
            }
        }
    });
}
export const windowHostControllerWorkspaceFrameSchema = createControllerFrameSchema(CONTROLLER_WORKSPACES_TOPIC, windowHostControllerWorkspacesSnapshotSchema, windowHostControllerWorkspaceDeltaSchema);
export const windowHostControllerTaskFrameSchema = createControllerFrameSchema(CONTROLLER_TASKS_INDEX_TOPIC, windowHostControllerTasksSnapshotSchema, windowHostControllerTaskDeltaSchema);
export const controllerSubscribeParamsSchema = z
    .object({
    topic: windowHostControllerTopicSchema,
    base: z
        .object({
        logEpoch: z.string().trim().min(1),
        seq: z.number().int().nonnegative(),
    })
        .strict()
        .optional(),
    visibility: z.enum(["foreground", "background"]).optional(),
})
    .strict();
export const controllerSubscribeResultSchema = z.object({ ack: subscribeAckSchema }).strict();
export const controllerResyncParamsSchema = z
    .object({
    subscriptionId: z.string().trim().min(1),
    base: z
        .object({
        logEpoch: z.string().trim().min(1),
        seq: z.number().int().nonnegative(),
    })
        .strict()
        .nullable(),
    forceSnapshot: z.boolean().optional(),
})
    .strict();
export const controllerResyncResultSchema = z.object({ ack: subscribeAckSchema }).strict();
export const controllerUnsubscribeParamsSchema = z
    .object({ subscriptionId: z.string().trim().min(1) })
    .strict();
export function isWindowHostControllerFrameGap(cursor, frame) {
    return (cursor.subscriptionId !== frame.subscriptionId ||
        cursor.logEpoch !== frame.logEpoch ||
        cursor.seq !== frame.fromSeq);
}
//# sourceMappingURL=controller.js.map