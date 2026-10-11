const REMOTE_CONNECTION_LOG_BOTTOM_THRESHOLD_PX = 2;
export function isRemoteConnectionLogScrolledToLatest(viewport, thresholdPx = REMOTE_CONNECTION_LOG_BOTTOM_THRESHOLD_PX) {
    const bottomScrollTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    return bottomScrollTop - viewport.scrollTop <= thresholdPx;
}
export function scrollRemoteConnectionLogsToLatestIfFollowing(viewport, shouldFollowLatestLog) {
    if (!shouldFollowLatestLog) {
        return false;
    }
    viewport.scrollTop = viewport.scrollHeight;
    return true;
}
//# sourceMappingURL=remoteConnectionLogScroll.js.map