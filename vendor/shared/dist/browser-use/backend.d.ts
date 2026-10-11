import { z } from "zod";
/**
 * Browser backend family。Playwright 是 Tab 上的能力层，不是 backend。
 */
export declare const browserBackendTypeSchema: z.ZodEnum<{
    iab: "iab";
    extension: "extension";
    cdp: "cdp";
}>;
export type BrowserBackendType = z.infer<typeof browserBackendTypeSchema>;
/** 单项 browser/tab capability 的稳定描述。 */
export declare const browserCapabilityDescriptorSchema: z.ZodObject<{
    id: z.ZodString;
    description: z.ZodString;
}, z.core.$strict>;
export type BrowserCapabilityDescriptor = z.infer<typeof browserCapabilityDescriptorSchema>;
/**
 * 可达 browser backend 的运行时描述。
 *
 * id 是 connection identity，同一 type 可以同时存在多个实例；只有完成握手并真实可用的
 * backend 才能出现在 discovery 结果中。
 */
export declare const browserBackendDescriptorSchema: z.ZodObject<{
    id: z.ZodString;
    generation: z.ZodDefault<z.ZodNumber>;
    type: z.ZodEnum<{
        iab: "iab";
        extension: "extension";
        cdp: "cdp";
    }>;
    name: z.ZodString;
    capabilities: z.ZodObject<{
        browser: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            description: z.ZodString;
        }, z.core.$strict>>>;
        tab: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            description: z.ZodString;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
    apiSupportOverrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strict>;
export type BrowserBackendDescriptor = z.infer<typeof browserBackendDescriptorSchema>;
/** backend request 使用实时 session，或使用已缓存的 session context。 */
export declare const browserSessionContextKindSchema: z.ZodEnum<{
    cached: "cached";
    live: "live";
}>;
export type BrowserSessionContextKind = z.infer<typeof browserSessionContextKindSchema>;
/**
 * Discovery 的完整隔离上下文。workspaceKey 用于身份隔离，workspacePath 仅用于路径语义。
 */
export declare const browserDiscoveryContextSchema: z.ZodObject<{
    requestId: z.ZodString;
    workspaceKey: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    clientMode: z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>;
    sessionContext: z.ZodEnum<{
        cached: "cached";
        live: "live";
    }>;
}, z.core.$strict>;
export type BrowserDiscoveryContext = z.infer<typeof browserDiscoveryContextSchema>;
/** 执行命令时在 discovery context 上增加精确 runtime browser identity。 */
export declare const browserSessionContextSchema: z.ZodObject<{
    requestId: z.ZodString;
    workspaceKey: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    clientMode: z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>;
    sessionContext: z.ZodEnum<{
        cached: "cached";
        live: "live";
    }>;
    browserId: z.ZodString;
    browserGeneration: z.ZodNumber;
}, z.core.$strict>;
export type BrowserSessionContext = z.infer<typeof browserSessionContextSchema>;
/** ZCode Protocol 的 discovery result 包装；port 层会解包并直接返回 browsers。 */
export declare const browserBackendListResultSchema: z.ZodObject<{
    browsers: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        generation: z.ZodDefault<z.ZodNumber>;
        type: z.ZodEnum<{
            iab: "iab";
            extension: "extension";
            cdp: "cdp";
        }>;
        name: z.ZodString;
        capabilities: z.ZodObject<{
            browser: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                description: z.ZodString;
            }, z.core.$strict>>>;
            tab: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                description: z.ZodString;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
        apiSupportOverrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type BrowserBackendListResult = z.infer<typeof browserBackendListResultSchema>;
//# sourceMappingURL=backend.d.ts.map