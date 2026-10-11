import type { WebRemoteControlStatus } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
type FormatMessage = ReturnType<typeof useZCodeIntl>["intl"]["formatMessage"];
export declare function getWebRemoteControlTriggerPresentation(status: Pick<WebRemoteControlStatus, "status" | "mobileConnected">, formatMessage: FormatMessage): {
    iconClassName: string;
    tooltip: string;
};
export declare function WorkspaceWebRemoteControlTrigger({ workspacePath, workspaceIdentity, remoteSessionId, initialTaskId, compact, className, }: {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    initialTaskId?: string;
    compact?: boolean;
    className?: string;
}): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=WorkspaceWebRemoteControlTrigger.d.ts.map