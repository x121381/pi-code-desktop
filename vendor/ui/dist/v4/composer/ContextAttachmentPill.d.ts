import type { HTMLAttributes, ReactNode } from "react";
import { type AttachmentHoverCardContentProps } from "@/components/ai-elements/attachments.js";
export interface ContextAttachmentPillProps {
    children: ReactNode;
    contentAlign?: AttachmentHoverCardContentProps["align"];
    icon: ReactNode;
    label: string;
    onRemoveAll?: () => void;
    removeLabel: string;
    triggerProps?: Omit<HTMLAttributes<HTMLDivElement>, "children"> & Partial<Record<`data-${string}`, string | number>>;
}
/**
 * 上下文附件共享同一个 pill 与详情浮层外壳，避免各类型复制布局和交互样式。
 * Trigger 使用 asChild，详情使用 Portal，因此消息附件容器中只留下一个 pill 节点。
 */
export declare function ContextAttachmentPill({ children, contentAlign, icon, label, onRemoveAll, removeLabel, triggerProps, }: ContextAttachmentPillProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ContextAttachmentPill.d.ts.map