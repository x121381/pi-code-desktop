import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { memo, useCallback } from "react";
import { TID_V4_BACKGROUND_WORKS, TID_V4_BACKGROUND_WORK_CANCEL, TID_V4_BACKGROUND_WORK_ITEM, testId, } from "@zcode/shared";
import { runUserAction } from "@/lib/userActionTelemetry.js";
/**
 * M4 后台工作面板：渲染 projection.backgroundWorks + running 项 cancel 入口。
 * memo：works 不变时不随 pane 其他状态重渲染（回调由父层 useCallback 稳定）。
 */
function ConversationBackgroundWorksImpl({ works, onCancel, }) {
    if (works.length === 0)
        return null;
    return (_jsxs("div", { "data-testid": TID_V4_BACKGROUND_WORKS, className: "border-t border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2", children: [_jsxs("div", { className: "mb-1 text-ui-sm text-[var(--color-foreground-subtle)]", children: ["\u540E\u53F0\u5DE5\u4F5C \u00B7 ", works.length] }), _jsx("ul", { className: "flex flex-col gap-1", children: works.map((work) => (_jsx(BackgroundWorkRow, { work: work, onCancel: onCancel }, work.workId))) })] }));
}
/** 单项抽成 memo 组件，避免整表随任一项变化全量重渲染。 */
const BackgroundWorkRow = memo(function BackgroundWorkRow({ work, onCancel, }) {
    return (_jsxs("li", { "data-testid": testId(TID_V4_BACKGROUND_WORK_ITEM, work.workId), "data-work-id": work.workId, "data-work-status": work.status, className: "flex items-center justify-between gap-2 rounded border border-[var(--color-border)] px-2 py-1 text-ui-sm", children: [_jsxs("span", { className: "min-w-0 flex-1 truncate text-[var(--color-foreground)]", children: [work.kind, " \u00B7 ", work.title] }), _jsx("span", { className: "shrink-0 text-[var(--color-foreground-subtle)]", children: work.status }), work.status === "running" ? (_jsx(CancelButton, { workId: work.workId, onCancel: onCancel })) : null] }));
});
/** cancel 按钮抽出，内部封装 workId 闭包，父传稳定 onCancel。 */
const CancelButton = memo(function CancelButton({ workId, onCancel, }) {
    const handleClick = useCallback(() => runUserAction({
        input: { featureId: "conversation.background_work", action: "cancel", trigger: "button" },
        operation: () => onCancel(workId),
        completed: { resultSource: "optimistic_projection" },
        failureStage: "background_work_cancel",
    }), [onCancel, workId]);
    return (_jsx("button", { type: "button", "data-testid": testId(TID_V4_BACKGROUND_WORK_CANCEL, workId), onClick: handleClick, className: "shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[var(--color-danger)] hover:bg-[var(--color-surface-hover)]", children: "\u53D6\u6D88" }));
});
export const ConversationBackgroundWorks = memo(ConversationBackgroundWorksImpl);
//# sourceMappingURL=ConversationBackgroundWorks.js.map