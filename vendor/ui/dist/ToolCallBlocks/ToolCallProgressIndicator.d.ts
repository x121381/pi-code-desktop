import type { ToolProgress } from "@zcode/shared/zcode-protocol-v4";
export declare const TID_TOOL_CALL_PROGRESS = "tool-call-progress";
/** 从 legacy raw 读出投影的运行中进度（toolCallRowAdapter 透传 ToolCallRow.progress）。 */
export declare function readToolCallProgress(raw: unknown): ToolProgress | null;
/**
 * 工具摘要行里的细进度条（）：有 fraction 用 determinate，否则 indeterminate 扫光；
 * message 跟在后面。颜色只用 brand / surface token，遵守 DESIGN.md。
 */
export declare function ToolCallProgressIndicator({ progress }: {
    progress: ToolProgress;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ToolCallProgressIndicator.d.ts.map