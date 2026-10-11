export type ToastPosition = "top-center" | "top-right" | "bottom-left" | "bottom-center";
type ToastVariant = "default" | "update" | "info" | "warning";
export interface ToastOptions {
    durationMs?: number;
    position?: ToastPosition;
    variant?: ToastVariant;
    actionLabel?: string;
    onAction?: () => void;
    dismissible?: boolean;
    dismissLabel?: string;
    anchorId?: string;
    /** 同一业务目标与动作的稳定键；新结果替换旧结果并移到栈底。 */
    dedupeKey?: string;
}
export interface ToastItem {
    id: number;
    message: string;
    durationMs: number;
    position: ToastPosition;
    variant?: ToastVariant;
    actionLabel?: string;
    onAction?: () => void;
    dismissible?: boolean;
    dismissLabel?: string;
    anchorId?: string;
    dedupeKey?: string;
}
export declare function upsertToastItem(items: readonly ToastItem[], item: ToastItem): ToastItem[];
export declare function resolveToastStackClassName(position: ToastPosition): string;
export type ToastUpdate = Partial<Omit<ToastItem, "id">>;
export declare function resolveToastAnchorLeft(rect: Pick<DOMRect, "left" | "width">): number;
export declare function AnchoredToastStack({ anchorId, items, onDone, }: {
    anchorId: string;
    items: ToastItem[];
    onDone: (id: number) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function ToastMessageView({ item, visible, isBottom, title, body, onAction, onDismiss, }: {
    item: ToastItem;
    visible: boolean;
    isBottom?: boolean;
    title?: string;
    body?: string;
    onAction?: () => void;
    onDismiss?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function toast(message: string, options?: ToastOptions): number;
/** 更新已有 Toast，适合把同一长耗时操作的阶段变化收敛到一个提示中。 */
export declare function updateToast(id: number, patch: ToastUpdate): void;
export declare function dismissToast(id: number): void;
export {};
//# sourceMappingURL=toast.d.ts.map