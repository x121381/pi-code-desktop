import { type StorePluginItem } from "@/settings/pluginStoreListing.js";
import type { ComposerMentionPrefill } from "@/store/zcodeSessionStoreTypes.js";
export declare function buildPluginStoreTryMention({ item, locale, }: {
    item: StorePluginItem;
    locale: string;
}): ComposerMentionPrefill;
/**
 * Plugin 商店试用与 Composer @ Picker 共用同一 canonical 引用载体。
 * 示例提示词只是紧随引用的可编辑草稿正文，不创建第二份 Plugin selection state。
 */
export declare function buildPluginStoreTryPrompt({ item, locale, prompt, }: {
    item: StorePluginItem;
    locale: string;
    prompt: string;
}): string;
//# sourceMappingURL=pluginStoreTryPrompt.d.ts.map