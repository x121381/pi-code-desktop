import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { renderProviderCliIcon } from "@/lib/providerCliIcon.js";
function getSelectionKey(agent, category) {
    return `${agent}:${category}`;
}
const CATEGORY_ORDER = ["providers", "skills"];
function unionCategories(agents) {
    const found = new Set();
    for (const agent of agents) {
        for (const c of agent.categories) {
            found.add(c.category);
        }
    }
    return CATEGORY_ORDER.filter((c) => found.has(c));
}
function agentsWithCategory(agents, category) {
    return agents.filter((a) => a.categories.some((c) => c.category === category));
}
function formatAgentName(agent, intl) {
    switch (agent) {
        case "zcode":
            return intl.formatMessage({ id: "settingsSync.agent.zcode" });
        case "claudeCode":
            return intl.formatMessage({ id: "settingsSync.agent.claudeCode" });
        case "codexCli":
            return intl.formatMessage({ id: "settingsSync.agent.codexCli" });
        case "openCode":
            return intl.formatMessage({ id: "settingsSync.agent.openCode" });
        case "agents":
            return intl.formatMessage({ id: "settingsSync.agent.agents" });
        default:
            return agent;
    }
}
function formatCategoryName(category, intl) {
    switch (category) {
        case "providers":
            return intl.formatMessage({ id: "settingsSync.category.providers" });
        case "skills":
            return intl.formatMessage({ id: "settingsSync.category.skills" });
        default:
            return category;
    }
}
function formatCategoryDescription(category, intl) {
    switch (category) {
        case "providers":
            return intl.formatMessage({
                id: "settingsSync.category.providers.description",
            });
        case "skills":
            return intl.formatMessage({
                id: "settingsSync.category.skills.description",
            });
        default:
            return intl.formatMessage({
                id: "settingsSync.category.default.description",
            });
    }
}
/**
 * Onboarding 代理设置：与 MCP 平级的可勾选分类列表（当前仅模型供应商）；每类下为各 Agent。
 */
export function SettingsSyncSelectionStep(props) {
    const { intl } = useZCodeIntl();
    const selected = useMemo(() => new Set(props.selectedKeys), [props.selectedKeys]);
    const agents = props.discovery.agents;
    const categoriesInOrder = useMemo(() => unionCategories(agents), [agents]);
    return (_jsx("div", { className: "flex w-full flex-col gap-4", children: categoriesInOrder.map((category) => {
            const agentsForCategory = agentsWithCategory(agents, category);
            const total = agentsForCategory.length;
            const selectedForCategory = agentsForCategory.filter((agent) => selected.has(getSelectionKey(agent.agent, category))).length;
            const allSelected = total > 0 && selectedForCategory === total;
            const partiallySelected = total > 0 && selectedForCategory > 0 && selectedForCategory < total;
            return (_jsxs("div", { className: "flex w-full flex-col gap-1", children: [_jsxs("div", { className: "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-surface-hover/50", children: [_jsx("button", { type: "button", className: "flex size-5 shrink-0 items-center justify-start", disabled: total === 0, "aria-label": intl.formatMessage({ id: "onboarding.agentSettings.categoryToggleAllAria" }, { category: formatCategoryName(category, intl) }), onClick: (event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    props.onSetCategorySelectionAllAgents(category, !allSelected);
                                }, children: _jsx("div", { className: cn("flex size-4 items-center justify-center rounded-sm border border-border", allSelected && "border-primary bg-primary text-primary-foreground", partiallySelected &&
                                        !allSelected &&
                                        "border-primary bg-primary/20 text-primary"), children: allSelected ? (_jsx(CheckIcon, { className: "size-3.5" })) : partiallySelected ? (_jsx(MinusIcon, { className: "size-3.5" })) : null }) }), _jsx("div", { className: "min-w-0 flex-1", children: _jsxs("div", { className: "flex items-center gap-2 text-ui-base", children: [_jsx("div", { className: "text-ui-base font-medium leading-none text-foreground", children: formatCategoryName(category, intl) }), _jsx("div", { className: "min-w-0 truncate text-foreground-subtle", children: formatCategoryDescription(category, intl) })] }) })] }), _jsx("div", { className: "ml-5 flex flex-col gap-1 border-l border-border py-1 pl-4", children: agentsForCategory.map((agent) => {
                            const key = getSelectionKey(agent.agent, category);
                            const checked = selected.has(key);
                            return (_jsxs("button", { type: "button", onClick: () => props.onToggleSelection(key), className: cn("flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors", "hover:bg-surface-hover/50"), children: [_jsx("div", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx("div", { className: cn("flex size-4 items-center justify-center rounded-sm border border-border", checked && "border-primary bg-primary text-primary-foreground"), children: checked ? _jsx(CheckIcon, { className: "size-3.5" }) : null }) }), _jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-2", children: [renderProviderCliIcon("glm", "size-4 shrink-0 text-foreground"), _jsx("div", { className: "min-w-0 flex-1", children: _jsx("div", { className: "text-ui-base font-medium leading-none text-foreground", children: formatAgentName(agent.agent, intl) }) })] })] }, key));
                        }) })] }, category));
        }) }));
}
//# sourceMappingURL=SettingsSyncSelectionStep.js.map