import type { ConversationSharePreflightResult } from "@zcode/services";
export type ConversationShareSelectionPreflightState = {
    status: "idle" | "checking";
} | ({
    status: "ready" | "stale";
} & ConversationSharePreflightResult);
export interface ConversationShareSelectionDockProps {
    selectedCount: number;
    totalCount: number;
    onCancel: () => void;
    onNext: () => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    /**
     * 整轮取消选择。只接受 productTurnId：turnOrdinal 是 service 按全部 turnHeader
     * 编号的展示序号，用它反查 UI 的 per-query 列表会取消到别的轮次。
     */
    onDeselectTurn?: (productTurnId: string) => void;
    /** 传输类阻断（网络/RPC 抖动）没有可操作对象，只能整体重新预检。 */
    onRetryPreflight?: () => void;
    preflight?: ConversationShareSelectionPreflightState;
    pending?: boolean;
}
declare function ConversationShareSelectionDockImpl({ selectedCount, totalCount, onCancel, onNext, onSelectAll, onDeselectAll, onDeselectTurn, onRetryPreflight, preflight, pending, }: ConversationShareSelectionDockProps): import("react/jsx-runtime").JSX.Element;
export declare const ConversationShareSelectionDock: import("react").MemoExoticComponent<typeof ConversationShareSelectionDockImpl>;
export {};
//# sourceMappingURL=ConversationShareSelectionDock.d.ts.map