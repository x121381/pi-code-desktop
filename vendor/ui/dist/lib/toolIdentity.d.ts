import { type ZCodeKnownToolName, type ZCodeToolFamily } from "@zcode/shared";
export type ToolCallPresentationFamily = ZCodeToolFamily | "plan-guidance" | "switch-mode" | "explore" | "unknown";
export type ToolCallIdentitySource = "toolName" | "kind" | "title" | "raw" | "raw-zcode-meta" | "raw-claude-meta" | "legacy-kind" | "legacy-title" | "legacy-payload" | "unknown";
export interface ToolCallIdentity {
    toolName: ZCodeKnownToolName | string | null;
    family: ToolCallPresentationFamily;
    source: ToolCallIdentitySource;
    isLegacy: boolean;
}
interface ToolIdentityLike {
    toolName?: string | null;
    kind?: string | null;
    title?: string | null;
    input?: unknown;
    raw?: unknown;
}
export declare function resolveToolCallIdentity(toolCall: ToolIdentityLike): ToolCallIdentity;
export declare function isFileContentWriteToolCall(toolCall: ToolIdentityLike, identity?: ToolCallIdentity): boolean;
export declare function isFileDiffToolCall(toolCall: ToolIdentityLike, identity?: ToolCallIdentity): boolean;
export {};
//# sourceMappingURL=toolIdentity.d.ts.map