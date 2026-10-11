import type { ConversationRowRenderContext } from "@/v4/conversationRowContext.js";
/** 输出预览只展示最近 N 条文本输出（更早历史请在右侧 tab 里看全量）。 */
export declare const SUBAGENT_DRILLDOWN_MAX_ROWS = 20;
export interface SubagentDrilldownProps {
    childSessionId: string;
    /** 父行渲染上下文（theme/codePreviewSettings 沿用；宿主保证引用稳定）。 */
    context: ConversationRowRenderContext;
}
/**
 * 挂载即订阅、卸载即释放。memo：props 为字符串 + 稳定 context，
 * 父行重渲染不牵动已展开的输出预览。
 */
export declare const SubagentDrilldown: import("react").MemoExoticComponent<({ childSessionId, context, }: SubagentDrilldownProps) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=SubagentDrilldown.d.ts.map