import { type ReactElement } from "react";
import type { RemoteConnectionLogEntry } from "@/hooks/useRemoteConnectionLogs.js";
export declare function scrollRemoteConnectionLogsToLatest(viewport: Pick<HTMLElement, "scrollHeight" | "scrollTop">): void;
export declare function scheduleRemoteConnectionLogsScrollToLatest(viewport: Pick<HTMLElement, "scrollHeight" | "scrollTop">, scheduleFrame?: (callback: () => void) => number, cancelFrame?: (frameId: number) => void): () => void;
export declare function ReconnectingRemoteWorkspaceLogTooltip({ logs, children, }: {
    logs: RemoteConnectionLogEntry[];
    children?: ReactElement;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ReconnectingRemoteWorkspaceLogTooltip.d.ts.map