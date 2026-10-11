import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
/**
 * escalate 工具卡。子代理把一个**真阻塞**问题升级给
 * 主代理，并停驻在这次调用里等答案；主代理侧板挂的嵌套只读 SessionPane 走同一条 ToolCallBlocks
 * 管线，所以这张卡两个面共用。
 *
 * 折叠行：kindLabel（asking/asked）+ 问题单行概要。展开：问题（+ context 若在场）+ 答案区。
 *
 * 关键：预算已尽的驳回**是一次普通工具结果**（不是 error tool_result，见 handler 注释），所以
 * 卡片绝不因 output 文本内容把它渲染成失败——只有 `status==="failed"`（接线故障之类）才走失败
 * 样式。停驻（running）时答案还没到，in-progress 标签就是全部信息；这张卡可能停很久，running
 * 态要显得平静、不像坏了。
 */
export declare function EscalateToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=escalate.d.ts.map