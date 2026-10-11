import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
/**
 * ResolveWorkflowQuestion 工具卡。主代理按 qid 回答一个
 * 子代理从**正在跑的** workflow 里升级上来的阻塞问题；答案会成为那次 escalate 调用的结果原文。
 *
 * 折叠行：kindLabel（answering/answered）+ 答案单行概要。展开：question_id（mono qid 行）+ 完整
 * 答案 + 工具输出文本（成功确认，或三种结构化拒绝之一）。
 *
 * 关键：拒绝（未知 qid / 已作答 / run 不在飞 / 本会话无应答能力）走的是结构化失败，会带上
 * `status==="failed"`，此时才走失败样式；成功确认是普通结果。
 */
export declare function ResolveWorkflowQuestionToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=resolve-workflow-question.d.ts.map