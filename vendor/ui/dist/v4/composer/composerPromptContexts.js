import { buildPromptWithCodeComments, parsePromptCodeComments, } from "@/lib/codeCommentContext.js";
import { stripGenUiModelContext } from "@zcode/shared/gen-ui";
import { buildPromptWithConversationSelections, parsePromptConversationSelections, } from "@/lib/conversationSelectionReference.js";
import { buildPromptWithWebElementContexts, parsePromptWebElementContexts, } from "@/lib/webElementContext.js";
import { buildPromptWithPptxElementReferences, parsePromptPptxElementReferences, } from "@/lib/pptxElementReference.js";
import { buildPromptWithPluginUiContexts, parsePromptPluginUiContexts, } from "@/plugin-ui/index.js";
export function countComposerPromptContexts(contexts) {
    return (contexts.codeComments.length +
        contexts.conversationSelections.length +
        contexts.webElements.length +
        contexts.pptxElements.length +
        (contexts.pluginUiContexts?.length ?? 0));
}
/**
 * 五类 context parser 都只识别 prompt 尾块，因此序列化顺序和解析顺序必须严格相反。
 * 插件上下文最后序列化（最外层），解析时最先剥离。
 */
export function serializeComposerPromptContexts(text, contexts) {
    const withSelections = buildPromptWithConversationSelections(text, contexts.conversationSelections);
    const withCodeComments = buildPromptWithCodeComments(withSelections, contexts.codeComments);
    const withWebElements = buildPromptWithWebElementContexts(withCodeComments, contexts.webElements);
    const withPptx = buildPromptWithPptxElementReferences(withWebElements, contexts.pptxElements);
    return buildPromptWithPluginUiContexts(withPptx, contexts.pluginUiContexts ?? []);
}
export function parseComposerPromptContexts(content, workspace) {
    const plugin = parsePromptPluginUiContexts(stripGenUiModelContext(content));
    const pptx = parsePromptPptxElementReferences(plugin.visibleContent);
    const web = parsePromptWebElementContexts(pptx.visibleContent, workspace);
    const code = parsePromptCodeComments(web.visibleContent, workspace);
    const selections = parsePromptConversationSelections(code.visibleContent);
    return {
        visibleContent: selections.visibleContent,
        codeComments: code.codeCommentAttachments,
        conversationSelections: selections.references,
        webElements: web.webElementContexts,
        pptxElements: pptx.pptxElementReferences,
        pluginUiContexts: plugin.pluginUiContexts,
    };
}
//# sourceMappingURL=composerPromptContexts.js.map