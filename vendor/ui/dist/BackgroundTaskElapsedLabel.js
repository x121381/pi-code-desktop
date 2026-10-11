import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from "react";
import { getZCodeBackgroundTaskControlItemElapsedMs, } from "@zcode/shared";
import { cn } from "./components/lib/utils.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
export function formatBackgroundTaskElapsedLabel(elapsedMs, formatMessage) {
    const totalSeconds = Math.max(1, Math.floor(elapsedMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
        return formatMessage({ id: "chat.longRunning.elapsedMinutesSeconds" }, { minutes: String(minutes), seconds: String(seconds) });
    }
    return formatMessage({ id: "chat.longRunning.elapsedSeconds" }, { seconds: String(totalSeconds) });
}
function createElapsedBaseline(job) {
    const mountedAt = Date.now();
    return {
        elapsedMs: getZCodeBackgroundTaskControlItemElapsedMs(job, mountedAt),
        key: `${job.jobId}:${job.startedAt ?? "no-start"}:${job.elapsedMs ?? "no-elapsed"}`,
        mountedAt,
    };
}
function elapsedMsForClock(input) {
    const elapsedFromJob = getZCodeBackgroundTaskControlItemElapsedMs(input.job, input.now);
    const elapsedFromBaseline = input.baseline.elapsedMs + Math.max(0, input.now - input.baseline.mountedAt);
    return Math.max(elapsedFromJob, elapsedFromBaseline);
}
export function BackgroundTaskElapsedLabel({ className, job, now = Date.now(), }) {
    const { intl } = useZCodeIntl();
    const baselineRef = useRef(null);
    const baselineKey = `${job.jobId}:${job.startedAt ?? "no-start"}:${job.elapsedMs ?? "no-elapsed"}`;
    if (!baselineRef.current || baselineRef.current.key !== baselineKey) {
        baselineRef.current = createElapsedBaseline(job);
    }
    const baseline = baselineRef.current;
    return (_jsx("span", { className: cn("shrink-0 tabular-nums text-foreground-subtle", className), children: formatBackgroundTaskElapsedLabel(elapsedMsForClock({
            baseline,
            job,
            now,
        }), intl.formatMessage) }));
}
//# sourceMappingURL=BackgroundTaskElapsedLabel.js.map