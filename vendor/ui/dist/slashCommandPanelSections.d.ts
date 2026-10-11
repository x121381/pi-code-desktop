import type { IntlInstance } from "@/i18n/IntlProvider.js";
import type { PromptInputSuggestionItem } from "@/lib/promptInputTriggers.js";
import { type MentionPanelSection } from "@/mentions/components/MentionPanel.js";
export declare function useSlashCommandMentionPanelSections(intl: IntlInstance, commandsLength: number, filteredCommandSuggestions: PromptInputSuggestionItem[], filteredSkillSuggestions: PromptInputSuggestionItem[], skillsLoading: boolean, skillsError: string | null, filteredSubagentSuggestions: PromptInputSuggestionItem[], subagentsLoading: boolean, subagentsError: string | null): MentionPanelSection[];
//# sourceMappingURL=slashCommandPanelSections.d.ts.map