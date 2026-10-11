import type { ComponentProps } from "react";
type MarkdownListNodeProp = {
    node?: unknown;
};
export type MarkdownUnorderedListProps = ComponentProps<"ul"> & MarkdownListNodeProp;
export declare function MarkdownUnorderedList({ className, node: _node, ...props }: MarkdownUnorderedListProps): import("react/jsx-runtime").JSX.Element;
export type MarkdownOrderedListProps = ComponentProps<"ol"> & MarkdownListNodeProp;
export declare function MarkdownOrderedList({ className, node: _node, ...props }: MarkdownOrderedListProps): import("react/jsx-runtime").JSX.Element;
export type MarkdownListItemProps = ComponentProps<"li"> & MarkdownListNodeProp;
export declare function MarkdownListItem({ className, node: _node, ...props }: MarkdownListItemProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=markdown-list.d.ts.map