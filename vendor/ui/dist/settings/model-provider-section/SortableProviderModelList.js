import { jsx as _jsx } from "react/jsx-runtime";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
export function resolveReorderedModelIds(params) {
    const activeIndex = params.modelIds.indexOf(params.activeModelId);
    const overIndex = params.modelIds.indexOf(params.overModelId);
    if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) {
        return [...params.modelIds];
    }
    return arrayMove([...params.modelIds], activeIndex, overIndex);
}
class ModelRowPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: "onPointerDown",
            handler: ({ nativeEvent }) => !isInteractiveModelDragTarget(nativeEvent.target),
        },
    ];
}
export function isInteractiveModelDragTarget(target) {
    return (target instanceof Element &&
        target.closest("button, input, textarea, select, a, [contenteditable]:not([contenteditable=false]), [data-no-model-drag], [data-slot=dialog-content], [data-slot=dialog-overlay]") !== null);
}
export function resolveSortableProviderModelRowClassName({ isDragging, isLast, }) {
    // 拖动状态沿用了普通行的可见底部分隔线，浮起后看起来像带下划线。
    // 透明边框保留既有的 1px 占位，避免切换拖动状态时行高抖动。
    const dividerClassName = isDragging
        ? "border-b border-transparent"
        : isLast
            ? "border-b-0"
            : "border-b border-input-border";
    return `min-w-0 cursor-grab touch-pan-y select-none active:cursor-grabbing ${dividerClassName} ${isDragging ? "relative z-10 bg-card shadow-md" : ""}`;
}
function SortableProviderModelRow({ modelId, children, isLast, }) {
    const { intl } = useZCodeIntl();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: modelId,
    });
    const dragLabel = intl.formatMessage({
        id: "settings.modelProvider.reorderModel",
    });
    return (_jsx("div", { ref: setNodeRef, "data-model-provider-model-id": modelId, style: { transform: CSS.Transform.toString(transform), transition }, className: resolveSortableProviderModelRowClassName({ isDragging, isLast }), "aria-label": dragLabel, title: dragLabel, ...attributes, ...listeners, onKeyDown: (event) => {
            // Portal 弹窗的空格会冒泡到模型行，启动键盘排序并抢先写入版本。
            // 复用指针的交互目标隔离；不阻止输入默认行为，行自身仍交给原键盘传感器。
            if (!isInteractiveModelDragTarget(event.target))
                listeners?.onKeyDown?.(event);
        }, children: children }));
}
export function SortableProviderModelList({ modelIds, sortableModelIds, onReorder, renderModel, }) {
    const sensors = useSensors(useSensor(ModelRowPointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const sortableIds = sortableModelIds ?? modelIds;
    const sortableSet = new Set(sortableIds);
    const content = modelIds.map((modelId, index) => {
        const row = renderModel(modelId, index);
        const isLast = index === modelIds.length - 1;
        return onReorder && sortableSet.has(modelId) ? (_jsx(SortableProviderModelRow, { modelId: modelId, isLast: isLast, children: row }, modelId)) : (_jsx("div", { className: isLast ? "border-b-0" : "border-b border-input-border", children: row }, modelId));
    });
    if (!onReorder)
        return content;
    return (_jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: (event) => {
            if (!event.over)
                return;
            onReorder(resolveReorderedModelIds({
                activeModelId: String(event.active.id),
                overModelId: String(event.over.id),
                modelIds,
            }));
        }, children: _jsx(SortableContext, { items: [...sortableIds], strategy: verticalListSortingStrategy, children: content }) }));
}
//# sourceMappingURL=SortableProviderModelList.js.map