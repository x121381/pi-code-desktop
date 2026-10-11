import { z } from "zod";
export type SessionCreateSource = "group" | "project" | "session";
export type SessionCreateClientKind = "desktop" | "mobile" | "web";
/** 手机转发只开放本事件；公共用户/设备身份仍由桌面 TelemetryCore 注入。 */
export declare const sessionCreateTelemetrySchema: z.ZodObject<{
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
export type MobileSessionCreateTelemetry = z.infer<typeof sessionCreateTelemetrySchema>;
/** 自动化由执行 Host 报告；手机不得冒充无人值守派发来源。 */
export declare const automationSessionCreateTelemetrySchema: z.ZodObject<{
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
export type AutomationSessionCreateTelemetry = z.infer<typeof automationSessionCreateTelemetrySchema>;
//# sourceMappingURL=sessionCreateTelemetry.d.ts.map