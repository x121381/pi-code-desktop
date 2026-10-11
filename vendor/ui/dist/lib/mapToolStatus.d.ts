/**
 * mapToolStatus — 将 ChatToolCall.status 映射到 ai-elements Tool 组件期望的 ToolPart["state"]
 *
 * 原因：ai-elements 的 Tool 组件使用 ai-sdk 的 ToolUIPart/DynamicToolUIPart 状态枚举，
 * 而我们的 ZCode Agent 层使用自定义状态字符串。此映射桥接两者。
 */
import type { ToolPart } from "../components/ai-elements/tool.js";
export declare function mapToolStatus(status: string): ToolPart["state"];
//# sourceMappingURL=mapToolStatus.d.ts.map