import { type RemoteTarget } from "@zcode/shared";
import type { RemoteConnectionLogEntry } from "@/hooks/useRemoteConnectionLogs.js";
export declare function RemoteConnectionConnectingStep({ kind, logs, errorMessage, loading, onBack, onRetry, }: {
    kind: RemoteTarget["kind"];
    logs: RemoteConnectionLogEntry[];
    errorMessage: string;
    loading: boolean;
    onBack: () => void;
    onRetry: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=RemoteConnectionConnectingStep.d.ts.map