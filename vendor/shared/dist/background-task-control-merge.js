export function mergeZCodeBackgroundTaskControlItems(current, updates) {
    const jobsById = new Map(current.map((job) => [job.jobId, job]));
    for (const job of updates) {
        jobsById.set(job.jobId, job);
    }
    return Array.from(jobsById.values());
}
//# sourceMappingURL=background-task-control-merge.js.map