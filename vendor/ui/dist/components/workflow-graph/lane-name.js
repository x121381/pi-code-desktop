import { laneClassOf, MAIN_LANE_ID } from "./types.js";
import { formatNamePattern } from "./name-pattern.js";
/** 合成车道不靠名字识别：它们是「什么在这里跑」，文案固定。 */
const NAME_ID_BY_CLASS = {
    unresolved: "chat.toolCall.workflow.graph.lane.unresolved",
    workspace: "chat.toolCall.workflow.graph.lane.script",
};
export function laneDisplayName(lane, formatMessage) {
    const classNameId = NAME_ID_BY_CLASS[lane.laneClass];
    if (classNameId !== undefined)
        return formatMessage({ id: classNameId });
    // 作者原词原样显示：本地化它就是改作者的话。
    if (lane.name !== undefined)
        return lane.name;
    // 名字是插值出来的：形状仍然是作者的话，所以同样不本地化，只是补一个省略号。
    const patterned = formatNamePattern(lane.namePattern);
    if (patterned !== undefined)
        return patterned;
    // 编号只在需要区分时才出现：图里只有一条匿名车道，「未命名智能体 1」里的 1 什么也没说。
    return lane.anonymousIndex === undefined
        ? formatMessage({ id: "chat.toolCall.workflow.graph.lane.anonymous" })
        : formatMessage({ id: "chat.toolCall.workflow.graph.lane.anonymousIndexed" }, { index: lane.anonymousIndex });
}
/**
 * 1-based 序号，按车道顺序发给「没有名字的 agent 车道」，且只在并存两条以上时才发：
 * 图里只有一条匿名车道时，「未命名智能体 1」里的 1 没有区分对象，只是噪声。
 *
 * **带 pattern 的车道算「有名字」**，不进这份计数：它头上写着「研究员…」，再挂一个匿名序号
 * 只会让序号与画面上看得见的匿名车道数量对不上。两条 pattern 恰好相同时会撞名——那和两条
 * 都字面叫 `"worker"` 的车道撞名是同一件事，这里不欠新的消歧。
 *
 * 计数与语言无关，所以它属于这一层（并且可单测）；文案本身在渲染时才成型。
 */
function anonymousLaneIndexes(lanes) {
    const anonymous = lanes.filter((lane) => lane.name === undefined &&
        formatNamePattern(lane.namePattern) === undefined &&
        laneClassOf(lane.id) === "agent" &&
        // 主代理的车道从不画出来：算进来，唯一一条真匿名车道就会平白带上「1」。
        lane.id !== MAIN_LANE_ID);
    if (anonymous.length < 2)
        return new Map();
    return new Map(anonymous.map((lane, index) => [lane.id, index + 1]));
}
/**
 * 车道 id → 命名素材（不是显示串）。
 *
 * 三个消费者共用这一份：图的名册、step 卡片的候选车道、以及 transcript 下钻的实例选择器。
 * **必须同源**——匿名编号是「图里第几条匿名车道」，各算一次总有一天不相等，表现是选择器里的
 * 「未命名智能体 2」对着图上的「未命名智能体 1」。
 *
 * 它住在这里而不是投影层（flow-elements.ts），是为了让不画图的消费者（下钻解析是纯函数）
 * 不必为一份命名素材把 React Flow 拖进依赖里。图里没有的车道 id 由调用方兜底成
 * `{id, laneClass}`：站点特化之类的将来变化不该让下钻崩掉。
 */
export function laneRefsById(lanes) {
    const anonymousIndexes = anonymousLaneIndexes(lanes);
    return new Map(lanes.map((lane) => {
        const anonymousIndex = anonymousIndexes.get(lane.id);
        return [
            lane.id,
            {
                id: lane.id,
                laneClass: laneClassOf(lane.id),
                ...(lane.name === undefined ? {} : { name: lane.name }),
                ...(lane.namePattern === undefined ? {} : { namePattern: lane.namePattern }),
                ...(anonymousIndex === undefined ? {} : { anonymousIndex }),
            },
        ];
    }));
}
//# sourceMappingURL=lane-name.js.map