export function isAbortError(error) {
    return error instanceof Error && error.name === "AbortError";
}
export function createScanJob(params) {
    const { jobId, roots, runner, now, throttleMs, emit } = params;
    const setTimer = params.setTimer ?? ((callback, delayMs) => setTimeout(callback, delayMs));
    const clearTimer = params.clearTimer ?? ((handle) => clearTimeout(handle));
    const controller = new AbortController();
    const startedAt = now();
    let latest = {
        jobId,
        status: "scanning",
        startedAt,
        roots: roots.map((root) => ({
            id: root.id,
            path: root.path,
            volume: null,
            bytes: 0,
            fileCount: 0,
            categories: [],
        })),
        errors: [],
    };
    let lastEmitAt = -Infinity;
    let pendingTimer = null;
    let settled = false;
    const flush = () => {
        pendingTimer = null;
        lastEmitAt = now();
        emit(latest);
    };
    const onProgress = (progress) => {
        if (settled)
            return;
        latest = { ...latest, roots: progress.roots, errors: progress.errors };
        const elapsed = now() - lastEmitAt;
        if (elapsed >= throttleMs) {
            flush();
        }
        else if (pendingTimer == null) {
            pendingTimer = setTimer(flush, throttleMs - elapsed);
        }
    };
    const settle = (snapshot) => {
        settled = true;
        if (pendingTimer != null) {
            clearTimer(pendingTimer);
            pendingTimer = null;
        }
        latest = snapshot;
        emit(latest);
        return latest;
    };
    const done = runner
        .run({ roots, signal: controller.signal, onProgress })
        .then((progress) => settle({
        ...latest,
        roots: progress.roots,
        errors: progress.errors,
        status: controller.signal.aborted ? "cancelled" : "complete",
        finishedAt: now(),
    }))
        .catch((error) => settle({
        ...latest,
        status: isAbortError(error) || controller.signal.aborted ? "cancelled" : "failed",
        finishedAt: now(),
        errors: isAbortError(error)
            ? latest.errors
            : [...latest.errors, { path: "", code: errorCode(error) }],
    }));
    return {
        jobId,
        done,
        cancel: () => controller.abort(),
    };
}
function errorCode(error) {
    if (error && typeof error === "object" && "code" in error && typeof error.code === "string") {
        return error.code;
    }
    return error instanceof Error ? error.name : "UNKNOWN";
}
//# sourceMappingURL=scanJob.js.map