import { createWorkspaceFileComposerMention, } from "@/lib/workspaceFileDrag.js";
export function appendWorkspaceFileMentionToComposer(params) {
    const mention = createWorkspaceFileComposerMention(params.payload, params.workspacePath, params.workspaceIdentity);
    const separator = params.currentMarkdown.length > 0 && !/\s$/.test(params.currentMarkdown) ? " " : "";
    const nextText = `${params.currentMarkdown}${separator}${mention.markdown} `;
    params.onTextChange(nextText);
    params.inputApiRef.current?.appendFileMention(params.payload.name, mention.value, mention.markdown, mention.data);
    params.inputApiRef.current?.focus();
    return nextText;
}
//# sourceMappingURL=workspaceFileComposer.js.map