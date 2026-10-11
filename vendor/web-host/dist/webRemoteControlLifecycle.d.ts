interface WebRemoteControlLifecycleTarget {
    addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}
interface WebRemoteControlDocumentLifecycleTarget extends WebRemoteControlLifecycleTarget {
    visibilityState: DocumentVisibilityState;
}
interface WebRemoteControlLifecycleRecoveryOptions {
    documentTarget: WebRemoteControlDocumentLifecycleTarget;
    windowTarget: WebRemoteControlLifecycleTarget;
    onSuspend(): void;
    onRecover(reason: "visible" | "pageshow" | "online" | "resume"): void;
}
export declare function createWebRemoteControlLifecycleRecovery({ documentTarget, windowTarget, onSuspend, onRecover, }: WebRemoteControlLifecycleRecoveryOptions): {
    dispose(): void;
};
export {};
