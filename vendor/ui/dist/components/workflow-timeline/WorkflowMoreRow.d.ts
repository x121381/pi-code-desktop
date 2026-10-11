import type { RosterCounts, RosterMore } from "./roster-model.js";
/**
 * 「还有 n 个」那一行：卡上名册站
 * 钉住五枚药丸之后的第六枚——同高、同底色、同内距、同圆角、同一套悬停语法。内容是三张脸一叠（其余里
 * 最要紧的三个，表情自带状态）、`还有 n 个`、藏着失败时一枚红色 `✕ n`、尾槽里常驻的 ↗。
 *
 * 它是一扇门不是状态：点一下开运行侧栏、落到这一站、把清单展开（`onOpen` 由卡接到 `onSelectStation`）。
 * 没有状态标记可让位，所以 ↗ 不等悬停就在（空尾槽读作「这里没东西」）。没有回调时是静态的 span。
 *
 * 侧板上同一具身体是**门**（`door` 在场）：尾槽里换成下箭头，原地开合。
 * 关着时带其余人的计数行（藏着失败时红的就在计数行里，不再另挂 `✕ n`）；开着时计数行搬进名单的
 * 组头，这一行只剩人数、底色抬一级、名字转前景。
 */
export declare function WorkflowMoreRow({ door, enterDelayMs, more, onOpen, }: {
    more: RosterMore;
    /** 入场延迟（跟在钉住的药丸之后落地）；缺席即立刻。 */
    enterDelayMs?: number;
    /** 在场即整行是按钮（回调的存在即门控）。 */
    onOpen?: () => void;
    /** 门的形态（侧板）：开合状态与其余人的计数。缺席即卡上那一行（↗ 常驻）。 */
    door?: {
        open: boolean;
        tally: RosterCounts;
    };
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowMoreRow.d.ts.map