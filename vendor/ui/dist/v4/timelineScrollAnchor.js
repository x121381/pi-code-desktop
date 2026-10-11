// 虚拟滚动核心：v4 timeline 底部锚定状态机（纯函数，无 DOM/React 依赖）。
//
// 语义（scrollAnchor）：
// - 用户位于底部 → following=true，新内容（新行 / 流式 delta / 测高变化）自动贴底；
// - 用户上滚离底 → following=false，流式增量不得拉回阅读位置，出现「回到底部」按钮；
// - 用户手动滚回底部（或点按钮）→ 恢复跟随。
//
// following 表达用户滚动权，不是瞬时几何快照：只有真实用户滚动输入可以改变它；
// 程序化贴底、terminal 折叠和 virtualizer 测高补偿产生的 scroll 事件只更新几何账目。
//
/** 离底判定容差：小于该距离视为「在底部」。取值覆盖亚像素滚动与最后一行 padding。 */
export const BOTTOM_ANCHOR_EPSILON_PX = 48;
/** 距底部的剩余可滚动距离（内容不足一屏时为 0）。 */
export function distanceToBottom(metrics) {
    return Math.max(0, metrics.contentHeight - metrics.viewportHeight - metrics.scrollTop);
}
export function isAtBottom(metrics, epsilonPx = BOTTOM_ANCHOR_EPSILON_PX) {
    return distanceToBottom(metrics) <= epsilonPx;
}
/**
 * scroll 事件后的跟随态。规则：落点在底部 ⇔ 跟随。
 * 覆盖三种来源且无需区分：用户上滚（离底 → 解除）、用户滚回（贴底 → 恢复）、
 * 程序化贴底（落点即底部 → 保持）。
 */
export function nextFollowingAfterScroll(metrics, epsilonPx = BOTTOM_ANCHOR_EPSILON_PX) {
    return isAtBottom(metrics, epsilonPx);
}
/**
 * scroll 事件后的滚动权裁决。布局/程序化 scroll 不得改变用户意图；只有用户输入
 * 才按最终落点决定是否跟随。
 */
export function resolveFollowingAfterScroll(input) {
    if (input.source !== "user")
        return input.following;
    return nextFollowingAfterScroll(input.metrics, input.epsilonPx);
}
/**
 * 内容变化（新行追加 / 流式 delta 撑高 / 动态测高修正）后的动作：
 * 跟随中 → 贴底；已解除 → 保持阅读位置（绝不拉回）。
 */
export function anchorActionAfterContentChange(following, contentWidthChanging = false) {
    return following && !contentWidthChanging ? "stickToBottom" : "hold";
}
/**
 * virtualizer 动态测高后的滚动补偿裁决。
 * 宽度 resize 会让多条消息在相邻帧分批测高；此时逐条补偿 scrollTop 会形成可见抖动。
 */
export function shouldAdjustVirtualizerForItemSizeChange(input) {
    if (input.suppressAdjustment ||
        input.following ||
        input.contentWidthChanging) {
        return false;
    }
    return input.itemEnd <= input.scrollTop;
}
/** 未观察滚动的判定容差：小于该值的 scrollTop 回退视为亚像素抖动，不算用户上滚。 */
export const UNOBSERVED_SCROLL_EPSILON_PX = 2;
/** wheel 的 deltaY 与 scrollTop 同向：负值阅读更早内容，正值靠近底部。 */
export function timelineWheelScrollIntent(deltaY) {
    if (deltaY < 0)
        return "awayFromBottom";
    if (deltaY > 0)
        return "towardBottom";
    return "none";
}
/** touch 手指位移与 scrollTop 反向：手指下移表示阅读更早内容。 */
export function timelineTouchScrollIntent(previousClientY, nextClientY) {
    if (nextClientY > previousClientY)
        return "awayFromBottom";
    if (nextClientY < previousClientY)
        return "towardBottom";
    return "none";
}
/** 键盘滚动意图；输入控件内的光标按键不属于 timeline 滚动。 */
export function timelineKeyboardScrollIntent(input) {
    if (input.editableTarget)
        return "none";
    if (input.key === "ArrowUp" ||
        input.key === "PageUp" ||
        input.key === "Home") {
        return "awayFromBottom";
    }
    if (input.key === "ArrowDown" ||
        input.key === "PageDown" ||
        input.key === "End") {
        return "towardBottom";
    }
    if (input.key === " ") {
        return input.shiftKey ? "awayFromBottom" : "towardBottom";
    }
    return "none";
}
/**
 * 内容变化 commit 贴底前，对账用户滚动意图。
 *
 * 跟随态由 scroll 事件驱动，但 scroll 事件在滚动发生后的下一渲染帧才派发：
 * 用户上滚（wheel）或测试程序化 scrollTop 赋值之后、事件派发之前，若恰好落进一个
 * totalSize/rowCount 变化的 React commit（流式 delta、ResizeObserver 测高修正、
 * composer 尺寸变化引起的窗口重算），贴底 effect 会拿着**过期的 following=true**
 * 把 scrollTop 拽回底部，且回弹落点让随后的 scroll 事件把跟随判回 true——
 * 用户/测试的上滚被整体吞掉（“resize/测量 commit 夺走滚动权”）。
 *
 * 对账规则（在贴底动作之前执行，输入为 commit 时刻的实时指标）：
 * 1. 明确向上滚动 → 立即解除跟随，同帧 terminal/layout commit 也必须让位；
 * 2. 没有用户输入 → 原样保持 following，virtualizer/折叠导致的 scrollTop 回退不算上滚；
 * 3. 方向未知或向下的用户输入 → 落点在底则恢复跟随，明显回退则解除，其余保持。
 */
export function reconcileFollowingForContentAnchor(input) {
    const userScrollIntent = input.userScrollIntent ?? "unknown";
    if (userScrollIntent === "awayFromBottom")
        return false;
    if (userScrollIntent === "none")
        return input.following;
    if (isAtBottom(input.metrics, input.bottomEpsilonPx ?? BOTTOM_ANCHOR_EPSILON_PX)) {
        return true;
    }
    const unobservedUpscroll = input.metrics.scrollTop <
        input.lastObservedScrollTop -
            (input.scrollEpsilonPx ?? UNOBSERVED_SCROLL_EPSILON_PX);
    if (unobservedUpscroll) {
        return false;
    }
    return input.following;
}
/** 「回到底部」按钮可见性：仅在解除跟随且确实存在内容时展示。 */
export function shouldShowBackToBottom(following, rowCount) {
    return !following && rowCount > 0;
}
/** 会话切换 / 首次绑定：重置为跟随（打开会话定位到最新消息）。 */
export function initialFollowing() {
    return true;
}
/**
 * 同一稳定 key 在 prepend 后需要施加的 scrollTop 修正量。
 *
 * 触发 loadOlder 到 rows 提交之间，恢复布局或 virtualizer 可能先改写
 * scrollTop；只叠加 measurement.start 的差值会把这段中间位移重复计入。以触发瞬间
 * 保存的视口偏移计算绝对目标，再减实时 scrollTop，才能稳定恢复原阅读位置。
 */
export function prependVirtualAnchorAdjustment(previous, next, currentScrollTop) {
    if (previous.key !== next.key)
        return null;
    if (!Number.isFinite(previous.offsetTop) ||
        !Number.isFinite(next.start) ||
        !Number.isFinite(currentScrollTop)) {
        return null;
    }
    return next.start - previous.offsetTop - currentScrollTop;
}
/**
 * 前插后的 scrollTop 平移量。仅当「首行 rowId 变小」（真前插）时返回正平移；
 * 追加/替换/清空/首帧一律 null（不动滚动位置，交给底部锚定逻辑）。
 */
export function prependScrollAdjustment(input) {
    if (input.prevFirstRowId === null || input.nextFirstRowId === null) {
        return null;
    }
    if (input.nextFirstRowId >= input.prevFirstRowId)
        return null;
    const delta = input.nextTotalSize - input.prevTotalSize;
    return delta > 0 ? delta : null;
}
/** 顶部触发阈值：距顶小于该距离视为「到顶」，自动拉取更早一窗。 */
export const LOAD_OLDER_TRIGGER_PX = 64;
/** 提前两个视口补页，网络与渲染应在用户抵达窗口边界前完成。 */
export const LOAD_OLDER_PREFETCH_VIEWPORTS = 2;
export function historyPrefetchTriggerPx(viewportHeight) {
    if (!Number.isFinite(viewportHeight) || viewportHeight <= 0) {
        return LOAD_OLDER_TRIGGER_PX;
    }
    return Math.max(LOAD_OLDER_TRIGGER_PX, viewportHeight * LOAD_OLDER_PREFETCH_VIEWPORTS);
}
/** scroll 事件是否应触发 loadOlder（到顶 + 可拉 + 非在途）。 */
export function shouldTriggerLoadOlder(input) {
    return (input.canLoadOlder &&
        !input.loadingOlder &&
        input.scrollTop <= (input.triggerPx ?? LOAD_OLDER_TRIGGER_PX));
}
//# sourceMappingURL=timelineScrollAnchor.js.map