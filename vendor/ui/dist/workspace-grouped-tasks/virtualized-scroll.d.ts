import type { Virtualizer } from "@tanstack/react-virtual";
type GroupedTaskVirtualizerScrollOptions = {
    adjustments?: number;
    behavior?: ScrollBehavior;
};
declare function isPotentialVerticalScrollContainer(overflowY: string): boolean;
declare function scrollGroupedTaskVirtualizerToOffset<TScrollElement extends Element>(offset: number, { adjustments, behavior }: GroupedTaskVirtualizerScrollOptions, instance: Virtualizer<TScrollElement, Element>): void;
export { isPotentialVerticalScrollContainer, scrollGroupedTaskVirtualizerToOffset };
//# sourceMappingURL=virtualized-scroll.d.ts.map