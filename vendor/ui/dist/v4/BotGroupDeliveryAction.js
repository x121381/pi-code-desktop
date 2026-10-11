import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DeliveryContext } from "../v4/botGroupDeliveryContext.js";
import { useContext, useMemo } from "react";
import { CircleAlertIcon } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { useBotGroupTask } from "../hooks/useBotGroupTask.js";
import { useBotGroupMemberNames } from "../hooks/useBotGroupMemberNames.js";
import { BotGroupMemberNamesContext } from "../v4/BotGroupMemberNamesContext.js";
export function BotGroupDeliveryProvider({ taskId, workspacePath, workspaceIdentity, children, }) {
    // 同一任务只订阅一次群状态，历史回复不各自请求全量 Bot 状态。
    const { context, provider, busyId, retry, reconcile, retryPreparation } = useBotGroupTask(taskId, workspacePath, workspaceIdentity);
    const memberNames = useBotGroupMemberNames(context);
    const value = useMemo(() => ({
        context,
        provider,
        busyId,
        retry,
        reconcile,
        retryPreparation,
        taskId,
    }), [context, provider, busyId, retry, reconcile, retryPreparation, taskId]);
    return (_jsx(DeliveryContext.Provider, { value: value, children: _jsx(BotGroupMemberNamesContext.Provider, { value: memberNames, children: children }) }));
}
export function BotGroupDeliveryAction({ turnId, sourceCommandIds, syncing, results, busyId, onRetry, onReconcile, }) {
    const { intl } = useZCodeIntl();
    // Bug 原因：任务级恢复面板与队列浮层重叠，还重复展示正文；只在已关联轮次的操作栏展示。
    const unresolved = results.filter((result) => result.sourceCommandId &&
        sourceCommandIds.includes(result.sourceCommandId) &&
        (result.status === "failed" || result.status === "unknown"));
    if (!unresolved.length)
        return null;
    const label = intl.formatMessage({
        id: unresolved.some((result) => result.status === "unknown")
            ? "bots.group.deliveryUnknown"
            : "bots.group.deliveryFailed",
    });
    return (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon-xs", className: "text-warning", "aria-label": label, title: label, "data-bot-group-delivery": turnId, children: _jsx(CircleAlertIcon, { className: "size-3.5" }) }) }), _jsx(PopoverContent, { align: "end", className: "max-w-[calc(100vw-2rem)] gap-2", "data-bot-group-delivery-actions": turnId, children: unresolved.map((result, index) => (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("span", { className: "text-ui-sm text-foreground-subtle", children: [intl.formatMessage({
                                    id: result.status === "unknown"
                                        ? "bots.group.deliveryUnknown"
                                        : "bots.group.deliveryFailed",
                                }), unresolved.length > 1 ? ` (${index + 1}/${unresolved.length})` : null] }), syncing ? (_jsx("div", { className: "flex flex-wrap gap-1", children: result.status === "unknown" ? (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", size: "xs", disabled: busyId === result.id, onClick: () => onReconcile(result.id, true), children: intl.formatMessage({ id: "bots.group.confirmReceived" }) }), _jsx(Button, { variant: "ghost", size: "xs", disabled: busyId === result.id, onClick: () => onReconcile(result.id, false), children: intl.formatMessage({ id: "bots.group.confirmNotReceived" }) })] })) : (_jsx(Button, { variant: "ghost", size: "xs", disabled: busyId === result.id, onClick: () => onRetry(result.id), children: intl.formatMessage({ id: "bots.group.resend" }) })) })) : null] }, result.id))) })] }));
}
export function ConnectedBotGroupDeliveryAction({ turnId, sourceCommandIds, }) {
    const value = useContext(DeliveryContext);
    const context = value?.context;
    if (!value || !context?.group)
        return null;
    return (_jsx(BotGroupDeliveryAction, { turnId: turnId, sourceCommandIds: sourceCommandIds, syncing: context.group.enabled && context.activeTaskId === value.taskId, results: Object.values(context.group.deliveries ?? {}).filter((result) => result.taskId === value.taskId), busyId: value.busyId, onRetry: (id) => {
            void value.retry(id);
        }, onReconcile: (id, received) => {
            void value.reconcile(id, received);
        } }));
}
//# sourceMappingURL=BotGroupDeliveryAction.js.map