export interface AlertDialogRequest {
    title: string;
    description?: string;
    actionLabel?: string;
}
interface PendingAlertDialogRequest extends AlertDialogRequest {
    resolve: (confirmed: boolean) => void;
}
interface AlertDialogState {
    pendingRequest?: PendingAlertDialogRequest;
    requestAlert: (payload: AlertDialogRequest) => Promise<boolean>;
    settleAlert: (confirmed?: boolean) => void;
}
export declare const useAlertDialogStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AlertDialogState>>;
export {};
//# sourceMappingURL=alertDialogStore.d.ts.map