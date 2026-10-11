import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TID_MODEL_PROVIDER_ADD_PROVIDER_BUTTON } from "@zcode/shared";
import { ModelProviderSectionNavigation } from "../../settings/model-provider-section/Navigation.js";
import { ProviderDetailFeedbackBoundary } from "../../settings/model-provider-section/ProviderDetailFeedback.js";
import { SettingsResourceHeaderActions } from "../../settings/SettingsResourceHeaderActions.js";
export function shouldShowModelProviderRefreshLoading(params) {
    return params.presetLoading || params.customLoading;
}
export function ModelProviderSectionLayout({ description, refreshLabel, loadingLabel, presetLoading, customLoading, onRefresh, addProviderLabel, onAddProvider, navigationGroups, selectedNodeKey, onSelectNavItem, onReorderProviderIds, reorderableProviderIds, children, }) {
    const refreshButtonLoading = shouldShowModelProviderRefreshLoading({
        presetLoading,
        customLoading,
    });
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsx("p", { className: "text-ui-base leading-6 text-foreground-subtle", children: description }), _jsx(SettingsResourceHeaderActions, { onRefresh: onRefresh, onNew: onAddProvider, refreshing: refreshButtonLoading, refreshLabel: refreshButtonLoading ? loadingLabel : refreshLabel, newLabel: addProviderLabel, newTestId: TID_MODEL_PROVIDER_ADD_PROVIDER_BUTTON })] }), _jsx("div", { className: "overflow-clip rounded-xl border border-border bg-card", children: _jsxs("div", { className: "grid min-h-[36rem] grid-cols-[56px_minmax(0,1fr)] gap-0 md:grid-cols-[224px_minmax(0,1fr)]", "data-model-provider-split-panel": "true", children: [_jsx("div", { className: "min-w-0 border-r border-border", "data-model-provider-navigation-scroll": "true", children: _jsx(ModelProviderSectionNavigation, { navigationGroups: navigationGroups, selectedNodeKey: selectedNodeKey, presetLoading: presetLoading, customLoading: customLoading, onSelectNavItem: onSelectNavItem, onReorderProviderIds: onReorderProviderIds, reorderableProviderIds: reorderableProviderIds }) }), _jsx("div", { className: "relative min-w-0 p-4 pb-20 sm:p-6 sm:pb-24", "data-model-provider-detail-scroll": "true", children: _jsx(ProviderDetailFeedbackBoundary, { children: children }, selectedNodeKey ?? "unselected-provider") })] }) })] }));
}
//# sourceMappingURL=SectionLayout.js.map