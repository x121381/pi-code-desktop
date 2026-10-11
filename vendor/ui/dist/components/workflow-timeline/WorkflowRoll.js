import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from "react";
import { CircleCheckIcon, CircleXIcon, LoaderCircleIcon } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
/**
 * 门后的名单：侧板名册站里没被钉住
 * 的人，每人一次，按状态分组、组序即注意力序（failed → running → pending → done），组内参与者序。
 * 组头是计数行的那一项——图标、人数、状态词、语义色，右边一条细线拉到边——所以门开着时计数行不必
 * 再出现一次。行由调用方渲染（各面自己的接线），这里只排两列、发入场延迟。
 *
 * 表外的那些（`unlisted`）没有行可落：门与计数行算了它们，名单只能在末尾用一行淡字交代这个差额，
 * 而不是假装那些行在（追记「表外的那些」）。
 */
/** 行依次落地：每行 8 ms、封顶 400 ms（沿用格子的节奏；30 ms 的药丸节奏对一卷名单太慢）。 */
export const ROW_STAGGER_MS = 8;
export const ROW_STAGGER_CAP_MS = 400;
const GROUP_TONE = {
    done: "text-success",
    failed: "text-destructive",
    pending: "text-foreground-subtlest",
    running: "text-warning",
};
function GroupIcon({ status }) {
    if (status === "done")
        return _jsx(CircleCheckIcon, { "aria-hidden": true, className: "size-2.5" });
    if (status === "running") {
        return (_jsx(LoaderCircleIcon, { "aria-hidden": true, className: "size-2.5 animate-spin motion-reduce:animate-none" }));
    }
    if (status === "failed")
        return _jsx(CircleXIcon, { "aria-hidden": true, className: "size-2.5" });
    return _jsx("span", { "aria-hidden": true, className: "size-2 rounded-full border-[1.5px] border-current" });
}
export function WorkflowRoll({ groups, renderRow, unlisted = 0, }) {
    const { intl } = useZCodeIntl();
    let index = 0;
    return (_jsxs("div", { className: "wf-unfold grid grid-cols-2 gap-x-2 pt-0.5", "data-testid": "workflow-roster-roll", children: [groups.map((group) => {
                const label = intl.formatMessage({ id: `chat.toolCall.workflow.timeline.roster.${group.status}` }, { count: group.pills.length });
                // 两种语言的词条都以人数开头（`{count} done` / `{count} 个已完成`）：人数加粗、其余照常。
                const split = /^(\d+)(.*)$/.exec(label);
                return (_jsxs(Fragment, { children: [_jsxs("div", { "aria-level": 4, className: cn("col-span-2 mt-1 flex h-[22px] items-center gap-[5px] pl-1 font-mono text-ui-xs leading-none tabular-nums first:mt-0", GROUP_TONE[group.status]), "data-roll-group": group.status, "data-testid": "workflow-roll-heading", role: "heading", children: [_jsx(GroupIcon, { status: group.status }), split === null ? (_jsx("span", { children: label })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "font-medium", children: split[1] }), _jsx("span", { children: split[2].trim() })] })), _jsx("span", { "aria-hidden": true, className: "ml-[3px] h-px flex-1 bg-border" })] }), group.pills.map((pill) => renderRow(pill, Math.min(ROW_STAGGER_MS * index++, ROW_STAGGER_CAP_MS)))] }, group.status));
            }), unlisted <= 0 ? null : (_jsx("p", { className: "col-span-2 mt-1.5 min-w-0 text-ui-xs text-foreground-subtlest", "data-testid": "workflow-roll-unlisted", children: intl.formatMessage({
                    id: unlisted === 1
                        ? "chat.toolCall.workflow.timeline.roster.unlisted.one"
                        : "chat.toolCall.workflow.timeline.roster.unlisted.many",
                }, { count: unlisted }) }))] }));
}
//# sourceMappingURL=WorkflowRoll.js.map