import { type WorkflowRunArtifactSummary } from "./workflow-artifacts.js";
/**
 * `artifact-published` 载荷里的 `ArtifactVersionRecord` → 快照里的**最新版元数据**。
 *
 * 裁剪掉 `versions` / `spec` / `description` / `uri` / `sourcePath` / `publishedAt`：快照是
 * 高频状态键，它的读者只需要「有哪些产物、现在第几版、变了没有」。全量元数据走
 * `workflowRunArtifacts` 查询，字节走 `workflowRunArtifactRead`——权威始终在 journal。
 *
 * `id` / `kind` / `version` 缺任一即无从展示（返回 undefined，只抬水位）：一张认不出种类的卡
 * 既选不出图标也分派不了渲染器。其余字段有则带、无则整键缺席。
 */
export declare function workflowArtifactSummary(value: unknown): WorkflowRunArtifactSummary | undefined;
/**
 * 按**产物 id** upsert 进有界的产物表，并**保留已有条目的 `itemCount`**。
 *
 * 保留计数是这个函数与 `upsertBoundedByInstance` 唯一的实质差别，也是它存在的理由：新版本
 * 的记录里没有 `itemCount`（那是标签 report 数出来的，不是发布时刻的事实），整条替换会把
 * 一块正在被喂数据的看板的计数清零——刷新信号归零，看板从此不再增量取数。
 *
 * 触界语义与其他三张表同族：拒绝新条目、已有条目照常更新。
 */
export declare function upsertBoundedByArtifactId(list: readonly WorkflowRunArtifactSummary[], entry: WorkflowRunArtifactSummary, limit: number): {
    list: WorkflowRunArtifactSummary[];
    truncated: boolean;
};
/**
 * 一条打了标签的 `report` 落在某个产物上：把该 id 的 `itemCount` 加一。
 *
 * 表里没有这个 id 时**忽略计数**（返回原表，条目仍照常进 `reports`）。运行期这是不可能的
 * ——`report(item, tag)` 的 tag 必须先被声明为预置产物，否则引擎 failRun——所以这里纯粹是
 * 防御：事件乱序或载荷残缺时，宁可少一个计数，也不要凭空造出一张没有 spec、渲染不了的卡。
 *
 * **计数的失准方向是有意的。** 去重键 (siteId, ordinal) 来自 `reports` 表，而那张表在 64 条
 * 之后拒收新条目——超界之后一条被重放的标签 report 认不出自己是重放，会多数一次。选择这个
 * 方向是因为 `itemCount` 的职责只是**刷新信号**：多数一次让看板多发一次带 `afterSequence`
 * 的增量查询、拿回零行，无害；少数一次（例如改成"超界就不再计数"）会让折线在第 64 个点上
 * 永远冻住，而那正是这个特性存在的理由。触界时 `truncated` 已置位，读者据此知道 `reports`
 * 与 `itemCount` 都已是近似值；条目的**权威**计数在 journal，经 `workflowRunArtifactData` 翻页得到。
 */
export declare function countTaggedReport(list: readonly WorkflowRunArtifactSummary[] | undefined, artifactId: string): WorkflowRunArtifactSummary[] | undefined;
//# sourceMappingURL=workflow-runs-artifacts.d.ts.map