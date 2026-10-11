import { z } from "zod";
export * from "./tweakProtocol.js";
export declare const GEN_UI_HTML_MAX_BYTES = 5000000;
export declare const GEN_UI_STATE_MAX_BYTES: number;
export declare const GEN_UI_STATE_MAX_ENTRIES = 100;
export declare const GEN_UI_CONTEXT_MAX_BYTES: number;
export declare const GEN_UI_GLOBALS_EVENT = "zcode:set_globals";
export declare const GEN_UI_STATE_CONTEXT_KEY = "zcode/genUiState";
export declare const GEN_UI_TWEAK_CONTEXT_KEY = "zcode/genUiTweaks";
export declare const GEN_UI_STATE_METHOD = "zcode/gen-ui/state";
export declare const GEN_UI_FOLLOW_UP_METHOD = "zcode/gen-ui/follow-up";
export declare const GEN_UI_TWEAK_METHOD = "zcode/gen-ui/tweak";
export declare const GEN_UI_PRESENTATION_METHOD = "zcode/gen-ui/presentation";
export declare const GEN_UI_STATIC_DOMAINS: readonly ["cdnjs.cloudflare.com", "esm.sh", "cdn.jsdelivr.net", "unpkg.com", "fonts.googleapis.com", "fonts.gstatic.com", "fonts.bunny.net"];
/** This is a wire-format check. The executor owns normalization and filesystem authorization. */
export declare const genUiPathSchema: z.ZodString;
export declare const genUiReferenceSchema: z.ZodObject<{
    path: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        wide: "wide";
    }>>;
}, z.core.$strict>;
export type GenUiReference = z.infer<typeof genUiReferenceSchema>;
export declare const genUiScopeSchema: z.ZodObject<{
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodString;
}, z.core.$strict>;
export type GenUiScope = z.infer<typeof genUiScopeSchema>;
export declare const genUiStateTargetSchema: z.ZodObject<{
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodString;
    path: z.ZodString;
}, z.core.$strict>;
export type GenUiStateTarget = z.infer<typeof genUiStateTargetSchema>;
export declare const genUiWidgetStateSchema: z.ZodPipe<z.ZodObject<{
    modelContent: z.ZodDefault<z.ZodUnknown>;
    privateContent: z.ZodDefault<z.ZodUnknown>;
}, z.core.$strict>, z.ZodTransform<{
    modelContent: unknown;
    privateContent: unknown;
}, {
    modelContent: unknown;
    privateContent: unknown;
}>>;
export type GenUiWidgetState = z.infer<typeof genUiWidgetStateSchema>;
export declare const genUiFollowUpSchema: z.ZodObject<{
    prompt: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export interface GenUiDocument {
    path: string;
    html: string;
}
export declare const genUiTweakControlSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"slider">;
    value: z.ZodNumber;
    min: z.ZodNumber;
    max: z.ZodNumber;
    step: z.ZodOptional<z.ZodNumber>;
    unit: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    label: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"color">;
    value: z.ZodString;
    id: z.ZodString;
    label: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"toggle">;
    value: z.ZodBoolean;
    id: z.ZodString;
    label: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"select">;
    value: z.ZodString;
    options: z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
    }, z.core.$strict>]>>;
    id: z.ZodString;
    label: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, z.core.$strict>], "type">;
export declare const genUiTweakSchema: z.ZodObject<{
    title: z.ZodString;
    controls: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"slider">;
        value: z.ZodNumber;
        min: z.ZodNumber;
        max: z.ZodNumber;
        step: z.ZodOptional<z.ZodNumber>;
        unit: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        label: z.ZodString;
        reference: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"color">;
        value: z.ZodString;
        id: z.ZodString;
        label: z.ZodString;
        reference: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"toggle">;
        value: z.ZodBoolean;
        id: z.ZodString;
        label: z.ZodString;
        reference: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
        value: z.ZodString;
        options: z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
        }, z.core.$strict>]>>;
        id: z.ZodString;
        label: z.ZodString;
        reference: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "type">>;
}, z.core.$strict>;
export type GenUiTweak = z.infer<typeof genUiTweakSchema>;
export type GenUiTweakValues = Record<string, string | number | boolean>;
export interface GenUiStateEntry {
    path: string;
    state: GenUiWidgetState;
}
export interface GenUiStateChange {
    target: GenUiStateTarget;
    state: GenUiWidgetState | null;
}
export declare function buildGenUiScopeKey(scope: GenUiScope): string;
export declare function buildGenUiStateKey(target: GenUiStateTarget): string;
export declare function buildGenUiModelContext(entries: readonly GenUiStateEntry[]): string;
export declare function stripGenUiModelContext(content: string): string;
//# sourceMappingURL=contract.d.ts.map