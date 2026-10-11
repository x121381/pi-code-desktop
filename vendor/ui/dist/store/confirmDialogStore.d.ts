export interface ConfirmDialogRequest {
    title: string;
    testId?: string;
    description?: string;
    /** 特定业务弹框的稳定视觉规范；默认确认框不受影响。 */
    presentation?: "automation-confirmation";
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: "default" | "destructive";
    showCloseButton?: boolean;
    showKeyboardHints?: boolean;
    compact?: boolean;
    checkbox?: {
        label: string;
        onCheckedChange: (checked: boolean) => void;
    };
}
export type ConfirmDialogChoice = "confirm" | "cancel" | "dismiss";
interface PendingConfirmDialogRequest extends ConfirmDialogRequest {
    resolve: (choice: ConfirmDialogChoice) => void;
}
interface ConfirmDialogState {
    pendingRequest?: PendingConfirmDialogRequest;
    requestConfirmation: (payload: ConfirmDialogRequest) => Promise<boolean>;
    requestChoice: (payload: ConfirmDialogRequest) => Promise<ConfirmDialogChoice>;
    settleConfirmation: (confirmed: boolean) => void;
    settleChoice: (choice: ConfirmDialogChoice) => void;
}
export declare const useConfirmDialogStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ConfirmDialogState>>;
export {};
//# sourceMappingURL=confirmDialogStore.d.ts.map