export const DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS = "NAVIGATE:AUTOMATIONS";
export const DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS_OFFPEAK = "NAVIGATE:AUTOMATIONS:OFFPEAK";
export function parseDraftSuggestedPromptActions(onFinish) {
    if (!onFinish)
        return [];
    const actions = [];
    for (const token of onFinish.split(",")) {
        switch (token.trim()) {
            case DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS:
                if (!actions.includes(DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS)) {
                    actions.push(DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS);
                }
                break;
            case DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS_OFFPEAK:
                if (!actions.includes(DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS_OFFPEAK)) {
                    actions.push(DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS_OFFPEAK);
                }
                break;
            default:
                break;
        }
    }
    return actions;
}
function findDefaultItem(scene, promptItem) {
    for (const [optionKey, itemIds] of Object.entries(promptItem.defaults ?? {})) {
        const optionItems = scene.options[optionKey]?.items;
        if (!optionItems)
            continue;
        for (const itemId of itemIds) {
            const item = optionItems.find((candidate) => candidate.id === itemId);
            if (item)
                return item;
        }
    }
    return undefined;
}
export function mapClientScenesToDraftSuggestedPromptItems(scenes) {
    const scene = scenes.find((candidate) => candidate.scene === "draft-suggestion");
    const promptItems = scene?.options.prompts?.items;
    if (!scene || !promptItems)
        return [];
    return promptItems.map((item) => {
        const defaultItem = findDefaultItem(scene, item);
        const actions = parseDraftSuggestedPromptActions(item.on_finish);
        const stableId = defaultItem?.contents.en?.trim() || defaultItem?.contents.cn?.trim();
        return {
            id: item.id,
            ...(item.img?.trim() ? { iconName: item.img.trim() } : {}),
            label: item.labels,
            prompt: item.contents,
            ...(actions.length > 0 ? { actions } : {}),
            ...(defaultItem && stableId
                ? {
                    plugin: {
                        stableId,
                        label: defaultItem.labels,
                    },
                }
                : {}),
        };
    });
}
export function resolveDraftSuggestedPromptText(text, locale) {
    const primary = locale.startsWith("zh") ? text.cn : text.en;
    const fallback = locale.startsWith("zh") ? text.en : text.cn;
    return primary?.trim() || fallback?.trim() || "";
}
//# sourceMappingURL=draftSuggestedPromptItems.js.map