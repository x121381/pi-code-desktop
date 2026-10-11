/** 离底判定容差：小于该距离视为「在底部」。取值覆盖亚像素滚动与最后一行 padding。 */
export declare const BOTTOM_ANCHOR_EPSILON_PX = 48;
export interface TimelineScrollMetrics {
    /** 滚动容器 scrollTop。 */
    scrollTop: number;
    /** 滚动容器可视高度（clientHeight）。 */
    viewportHeight: number;
    /** 内容总高度（scrollHeight）。 */
    contentHeight: number;
}
/** 距底部的剩余可滚动距离（内容不足一屏时为 0）。 */
export declare function distanceToBottom(metrics: TimelineScrollMetrics): number;
export declare function isAtBottom(metrics: TimelineScrollMetrics, epsilonPx?: number): boolean;
/**
 * scroll 事件后的跟随态。规则：落点在底部 ⇔ 跟随。
 * 覆盖三种来源且无需区分：用户上滚（离底 → 解除）、用户滚回（贴底 → 恢复）、
 * 程序化贴底（落点即底部 → 保持）。
 */
export declare function nextFollowingAfterScroll(metrics: TimelineScrollMetrics, epsilonPx?: number): boolean;
export type TimelineScrollEventSource = "user" | "programmatic" | "layout";
/**
 * scroll 事件后的滚动权裁决。布局/程序化 scroll 不得改变用户意图；只有用户输入
 * 才按最终落点决定是否跟随。
 */
export declare function resolveFollowingAfterScroll(input: {
    following: boolean;
    metrics: TimelineScrollMetrics;
    source: TimelineScrollEventSource;
    epsilonPx?: number;
}): boolean;
/**
 * 内容变化（新行追加 / 流式 delta 撑高 / 动态测高修正）后的动作：
 * 跟随中 → 贴底；已解除 → 保持阅读位置（绝不拉回）。
 */
export declare function anchorActionAfterContentChange(following: boolean, contentWidthChanging?: boolean): "stickToBottom" | "hold";
/**
 * virtualizer 动态测高后的滚动补偿裁决。
 * 宽度 resize 会让多条消息在相邻帧分批测高；此时逐条补偿 scrollTop 会形成可见抖动。
 */
export declare function shouldAdjustVirtualizerForItemSizeChange(input: {
    following: boolean;
    suppressAdjustment: boolean;
    contentWidthChanging: boolean;
    itemEnd: number;
    scrollTop: number;
}): boolean;
/** 未观察滚动的判定容差：小于该值的 scrollTop 回退视为亚像素抖动，不算用户上滚。 */
export declare const UNOBSERVED_SCROLL_EPSILON_PX = 2;
export type TimelineUserScrollIntent = "none" | "awayFromBottom" | "towardBottom" | "unknown";
/** wheel 的 deltaY 与 scrollTop 同向：负值阅读更早内容，正值靠近底部。 */
export declare function timelineWheelScrollIntent(deltaY: number): TimelineUserScrollIntent;
/** touch 手指位移与 scrollTop 反向：手指下移表示阅读更早内容。 */
export declare function timelineTouchScrollIntent(previousClientY: number, nextClientY: number): TimelineUserScrollIntent;
/** 键盘滚动意图；输入控件内的光标按键不属于 timeline 滚动。 */
export declare function timelineKeyboardScrollIntent(input: {
    key: string;
    shiftKey: boolean;
    editableTarget: boolean;
}): TimelineUserScrollIntent;
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
export declare function reconcileFollowingForContentAnchor(input: {
    /** 当前跟随态（scroll 事件驱动的既有值）。 */
    following: boolean;
    /** commit 时刻（贴底动作前）的实时滚动指标。 */
    metrics: TimelineScrollMetrics;
    /** 组件最近一次「已账目」的 scrollTop（scroll 事件读取值或程序化写入后的回读值）。 */
    lastObservedScrollTop: number;
    /** 当前内容 commit 前捕获到的用户滚动意图；省略时按旧的未知来源对账。 */
    userScrollIntent?: TimelineUserScrollIntent;
    bottomEpsilonPx?: number;
    scrollEpsilonPx?: number;
}): boolean;
/** 「回到底部」按钮可见性：仅在解除跟随且确实存在内容时展示。 */
export declare function shouldShowBackToBottom(following: boolean, rowCount: number): boolean;
/** 会话切换 / 首次绑定：重置为跟随（打开会话定位到最新消息）。 */
export declare function initialFollowing(): boolean;
export interface PrependVirtualAnchor {
    key: string;
    /** 锚点 measurement 起点相对视口顶部的偏移。 */
    offsetTop: number;
    start: number;
}
/**
 * 同一稳定 key 在 prepend 后需要施加的 scrollTop 修正量。
 *
 * 触发 loadOlder 到 rows 提交之间，恢复布局或 virtualizer 可能先改写
 * scrollTop；只叠加 measurement.start 的差值会把这段中间位移重复计入。以触发瞬间
 * 保存的视口偏移计算绝对目标，再减实时 scrollTop，才能稳定恢复原阅读位置。
 */
export declare function prependVirtualAnchorAdjustment(previous: PrependVirtualAnchor, next: PrependVirtualAnchor, currentScrollTop: number): number | null;
export interface PrependAnchorInput {
    /** 上一 commit 的窗口首行 rowId（null = 尚无行）。 */
    prevFirstRowId: number | null;
    /** 本 commit 的窗口首行 rowId（null = 行被清空）。 */
    nextFirstRowId: number | null;
    /** 上一 commit 的虚拟列表总高度。 */
    prevTotalSize: number;
    /** 本 commit 的虚拟列表总高度。 */
    nextTotalSize: number;
}
/**
 * 前插后的 scrollTop 平移量。仅当「首行 rowId 变小」（真前插）时返回正平移；
 * 追加/替换/清空/首帧一律 null（不动滚动位置，交给底部锚定逻辑）。
 */
export declare function prependScrollAdjustment(input: PrependAnchorInput): number | null;
/** 顶部触发阈值：距顶小于该距离视为「到顶」，自动拉取更早一窗。 */
export declare const LOAD_OLDER_TRIGGER_PX = 64;
/** 提前两个视口补页，网络与渲染应在用户抵达窗口边界前完成。 */
export declare const LOAD_OLDER_PREFETCH_VIEWPORTS = 2;
export declare function historyPrefetchTriggerPx(viewportHeight: number): number;
/** scroll 事件是否应触发 loadOlder（到顶 + 可拉 + 非在途）。 */
export declare function shouldTriggerLoadOlder(input: {
    scrollTop: number;
    canLoadOlder: boolean;
    loadingOlder: boolean;
    triggerPx?: number;
}): boolean;
//# sourceMappingURL=timelineScrollAnchor.d.ts.map