import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import {} from "@/mentions/components/MentionPanel.js";
export function useSlashCommandMentionPanelSections(intl, commandsLength, filteredCommandSuggestions, filteredSkillSuggestions, skillsLoading, skillsError, filteredSubagentSuggestions, subagentsLoading, subagentsError) {
    return useMemo(() => [
        {
            id: "commands",
            title: intl.formatMessage({ id: "chat.slash.commands.title" }),
            options: filteredCommandSuggestions.map((suggestion) => ({
                id: suggestion.id,
                label: `/${suggestion.value}`,
                description: suggestion.description,
                content: (_jsxs("span", { className: "min-w-0 flex-1 flex items-center gap-2", children: [_jsx("span", { className: "truncate text-ui-base font-medium text-foreground max-w-[40%]", children: `/${suggestion.value}` }), _jsx("span", { className: "truncate text-ui-base text-foreground-subtlest flex-1", children: suggestion.description })] })),
            })),
            loading: false,
            emptyText: commandsLength === 0
                ? intl.formatMessage({ id: "chat.slash.emptyUnavailable" })
                : intl.formatMessage({ id: "chat.slash.emptyResults" }),
        },
        {
            id: "skills",
            title: intl.formatMessage({ id: "chat.slash.skills.title" }),
            options: filteredSkillSuggestions.map((suggestion) => ({
                id: suggestion.id,
                label: `$${suggestion.value}`,
                description: suggestion.description,
                content: (_jsxs("span", { className: "min-w-0 flex-1 flex items-center gap-2", children: [_jsx("span", { className: "truncate text-ui-base font-medium text-foreground max-w-[40%]", children: `$${suggestion.value}` }), _jsx("span", { className: "truncate text-ui-base text-foreground-subtlest flex-1", children: suggestion.description })] })),
            })),
            loading: skillsLoading,
            loadingText: intl.formatMessage({ id: "chat.mention.category.loading" }),
            emptyText: intl.formatMessage({ id: "chat.slash.skills.empty" }),
            errorText: skillsError,
        },
        {
            id: "subagents",
            title: intl.formatMessage({ id: "chat.slash.subagents.title" }),
            options: filteredSubagentSuggestions.map((suggestion) => ({
                id: suggestion.id,
                label: suggestion.value,
                description: suggestion.description,
                content: (_jsxs("span", { className: "min-w-0 flex-1 flex items-center gap-2", children: [_jsx("span", { className: "truncate text-ui-base font-medium text-foreground max-w-[40%]", children: suggestion.value }), _jsx("span", { className: "truncate text-ui-base text-foreground-subtlest flex-1", children: suggestion.description })] })),
            })),
            loading: subagentsLoading,
            emptyText: intl.formatMessage({ id: "chat.slash.subagents.empty" }),
            errorText: subagentsError,
        },
    ], [
        commandsLength,
        filteredCommandSuggestions,
        filteredSkillSuggestions,
        filteredSubagentSuggestions,
        intl,
        skillsError,
        skillsLoading,
        subagentsError,
        subagentsLoading,
    ]);
}
//# sourceMappingURL=slashCommandPanelSections.js.map