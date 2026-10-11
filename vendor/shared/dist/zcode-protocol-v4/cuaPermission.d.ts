import { z } from "zod";
import type { CuaPermissionKind } from "../cuaAccessibilitySettings.js";
export declare const cuaRequestAccessStatusSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    platform: z.ZodLiteral<"darwin">;
    grantOwner: z.ZodString;
    accessibility: z.ZodEnum<{
        granted: "granted";
        stale: "stale";
        denied: "denied";
    }>;
    screenRecording: z.ZodEnum<{
        unknown: "unknown";
        granted: "granted";
        denied: "denied";
    }>;
}, z.core.$strict>;
export type CuaRequestAccessStatus = z.infer<typeof cuaRequestAccessStatusSchema>;
export declare function requiredCuaPermissionsForRequestAccessStatus(status: CuaRequestAccessStatus): CuaPermissionKind[];
export declare const cuaPermissionObservationSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    eventId: z.ZodString;
    eventSeq: z.ZodNumber;
    occurredAt: z.ZodNumber;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodString;
    permissionStatus: z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        platform: z.ZodLiteral<"darwin">;
        grantOwner: z.ZodString;
        accessibility: z.ZodEnum<{
            granted: "granted";
            stale: "stale";
            denied: "denied";
        }>;
        screenRecording: z.ZodEnum<{
            unknown: "unknown";
            granted: "granted";
            denied: "denied";
        }>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type CuaPermissionObservation = z.infer<typeof cuaPermissionObservationSchema>;
//# sourceMappingURL=cuaPermission.d.ts.map