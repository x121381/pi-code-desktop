/**
 * 审核是否刚刚终结（「有 review → 无 review」的跃变）。
 *
 * Runtime 的 Trust mutation 可能来自另一个 capable attachment；审核 settled 时
 * store 会 clear binding，故该跃变可用于补一次静态 Trust 快照刷新。
 *
 * 不能只判断「当前无 review」：初次挂载时它同样为真，会紧随 initialize 触发一次
 * 多余加载并与之竞争。
 */
export declare function didWorkspaceHookReviewSettle(input: {
    previousInteractionId: string | undefined;
    currentInteractionId: string | undefined;
}): boolean;
export declare function resolveWorkspaceHookReasonCodeMessageId(reasonCode: string | undefined): string;
/**
 * 判定一次 rejected 命令是否应静默收敛（不向用户展示错误）。
 *
 * 双击行内 Trust 按钮时，每次点击产生新的 commandId。
 * 第一次点击成功、审核 flow 终结（store clear binding）；第二次点击的 commandId
 * 被验证为已终结的 flow，返回 workspace_hooks_review_superseded。面板不能将其当作
 * 真正的错误展示给用户——而用户意图已成功，错误文案令人困惑，且训练了我们对
 * 真正的 superseded 报错的不信任。
 *
 * 判定规则：只有当 rejection 是 superseded 类 **且** 本地已无 live pending binding
 * （即审核已终结、binding 已被 clear/advance）时才静默。真正的 superseded（审核期间
 * bundle 变更、binding 仍 pending、用户需要重新审核）必须展示——hasLivePendingBinding
 * 为 true 时不静默。
 *
 * 此函数为纯函数，不读取 store——hasLivePendingBinding 由调用方在 await 完成后从
 * store 当前快照中提取（见 useWorkspaceHookInlineTrust）。
 */
export declare function shouldSilenceStaleRejection(input: {
    reasonCode: string | undefined;
    hasLivePendingBinding: boolean;
}): boolean;
//# sourceMappingURL=workspaceHookTrustState.d.ts.map