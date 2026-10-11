import { z } from "zod";
/**
 * 以下 schema 是 mcp-apps-protocol 的运行时校验面：只覆盖 ZCode 自己的投影 / 元数据形状。
 * 页面 ↔ 宿主的 `ui/*` 参数由官方 SDK（`McpUi*Schema`）校验，这里不重复。类型见 contract.ts。
 */
export declare const mcpAppsDisplayModeSchema: z.ZodEnum<{
    inline: "inline";
    fullscreen: "fullscreen";
    pip: "pip";
}>;
export declare const mcpAppsToolVisibilitySchema: z.ZodEnum<{
    model: "model";
    app: "app";
}>;
/** 面板 id。 */
export declare const mcpAppsSurfaceIdSchema: z.ZodString;
export declare const mcpToolUiCspSchema: z.ZodObject<{
    connectDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    resourceDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    frameDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    baseUriDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
/** 资源级 `_meta["zcode/csp"]` 归一化后的形状（只有为 true 的键）。 */
export declare const mcpAppCspRelaxationsSchema: z.ZodObject<{
    unsafeEval: z.ZodOptional<z.ZodBoolean>;
    wasmUnsafeEval: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const mcpToolUiDescriptorSchema: z.ZodObject<{
    resourceUri: z.ZodString;
    visibility: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        model: "model";
        app: "app";
    }>>>;
    preferredDisplayMode: z.ZodOptional<z.ZodEnum<{
        inline: "inline";
        fullscreen: "fullscreen";
        pip: "pip";
    }>>;
    csp: z.ZodOptional<z.ZodObject<{
        connectDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        resourceDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        frameDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        baseUriDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    prefersBorder: z.ZodOptional<z.ZodBoolean>;
    surface: z.ZodOptional<z.ZodString>;
    showInline: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
/**
 * `display.ui`：agent 投影到 ToolCallRow.display 的插件 UI 元数据。
 * contracts 与 zcode-protocol-v4 两处 strict schema 都从这里复用，避免三份手写不同步。
 */
export declare const mcpToolDisplayUiSchema: z.ZodObject<{
    pluginId: z.ZodString;
    resourceUri: z.ZodString;
    preferredDisplayMode: z.ZodOptional<z.ZodEnum<{
        inline: "inline";
        fullscreen: "fullscreen";
        pip: "pip";
    }>>;
    prefersBorder: z.ZodOptional<z.ZodBoolean>;
    csp: z.ZodOptional<z.ZodObject<{
        connectDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        resourceDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        frameDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        baseUriDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    structuredContent: z.ZodOptional<z.ZodString>;
    widgetMeta: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    truncated: z.ZodOptional<z.ZodBoolean>;
    truncatedBytes: z.ZodOptional<z.ZodNumber>;
    isError: z.ZodOptional<z.ZodLiteral<true>>;
    showInline: z.ZodOptional<z.ZodLiteral<true>>;
    surface: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type McpToolDisplayUi = z.infer<typeof mcpToolDisplayUiSchema>;
//# sourceMappingURL=schemas.d.ts.map