import type { AttachmentHoverCardContentProps } from "@/components/ai-elements/attachments.js";
import { type PluginUiModelContext } from "../domain/pluginUiModelContext.js";
export declare const TID_PLUGIN_UI_MODEL_CONTEXT_CHIP = "plugin-ui-model-context-chip";
/** composer 与历史用户消息共用的"插件上下文"pill；与 WebElementContextAttachmentChip 同构。 */
export declare function PluginUiModelContextChip({ contexts, contentAlign, onRemove, onRemoveAll, }: {
    contexts: readonly PluginUiModelContext[];
    contentAlign?: AttachmentHoverCardContentProps["align"];
    onRemove?: (id: string) => void;
    onRemoveAll?: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=PluginUiModelContextChip.d.ts.map