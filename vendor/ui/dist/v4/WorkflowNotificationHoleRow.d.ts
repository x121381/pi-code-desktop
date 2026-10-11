import type { WorkflowNotificationMeta, WorkflowRunHole } from "@zcode/shared/zcode-protocol-v4";
/**
 * 留白通知行（docs/dynamic-workflow/transcript-and-notifications.md「The notification row」的 hole 一行、
 * 「The hole row's live state」）。从 WorkflowNotificationToolRow.tsx 拆出（max-lines 门）：同一套
 * ToolLayout 语法，笔图标，种类词按 run 投影的 `holes` 活翻转——
 *   run 在场且此 siteId 是 waiting → 「工作流留白 · 等待补全」，等待时长每 30 秒刷一次；
 *   run 在场且已 filled → 「留白已补全」；
 *   run 不在投影里（`holes` 缺席）→ 中性的「工作流留白」。
 * 主文本 `· <run 名> · <留白名>` 加类型徽标；展开体是提示全文、它站在哪两站之间、须返回什么、草稿
 * 路径、等了多久、run 链接。**永不 shimmer**：留白等的是主代理，不是工作。体不引用补全代码——那在相邻
 * 的 FillWorkflowHole 工具卡上。
 */
export type WorkflowHoleNotification = Extract<WorkflowNotificationMeta, {
    kind: "hole";
}>;
export type HoleRowState = "waiting" | "filled" | "left";
export declare function holeRowState(holes: readonly WorkflowRunHole[] | undefined, siteId: string): HoleRowState;
export declare function WorkflowNotificationHoleRow({ forceOpen, holes, notification, onOpenRun, runName, toolId, }: {
    notification: WorkflowHoleNotification;
    runName: string;
    toolId: string;
    /** run 投影里的留白表；undefined = run 不在活投影（中性词）。 */
    holes: readonly WorkflowRunHole[] | undefined;
    onOpenRun?: () => void;
    forceOpen?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowNotificationHoleRow.d.ts.map