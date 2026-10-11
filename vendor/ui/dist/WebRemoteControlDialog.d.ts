import type { WebRemoteControlStatus } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export declare function isSameWebRemoteControlTarget(status: WebRemoteControlStatus, workspacePath: string, workspaceIdentity?: string, remoteSessionId?: string): boolean;
export declare function isReusableWebRemoteControlSession(status: WebRemoteControlStatus): boolean;
export declare function getWebRemoteControlStatusTagLabel(status: WebRemoteControlStatus, formatMessage: ReturnType<typeof useZCodeIntl>["intl"]["formatMessage"]): string;
export declare const WebRemoteControlDialog: import("react").MemoExoticComponent<({ open, onOpenChange, workspacePath, workspaceIdentity, remoteSessionId, initialTaskId, }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    initialTaskId?: string;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=WebRemoteControlDialog.d.ts.map