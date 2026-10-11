import { modelSelectionSchema } from "@zcode/shared";
export function normalizeSubagentModelSelection(selection) {
    if (!selection)
        return undefined;
    const options = selection.options;
    return modelSelectionSchema.parse({
        providerId: selection.providerId,
        modelId: selection.modelId,
        ...(options?.reasoningLevel ? { options: { reasoningLevel: options.reasoningLevel } } : {}),
    });
}
//# sourceMappingURL=subagentModelSelection.js.map