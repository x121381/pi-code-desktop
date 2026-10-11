export function resolveWorkflowTurnCompletion(header, join) {
    if (header?.origin !== "backgroundResult")
        return undefined;
    const originMeta = header.originMeta;
    if (originMeta?.backgroundSource !== "workflow")
        return undefined;
    const notification = originMeta.workflowNotification;
    if (notification?.kind !== "terminal" || notification.status !== "completed")
        return undefined;
    const name = originMeta.title.trim();
    if (name.length === 0)
        return undefined;
    return {
        runId: originMeta.workId,
        name,
        ...(notification.durationMs === undefined ? {} : { durationMs: notification.durationMs }),
        artifacts: notification.artifacts ?? [],
        artifactsTruncated: notification.artifactsTruncated === true,
        summary: join.byRunId?.get(originMeta.workId),
    };
}
//# sourceMappingURL=workflowTurnCompletion.js.map