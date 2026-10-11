import { buildPluginMentionMarkdown } from "../mentions/mentionMarkdown.js";
import { resolveItemDisplayName } from "../settings/pluginStoreListing.js";
export function buildPluginStoreTryMention({ item, locale, }) {
    const label = resolveItemDisplayName(item, locale);
    return {
        id: `plugin:${item.id}`,
        category: "plugins",
        label,
        value: item.id,
        markdown: buildPluginMentionMarkdown(label, item.id),
        data: {
            pluginId: item.id,
            ...(item.listing?.icon ? { icon: item.listing.icon } : {}),
        },
    };
}
/**
 * Plugin 商店试用与 Composer @ Picker 共用同一 canonical 引用载体。
 * 示例提示词只是紧随引用的可编辑草稿正文，不创建第二份 Plugin selection state。
 */
export function buildPluginStoreTryPrompt({ item, locale, prompt, }) {
    const pluginMention = buildPluginStoreTryMention({ item, locale }).markdown;
    const normalizedPrompt = prompt.trim();
    return normalizedPrompt ? `${pluginMention} ${normalizedPrompt}` : pluginMention;
}
//# sourceMappingURL=pluginStoreTryPrompt.js.map