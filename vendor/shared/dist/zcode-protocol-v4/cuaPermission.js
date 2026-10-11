import { z } from "zod";
import { timestampSchema } from "./core.js";
export const cuaRequestAccessStatusSchema = z
    .object({
    schemaVersion: z.literal(1),
    platform: z.literal("darwin"),
    grantOwner: z.string().min(1),
    accessibility: z.enum(["granted", "stale", "denied"]),
    screenRecording: z.enum(["granted", "denied", "unknown"]),
})
    .strict();
export function requiredCuaPermissionsForRequestAccessStatus(status) {
    const required = [];
    if (status.accessibility === "denied" || status.accessibility === "stale") {
        required.push("accessibility");
    }
    if (status.screenRecording === "denied") {
        required.push("screen_recording");
    }
    return required;
}
export const cuaPermissionObservationSchema = z
    .object({
    schemaVersion: z.literal(1),
    eventId: z.string().min(1),
    eventSeq: z.number().int().nonnegative(),
    occurredAt: timestampSchema,
    sessionId: z.string().min(1),
    turnId: z.string().min(1).optional(),
    toolCallId: z.string().min(1),
    permissionStatus: cuaRequestAccessStatusSchema,
})
    .strict();
//# sourceMappingURL=cuaPermission.js.map