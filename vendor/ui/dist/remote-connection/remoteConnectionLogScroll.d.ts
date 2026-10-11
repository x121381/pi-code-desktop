type RemoteConnectionLogViewport = Pick<HTMLElement, "clientHeight" | "scrollHeight" | "scrollTop">;
export declare function isRemoteConnectionLogScrolledToLatest(viewport: RemoteConnectionLogViewport, thresholdPx?: number): boolean;
export declare function scrollRemoteConnectionLogsToLatestIfFollowing(viewport: Pick<HTMLElement, "scrollHeight" | "scrollTop">, shouldFollowLatestLog: boolean): boolean;
export {};
//# sourceMappingURL=remoteConnectionLogScroll.d.ts.map