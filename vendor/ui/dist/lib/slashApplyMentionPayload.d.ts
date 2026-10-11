import type { PromptInputSuggestionItem } from "@/lib/promptInputTriggers.js";
import type { PromptMentionPayload } from "@/mentions/nodes/PromptMentionNode.js";
/** 将 `/` 面板选中的建议转成 PromptMention 载荷；skill/subagent 仍复用既有 $skill 与 @agent markdown 语义。 */
export declare function buildSlashApplyMentionPayload(suggestion: PromptInputSuggestionItem): PromptMentionPayload;
//# sourceMappingURL=slashApplyMentionPayload.d.ts.map