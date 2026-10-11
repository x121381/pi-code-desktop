import { z } from "zod";
export declare const SERVER_REMOTE_PROTOCOL_VERSION = 1;
export declare const serverRemoteWorkspaceInfoSchema: z.ZodObject<{
    path: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const serverRemoteInfoSchema: z.ZodObject<{
    serverId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    version: z.ZodString;
    protocolVersion: z.ZodLiteral<1>;
    authRequired: z.ZodBoolean;
    workspaces: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    capabilities: z.ZodObject<{
        desktopContinuous: z.ZodLiteral<true>;
        websocketRpc: z.ZodLiteral<true>;
        processResourceTelemetry: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ServerRemoteWorkspaceInfo = z.infer<typeof serverRemoteWorkspaceInfoSchema>;
export type ServerRemoteInfo = z.infer<typeof serverRemoteInfoSchema>;
export declare const serverRemoteHostCapabilitySchema: z.ZodObject<{
    capability: z.ZodString;
    expiresAt: z.ZodNumber;
}, z.core.$strict>;
export type ServerRemoteHostCapability = z.infer<typeof serverRemoteHostCapabilitySchema>;
//# sourceMappingURL=server-remote.d.ts.map