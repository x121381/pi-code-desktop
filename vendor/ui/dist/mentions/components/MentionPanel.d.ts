import { type ReactNode } from "react";
export interface MentionPanelOption {
    id: string;
    label: string;
    description: string;
    content?: ReactNode;
    meta?: ReactNode;
    /** 禁选态（如同名 Plugin 冲突 fail closed）：可见但不可点击，键盘导航由上层跳过。 */
    disabled?: boolean;
    /** 禁选原因；无自定义 content 时展示在描述位。 */
    disabledReason?: string;
}
export interface MentionPanelSection {
    id: string;
    title: string;
    options: MentionPanelOption[];
    emptyText: string;
    loadingText?: string;
    loading?: boolean;
    errorText?: string | null;
}
interface MentionPanelProps {
    title: string;
    description: string;
    footer?: ReactNode;
    listMaxHeight?: string;
    trigger: string;
    sections: MentionPanelSection[];
    emptyText: string;
    selectedIndex: number;
    hasActiveQuery: boolean;
    onSelect: (index: number) => void;
}
type VirtualRow = {
    kind: "section_header";
    sectionId: string;
    title: string;
} | {
    kind: "status";
    sectionId: string;
    content: "loading" | "error" | "empty";
    text: string;
} | {
    kind: "option";
    sectionId: string;
    option: MentionPanelOption;
    flatOptionIndex: number;
};
export declare const SECTION_HEADER_ROW_HEIGHT = 34;
export declare const SECTION_HEADER_CLASS_NAME = "flex h-8 items-center px-3 text-ui-base font-semibold uppercase tracking-wide text-foreground-subtle";
export declare function buildVirtualRows(sections: MentionPanelSection[]): VirtualRow[];
export declare function MentionPanel({ title, description, footer, listMaxHeight, sections, emptyText, selectedIndex, hasActiveQuery, onSelect, trigger, }: MentionPanelProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MentionPanel.d.ts.map