import { z } from "zod";
export declare const workspaceConfigSelectValueSchema: z.ZodObject<{
    value: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    origin: z.ZodOptional<z.ZodEnum<{
        native: "native";
        injected: "injected";
    }>>;
    modelProviderId: z.ZodOptional<z.ZodString>;
    modelProviderName: z.ZodOptional<z.ZodString>;
    modelThoughtLevels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    modelDefaultThoughtLevel: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WorkspaceConfigSelectValue = z.infer<typeof workspaceConfigSelectValueSchema>;
export declare const workspaceConfigOptionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        boolean: "boolean";
        select: "select";
    }>;
    currentValue: z.ZodUnion<readonly [z.ZodString, z.ZodBoolean]>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        origin: z.ZodOptional<z.ZodEnum<{
            native: "native";
            injected: "injected";
        }>>;
        modelProviderId: z.ZodOptional<z.ZodString>;
        modelProviderName: z.ZodOptional<z.ZodString>;
        modelThoughtLevels: z.ZodOptional<z.ZodArray<z.ZodString>>;
        modelDefaultThoughtLevel: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type WorkspaceConfigOption = z.infer<typeof workspaceConfigOptionSchema>;
export declare const workspaceSlashCommandSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    inputHint: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        builtin: "builtin";
    }>>;
}, z.core.$strip>;
export type WorkspaceSlashCommand = z.infer<typeof workspaceSlashCommandSchema>;
export declare const workspaceConfigStateSchema: z.ZodObject<{
    configOptions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<{
            boolean: "boolean";
            select: "select";
        }>;
        currentValue: z.ZodUnion<readonly [z.ZodString, z.ZodBoolean]>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            origin: z.ZodOptional<z.ZodEnum<{
                native: "native";
                injected: "injected";
            }>>;
            modelProviderId: z.ZodOptional<z.ZodString>;
            modelProviderName: z.ZodOptional<z.ZodString>;
            modelThoughtLevels: z.ZodOptional<z.ZodArray<z.ZodString>>;
            modelDefaultThoughtLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    slashCommands: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        inputHint: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            builtin: "builtin";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type WorkspaceConfigState = z.infer<typeof workspaceConfigStateSchema>;
export declare const workspaceConfigSnapshotSchema: z.ZodObject<{
    protocolVersion: z.ZodLiteral<1>;
    workspaceId: z.ZodString;
    logEpoch: z.ZodString;
    config: z.ZodObject<{
        configOptions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<{
                boolean: "boolean";
                select: "select";
            }>;
            currentValue: z.ZodUnion<readonly [z.ZodString, z.ZodBoolean]>;
            options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                name: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                origin: z.ZodOptional<z.ZodEnum<{
                    native: "native";
                    injected: "injected";
                }>>;
                modelProviderId: z.ZodOptional<z.ZodString>;
                modelProviderName: z.ZodOptional<z.ZodString>;
                modelThoughtLevels: z.ZodOptional<z.ZodArray<z.ZodString>>;
                modelDefaultThoughtLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
        slashCommands: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            inputHint: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodEnum<{
                custom: "custom";
                builtin: "builtin";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type WorkspaceConfigSnapshot = z.infer<typeof workspaceConfigSnapshotSchema>;
export declare const workspaceConfigDeltaSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    op: z.ZodLiteral<"config.updated">;
    config: z.ZodObject<{
        configOptions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<{
                boolean: "boolean";
                select: "select";
            }>;
            currentValue: z.ZodUnion<readonly [z.ZodString, z.ZodBoolean]>;
            options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                name: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                origin: z.ZodOptional<z.ZodEnum<{
                    native: "native";
                    injected: "injected";
                }>>;
                modelProviderId: z.ZodOptional<z.ZodString>;
                modelProviderName: z.ZodOptional<z.ZodString>;
                modelThoughtLevels: z.ZodOptional<z.ZodArray<z.ZodString>>;
                modelDefaultThoughtLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
        slashCommands: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            inputHint: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodEnum<{
                custom: "custom";
                builtin: "builtin";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>], "op">;
export type WorkspaceConfigDelta = z.infer<typeof workspaceConfigDeltaSchema>;
/** workspace-config topic key 构造（与 parseWorkspaceConfigTopic 对偶）。 */
export declare function workspaceConfigTopic(workspaceId: string): string;
/** workspace-config topic key 解析（"workspace-config/<workspaceId>"）。 */
export declare function parseWorkspaceConfigTopic(topic: string): string | null;
//# sourceMappingURL=workspace-config.d.ts.map