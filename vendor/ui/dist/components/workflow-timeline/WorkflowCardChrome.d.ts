import type { ReactNode } from "react";
import type { WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
/**
 * 工作流卡的表头与页脚。
 *
 * 不走 `ToolLayout`：它的摘要行是 `inline-flex self-start`，右对齐的状态簇放不进去。表头一行：
 * 图标 + 种类词 + 名字，右侧灯 + 状态词 + 等宽细节 + [⤢] + chevron。站数超过一列时不再有秩带：
 * 看不见的站在时间线自己的边檐上。
 */
export declare const WORKFLOW_CARD_ICON: import("react/jsx-runtime").JSX.Element;
/** 联接到 run 之后的种类词：同一个 run 在卡上、轮尾摘要里、通知里、详情页里必须叫同一个名字。 */
export declare const WORKFLOW_RUN_KIND_ID: Record<WorkflowRunState["status"], string>;
/**
 * run 不在活投影里（八条上限淘汰 / 冷恢复无 journal 命中）时的中性种类词：卡只说「这里曾有一条 run」，
 * 不冒充某个终态。
 */
export declare const WORKFLOW_RUN_ENDED_KIND_ID = "chat.toolCall.workflow.card.ended";
/** 被修订替代的 run 的种类词。 */
export declare const WORKFLOW_RUN_SUPERSEDED_KIND_ID = "chat.toolCall.workflow.card.superseded";
/**
 * 种类词的唯一入口：stopped ∧ superseded 说「已被替代」，其余按状态查表。三处消费（卡、轮尾摘要、
 * 旧宿主运行卡）都走这里，否则同一个被替代的 run 会在一处叫「已停止」、另一处叫「已被替代」。
 */
export declare function workflowRunKindMessageId(run: {
    status: WorkflowRunState["status"];
    stopReason?: unknown;
}): string;
/** run 级状态：灯 + 词，永远成对出现（不变式 3）。 */
export declare function WorkflowRunStatus({ className, status, run, testId, }: {
    /** 缺席时取 `run.status`（两者至少给一个）。 */
    status?: WorkflowRunState["status"];
    /**
     * 带 `stopReason` 的来源对象（投影 run / 联接摘要）：`stopped` 时原因词跟在状态词后。
     * 按结构读，不绑死某个协议类型。
     *
     * `resumable` 是**状态位**，跟着 run 从 CLI 过来，
     * 在场即为 true 时在原因词之后再加一个词。UI 绝不按 status 推导它——「已停止」并不蕴含可恢复。
     */
    run?: {
        status: WorkflowRunState["status"];
        stopReason?: unknown;
        resumable?: unknown;
    } | undefined;
    className?: string;
    testId?: string;
}): import("react/jsx-runtime").JSX.Element;
/** 静态（尚未联接 run）的状态：空环灯 + 一个词（「compiled」）。 */
export declare function WorkflowStaticStatus({ word }: {
    word: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function WorkflowCardHeader({ detail, detailTitle, expanded, kind, leading, live, name, onOpenDetails, onToggle, status, toggleLabel: toggleLabelOverride, trailing, }: {
    /** 种类词；字符串时按文案换词（换字即重挂，播 wf-swap）。 */
    kind: ReactNode;
    name: string;
    /** 运行中的种类词扫光（与 ToolLayout 的 isRunning 同一表达）。 */
    live?: boolean;
    status?: ReactNode;
    detail?: string;
    /** 细节串的 tooltip；只有子代理模型在场时才给（强度与规范串住在这里）。 */
    detailTitle?: string;
    /** 状态之前的插槽（轮尾摘要的待答问题芯片）。 */
    leading?: ReactNode;
    /** 细节之后、⤢ 之前的插槽（轮尾摘要把 Resume 放进表头）。 */
    trailing?: ReactNode;
    onOpenDetails?: () => void;
    expanded: boolean;
    /** 缺席即不可折叠（forceOpen / canToggle=false）。 */
    onToggle?: () => void;
    /** chevron 的无障碍名；缺席时是工具卡的「展开 / 收起工具详情」。 */
    toggleLabel?: string;
}): import("react/jsx-runtime").JSX.Element;
/** 页脚摘要行：灯 + 状态词 + 清单图标 + 各段用 `·` 隔开 + 末尾控件（失败态的 Resume）。 */
export declare function WorkflowCardFooter({ parts, status, trailing, }: {
    status: WorkflowRunState["status"];
    /** 摘要各段；缺席或为空时只画灯、状态词与 trailing。 */
    parts?: readonly string[];
    trailing?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowCardChrome.d.ts.map