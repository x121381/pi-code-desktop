import type { ReactNode } from "react";
export declare function resolveReorderedModelIds(params: {
    activeModelId: string;
    overModelId: string;
    modelIds: readonly string[];
}): string[];
export declare function isInteractiveModelDragTarget(target: EventTarget | null): boolean;
export declare function resolveSortableProviderModelRowClassName({ isDragging, isLast, }: {
    isDragging: boolean;
    isLast: boolean;
}): string;
export declare function SortableProviderModelList({ modelIds, sortableModelIds, onReorder, renderModel, }: {
    modelIds: readonly string[];
    sortableModelIds?: readonly string[];
    onReorder?: (modelIds: string[]) => void;
    renderModel: (modelId: string, index: number) => ReactNode;
}): import("react/jsx-runtime").JSX.Element | import("react/jsx-runtime").JSX.Element[];
//# sourceMappingURL=SortableProviderModelList.d.ts.map