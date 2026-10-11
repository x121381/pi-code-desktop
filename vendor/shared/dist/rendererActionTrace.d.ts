import { z } from "zod";
export declare const RENDERER_ACTION_TRACE_SERVICE_NAME = "zcode-desktop-renderer";
export declare const RENDERER_ACTION_TRACE_MAX_SAMPLE_RATIO = 0.2;
export declare const RENDERER_ACTION_TRACE_MAX_BATCH_SPANS = 32;
export declare const RENDERER_ACTION_TRACE_MAX_BATCH_BYTES: number;
export declare const rendererActionTraceGroupSchema: z.ZodEnum<{
    automation: "automation";
    settings: "settings";
    core: "core";
    workbench: "workbench";
    extensions: "extensions";
    account: "account";
}>;
export type RendererActionTraceGroup = z.infer<typeof rendererActionTraceGroupSchema>;
export declare const rendererActionTraceConfigSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    localTtftEnabled: z.ZodOptional<z.ZodBoolean>;
    sampleRatio: z.ZodNumber;
    enabledGroups: z.ZodArray<z.ZodEnum<{
        automation: "automation";
        settings: "settings";
        core: "core";
        workbench: "workbench";
        extensions: "extensions";
        account: "account";
    }>>;
    configVersion: z.ZodString;
}, z.core.$strict>;
export type RendererActionTraceConfigV1 = z.infer<typeof rendererActionTraceConfigSchema>;
export declare const DISABLED_RENDERER_ACTION_TRACE_CONFIG: RendererActionTraceConfigV1;
export declare const rendererActionTraceAttributesSchema: z.ZodObject<{
    feature_id: z.ZodString;
    action: z.ZodString;
    catalog_group: z.ZodEnum<{
        automation: "automation";
        settings: "settings";
        core: "core";
        workbench: "workbench";
        extensions: "extensions";
        account: "account";
    }>;
    operation_kind: z.ZodEnum<{
        command: "command";
        destructive: "destructive";
        navigation: "navigation";
        preference: "preference";
        management: "management";
    }>;
    surface: z.ZodString;
    trigger: z.ZodEnum<{
        select: "select";
        drag: "drag";
        menu: "menu";
        button: "button";
        keyboard: "keyboard";
        shortcut: "shortcut";
        switch: "switch";
    }>;
    outcome: z.ZodEnum<{
        completed: "completed";
        failed: "failed";
        cancelled: "cancelled";
        rejected: "rejected";
        noop: "noop";
        abandoned: "abandoned";
    }>;
    result_source: z.ZodOptional<z.ZodEnum<{
        local_commit: "local_commit";
        shared_settings: "shared_settings";
        setting_service: "setting_service";
        platform_result: "platform_result";
        authority_ack: "authority_ack";
        optimistic_projection: "optimistic_projection";
    }>>;
    failure_stage: z.ZodOptional<z.ZodString>;
    state_after: z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        enabled: "enabled";
    }>>;
    configured: z.ZodOptional<z.ZodBoolean>;
    requires_restart: z.ZodOptional<z.ZodBoolean>;
    section_id: z.ZodOptional<z.ZodString>;
    value_after: z.ZodOptional<z.ZodString>;
    workspace_kind: z.ZodOptional<z.ZodEnum<{
        local: "local";
        remote: "remote";
    }>>;
    remote_kind: z.ZodOptional<z.ZodEnum<{
        ssh: "ssh";
        wsl: "wsl";
        docker: "docker";
        server: "server";
    }>>;
    admission_result: z.ZodOptional<z.ZodEnum<{
        stale: "stale";
        duplicate: "duplicate";
        accepted: "accepted";
        rejected: "rejected";
        noop: "noop";
        not_applicable: "not_applicable";
    }>>;
    automation_kind: z.ZodOptional<z.ZodEnum<{
        scheduled: "scheduled";
        off_peak: "off_peak";
    }>>;
    action_id: z.ZodString;
}, z.core.$strict>;
export type RendererActionTraceAttributes = z.infer<typeof rendererActionTraceAttributesSchema>;
export declare const rendererActionTraceSpanSchema: z.ZodObject<{
    traceId: z.ZodString;
    spanId: z.ZodString;
    name: z.ZodLiteral<"ui_action">;
    startTimeUnixMs: z.ZodNumber;
    endTimeUnixMs: z.ZodNumber;
    status: z.ZodEnum<{
        error: "error";
        ok: "ok";
        unset: "unset";
    }>;
    attributes: z.ZodObject<{
        feature_id: z.ZodString;
        action: z.ZodString;
        catalog_group: z.ZodEnum<{
            automation: "automation";
            settings: "settings";
            core: "core";
            workbench: "workbench";
            extensions: "extensions";
            account: "account";
        }>;
        operation_kind: z.ZodEnum<{
            command: "command";
            destructive: "destructive";
            navigation: "navigation";
            preference: "preference";
            management: "management";
        }>;
        surface: z.ZodString;
        trigger: z.ZodEnum<{
            select: "select";
            drag: "drag";
            menu: "menu";
            button: "button";
            keyboard: "keyboard";
            shortcut: "shortcut";
            switch: "switch";
        }>;
        outcome: z.ZodEnum<{
            completed: "completed";
            failed: "failed";
            cancelled: "cancelled";
            rejected: "rejected";
            noop: "noop";
            abandoned: "abandoned";
        }>;
        result_source: z.ZodOptional<z.ZodEnum<{
            local_commit: "local_commit";
            shared_settings: "shared_settings";
            setting_service: "setting_service";
            platform_result: "platform_result";
            authority_ack: "authority_ack";
            optimistic_projection: "optimistic_projection";
        }>>;
        failure_stage: z.ZodOptional<z.ZodString>;
        state_after: z.ZodOptional<z.ZodEnum<{
            disabled: "disabled";
            enabled: "enabled";
        }>>;
        configured: z.ZodOptional<z.ZodBoolean>;
        requires_restart: z.ZodOptional<z.ZodBoolean>;
        section_id: z.ZodOptional<z.ZodString>;
        value_after: z.ZodOptional<z.ZodString>;
        workspace_kind: z.ZodOptional<z.ZodEnum<{
            local: "local";
            remote: "remote";
        }>>;
        remote_kind: z.ZodOptional<z.ZodEnum<{
            ssh: "ssh";
            wsl: "wsl";
            docker: "docker";
            server: "server";
        }>>;
        admission_result: z.ZodOptional<z.ZodEnum<{
            stale: "stale";
            duplicate: "duplicate";
            accepted: "accepted";
            rejected: "rejected";
            noop: "noop";
            not_applicable: "not_applicable";
        }>>;
        automation_kind: z.ZodOptional<z.ZodEnum<{
            scheduled: "scheduled";
            off_peak: "off_peak";
        }>>;
        action_id: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export type RendererActionTraceSpanV1 = z.infer<typeof rendererActionTraceSpanSchema>;
export declare const rendererActionTraceResourceSchema: z.ZodObject<{
    serviceName: z.ZodLiteral<"zcode-desktop-renderer">;
    serviceVersion: z.ZodString;
    deploymentEnvironment: z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>;
    rendererInstanceId: z.ZodString;
}, z.core.$strict>;
export type RendererActionTraceResourceV1 = z.infer<typeof rendererActionTraceResourceSchema>;
export declare const rendererActionTraceBatchSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    rendererInstanceId: z.ZodString;
    sequence: z.ZodNumber;
    droppedSinceLastFlush: z.ZodNumber;
    resource: z.ZodObject<{
        serviceName: z.ZodLiteral<"zcode-desktop-renderer">;
        serviceVersion: z.ZodString;
        deploymentEnvironment: z.ZodEnum<{
            development: "development";
            production: "production";
            test: "test";
        }>;
        rendererInstanceId: z.ZodString;
    }, z.core.$strict>;
    spans: z.ZodArray<z.ZodObject<{
        traceId: z.ZodString;
        spanId: z.ZodString;
        name: z.ZodLiteral<"ui_action">;
        startTimeUnixMs: z.ZodNumber;
        endTimeUnixMs: z.ZodNumber;
        status: z.ZodEnum<{
            error: "error";
            ok: "ok";
            unset: "unset";
        }>;
        attributes: z.ZodObject<{
            feature_id: z.ZodString;
            action: z.ZodString;
            catalog_group: z.ZodEnum<{
                automation: "automation";
                settings: "settings";
                core: "core";
                workbench: "workbench";
                extensions: "extensions";
                account: "account";
            }>;
            operation_kind: z.ZodEnum<{
                command: "command";
                destructive: "destructive";
                navigation: "navigation";
                preference: "preference";
                management: "management";
            }>;
            surface: z.ZodString;
            trigger: z.ZodEnum<{
                select: "select";
                drag: "drag";
                menu: "menu";
                button: "button";
                keyboard: "keyboard";
                shortcut: "shortcut";
                switch: "switch";
            }>;
            outcome: z.ZodEnum<{
                completed: "completed";
                failed: "failed";
                cancelled: "cancelled";
                rejected: "rejected";
                noop: "noop";
                abandoned: "abandoned";
            }>;
            result_source: z.ZodOptional<z.ZodEnum<{
                local_commit: "local_commit";
                shared_settings: "shared_settings";
                setting_service: "setting_service";
                platform_result: "platform_result";
                authority_ack: "authority_ack";
                optimistic_projection: "optimistic_projection";
            }>>;
            failure_stage: z.ZodOptional<z.ZodString>;
            state_after: z.ZodOptional<z.ZodEnum<{
                disabled: "disabled";
                enabled: "enabled";
            }>>;
            configured: z.ZodOptional<z.ZodBoolean>;
            requires_restart: z.ZodOptional<z.ZodBoolean>;
            section_id: z.ZodOptional<z.ZodString>;
            value_after: z.ZodOptional<z.ZodString>;
            workspace_kind: z.ZodOptional<z.ZodEnum<{
                local: "local";
                remote: "remote";
            }>>;
            remote_kind: z.ZodOptional<z.ZodEnum<{
                ssh: "ssh";
                wsl: "wsl";
                docker: "docker";
                server: "server";
            }>>;
            admission_result: z.ZodOptional<z.ZodEnum<{
                stale: "stale";
                duplicate: "duplicate";
                accepted: "accepted";
                rejected: "rejected";
                noop: "noop";
                not_applicable: "not_applicable";
            }>>;
            automation_kind: z.ZodOptional<z.ZodEnum<{
                scheduled: "scheduled";
                off_peak: "off_peak";
            }>>;
            action_id: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type RendererActionTraceBatchV1 = z.infer<typeof rendererActionTraceBatchSchema>;
//# sourceMappingURL=rendererActionTrace.d.ts.map