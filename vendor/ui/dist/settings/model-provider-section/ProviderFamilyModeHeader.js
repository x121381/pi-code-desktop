import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { TID_MODEL_PROVIDER_CONNECTION_MODE_ITEM, TID_MODEL_PROVIDER_CONNECTION_MODE_TRIGGER, resolveModelProviderFamilySpecByProviderId, isStartPlanModelProviderId, testId, } from "@zcode/shared";
import { InfoIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { connectionSelectionMatchesNavigationItem } from "@/settings/model-provider-section/useModelProviderNavigation.js";
import { resolveModelProviderNavLogo } from "@/settings/model-provider-section/utils.js";
import { ProviderLogo } from "./ProviderLogo.js";
export function ProviderFamilyDetailShell({ header, children, }) {
    if (!header) {
        return children;
    }
    return (_jsxs("div", { className: "flex min-w-0 flex-col gap-4", children: [header, children] }));
}
export function ProviderFamilyHeader({ selectedNavItem, trailingAction, }) {
    if (!selectedNavItem) {
        return null;
    }
    const providerId = selectedNavItem.type === "preset" ||
        selectedNavItem.type === "codingPlan" ||
        selectedNavItem.type === "teamPlan"
        ? selectedNavItem.presetId
        : null;
    if (!providerId) {
        return null;
    }
    const familySpec = resolveModelProviderFamilySpecByProviderId(providerId);
    if (!familySpec) {
        return null;
    }
    return (_jsxs("div", { className: "flex h-8 min-w-0 flex-wrap items-center justify-between gap-2", children: [_jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-2", children: [_jsx(ProviderLogo, { logo: resolveModelProviderNavLogo(selectedNavItem), className: "size-5" }), _jsx("h3", { className: "truncate text-ui-lg font-medium text-foreground", children: selectedNavItem.type === "codingPlan" && isStartPlanModelProviderId(providerId)
                            ? "Start Plan"
                            : familySpec.label })] }), trailingAction ? (_jsx("div", { className: "min-w-0 max-w-full flex-1 basis-64", children: trailingAction })) : null] }));
}
export function ProviderFamilyPlanModeSwitch({ selectedNavItem, navigationItems, connectionSettingsFailed = false, connectionSelections, onSelectNavItem, }) {
    const { intl } = useZCodeIntl();
    if (!selectedNavItem || !onSelectNavItem) {
        return null;
    }
    const providerId = selectedNavItem.type === "preset" ||
        selectedNavItem.type === "codingPlan" ||
        selectedNavItem.type === "teamPlan"
        ? selectedNavItem.presetId
        : null;
    if (!providerId ||
        (selectedNavItem.type === "codingPlan" && isStartPlanModelProviderId(providerId))) {
        return null;
    }
    const familySpec = resolveModelProviderFamilySpecByProviderId(providerId);
    if (!familySpec) {
        return null;
    }
    const options = buildProviderFamilyConnectionOptions({
        familyId: familySpec.id,
        navigationItems,
        startPlanLabel: intl.formatMessage({
            id: "settings.modelProvider.connectionMode.startPlan",
        }),
        codingPlanLabel: intl.formatMessage({
            id: "settings.modelProvider.connectionMode.codingPlan",
        }),
        teamPlanFallbackLabel: intl.formatMessage({
            id: "settings.modelProvider.connectionMode.teamPlan",
        }),
    });
    if (options.length === 0) {
        return null;
    }
    // 团队导航条目可能复用个人 provider；选中身份只来自已保存／提交中的付费选择。
    const selection = connectionSelections?.[familySpec.id];
    const selectedOption = selection
        ? options.find((option) => connectionSelectionMatchesNavigationItem(familySpec.id, selection, option.item))
        : undefined;
    if (options.length === 1 && selectedOption)
        return null;
    const connectionModeLabel = intl.formatMessage({
        id: connectionSettingsFailed
            ? "settings.modelProvider.connectionMode.loadFailed"
            : "settings.modelProvider.connectionMode",
    });
    return (_jsxs("div", { className: "flex min-w-0 flex-wrap items-center justify-end gap-2", children: [_jsxs("span", { className: [
                    "inline-flex min-w-0 shrink-0 items-center gap-1 text-ui-base",
                    connectionSettingsFailed ? "text-warning" : "text-foreground-subtle",
                ].join(" "), children: [connectionSettingsFailed ? _jsx(InfoIcon, { className: "size-3.5 shrink-0" }) : null, _jsx("span", { className: "truncate", children: connectionModeLabel })] }), _jsxs(Select, { value: selectedOption?.key ?? "", onValueChange: (optionKey) => {
                    const option = options.find((item) => item.key === optionKey);
                    if (!option) {
                        return;
                    }
                    onSelectNavItem(option.item);
                }, children: [_jsx(SelectTrigger, { size: "lg", 
                        // 固定最大宽度会在宽屏仍截断全称；先占用剩余空间，只有不足控件基本宽度时才换行。
                        className: "min-w-0 max-w-fit flex-1 basis-12 justify-between", "aria-label": connectionModeLabel, "data-testid": TID_MODEL_PROVIDER_CONNECTION_MODE_TRIGGER, children: _jsx(SelectValue, { className: "min-w-0 flex-1", placeholder: intl.formatMessage({
                                id: "settings.modelProvider.codingPlan.purchase.selectPlan",
                            }), children: selectedOption ? (_jsx("span", { className: "min-w-0 truncate text-left", children: selectedOption.label })) : null }) }), _jsx(SelectContent, { position: "popper", align: "end", className: "min-w-40 max-w-[calc(100vw-2rem)]", children: options.map((option) => (_jsx(SelectItem, { value: option.key, className: "min-w-0 whitespace-normal pr-8 [overflow-wrap:anywhere]", "data-testid": testId(TID_MODEL_PROVIDER_CONNECTION_MODE_ITEM, option.key), children: option.label }, option.key))) })] })] }));
}
export function buildProviderFamilyConnectionOptions({ familyId, navigationItems, codingPlanLabel, teamPlanFallbackLabel, }) {
    const options = [];
    for (const item of navigationItems) {
        if (item.type !== "preset" && item.type !== "codingPlan" && item.type !== "teamPlan") {
            continue;
        }
        const familySpec = resolveModelProviderFamilySpecByProviderId(item.presetId);
        if (!familySpec || familySpec.id !== familyId) {
            continue;
        }
        if (item.type === "preset" || isStartPlanModelProviderId(item.presetId))
            continue;
        if (item.type === "teamPlan") {
            options.push({
                key: item.key,
                item,
                label: formatTeamPlanConnectionLabel(item.teamPlanName, teamPlanFallbackLabel),
                order: 100 + options.length,
            });
            continue;
        }
        options.push({
            key: item.key,
            item,
            label: codingPlanLabel,
            order: 10,
        });
    }
    return options.sort((left, right) => left.order - right.order);
}
function formatTeamPlanConnectionLabel(teamPlanName, fallbackLabel) {
    const normalized = teamPlanName?.trim();
    if (!normalized) {
        return fallbackLabel;
    }
    // 团队项目名已由权益接口提供，额外拼接英文 Plan 会破坏中文和自定义名称。
    return normalized;
}
//# sourceMappingURL=ProviderFamilyModeHeader.js.map