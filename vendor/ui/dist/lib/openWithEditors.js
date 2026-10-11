const PINNED_OPEN_WITH_EDITOR_IDS = ["finder", "qspace", "qspace-pro", "explorer"];
export function isFileManagerOpenTarget(editor) {
    return PINNED_OPEN_WITH_EDITOR_IDS.includes(editor.id);
}
export function sortInstalledEditorsForOpenWith(editors) {
    const editorById = new Map(editors.map((editor) => [editor.id, editor]));
    const pinnedEditors = PINNED_OPEN_WITH_EDITOR_IDS.map((editorId) => editorById.get(editorId) ?? null).filter((editor) => editor !== null);
    const pinnedEditorIds = new Set(PINNED_OPEN_WITH_EDITOR_IDS);
    const regularEditors = editors.filter((editor) => !pinnedEditorIds.has(editor.id));
    return [...pinnedEditors, ...regularEditors];
}
//# sourceMappingURL=openWithEditors.js.map