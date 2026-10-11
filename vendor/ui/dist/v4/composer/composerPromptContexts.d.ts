import { type CodeCommentComposerAttachment } from "@/lib/codeCommentContext.js";
import { type ConversationSelectionDisplayReference } from "@/lib/conversationSelectionReference.js";
import { type WebElementContextComposerAttachment } from "@/lib/webElementContext.js";
import { type PptxElementReference } from "@/lib/pptxElementReference.js";
import { type PluginUiModelContext } from "@/plugin-ui/index.js";
export interface ComposerPromptContexts {
    codeComments: readonly CodeCommentComposerAttachment[];
    conversationSelections: readonly ConversationSelectionDisplayReference[];
    webElements: readonly WebElementContextComposerAttachment[];
    pptxElements: readonly PptxElementReference[];
    /** 插件 UI 经 ui/update-model-context 附加；缺省视为空。 */
    pluginUiContexts?: readonly PluginUiModelContext[];
}
export declare function countComposerPromptContexts(contexts: {
    codeComments: readonly unknown[];
    conversationSelections: readonly unknown[];
    webElements: readonly unknown[];
    pptxElements: readonly unknown[];
    pluginUiContexts?: readonly unknown[];
}): number;
/**
 * 五类 context parser 都只识别 prompt 尾块，因此序列化顺序和解析顺序必须严格相反。
 * 插件上下文最后序列化（最外层），解析时最先剥离。
 */
export declare function serializeComposerPromptContexts(text: string, contexts: ComposerPromptContexts): string;
export declare function parseComposerPromptContexts(content: string, workspace: {
    workspacePath: string;
    workspaceIdentity?: string;
}): {
    visibleContent: string;
    codeComments: CodeCommentComposerAttachment[];
    conversationSelections: readonly ConversationSelectionDisplayReference[];
    webElements: WebElementContextComposerAttachment[];
    pptxElements: PptxElementReference[];
    pluginUiContexts: PluginUiModelContext[];
};
//# sourceMappingURL=composerPromptContexts.d.ts.map