import { collectVisibleZCodeBackgroundTaskControlItems, getZCodeBackgroundTaskControlItemElapsedMs, isActiveZCodeBackgroundTaskControlItem, parseZCodeBackgroundTaskControlItems, } from "./background-task-controls.js";
export function parseZCodeBackgroundBashJobs(value) {
    return parseZCodeBackgroundTaskControlItems(value).filter(isBackgroundBashJob);
}
export function isActiveZCodeBackgroundBashJob(job) {
    return isActiveZCodeBackgroundTaskControlItem(job);
}
export function getZCodeBackgroundBashJobElapsedMs(job, now = Date.now()) {
    return getZCodeBackgroundTaskControlItemElapsedMs(job, now);
}
export function collectVisibleZCodeBackgroundBashJobs(jobs, now = Date.now(), thresholdMs = 30_000) {
    return collectVisibleZCodeBackgroundTaskControlItems(jobs, now, thresholdMs);
}
function isBackgroundBashJob(job) {
    return job.taskKind === "bash";
}
//# sourceMappingURL=background-bash-jobs.js.map