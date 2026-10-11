interface DeferredWebRemoteControlTaskSnapshotLogOptions {
    archivedLoading: boolean;
    pinnedLoading: boolean;
    timelineLoading: boolean;
}
export declare function shouldSyncWebRemoteControlTaskSnapshot({ archivedLoading, enabled, pinnedLoading, timelineLoading, }: {
    archivedLoading: boolean;
    enabled: boolean;
    pinnedLoading: boolean;
    timelineLoading: boolean;
}): boolean;
export declare function logDeferredWebRemoteControlTaskSnapshot(logger: {
    debug: (message: string, details: DeferredWebRemoteControlTaskSnapshotLogOptions) => void;
}, details: DeferredWebRemoteControlTaskSnapshotLogOptions): void;
export {};
//# sourceMappingURL=webRemoteControlTaskSync.d.ts.map