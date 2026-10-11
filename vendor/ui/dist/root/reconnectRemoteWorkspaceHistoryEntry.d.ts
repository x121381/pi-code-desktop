import type { Dispatch, SetStateAction } from "react";
import type { IPlatformService, RemoteWorkspaceSessionEntry } from "@zcode/shared";
import type { IServiceAccessor } from "@zcode/services";
import { toast } from "@/components/ui/toast.js";
import { buildRemoteWorkspaceSessionMutation } from "@/lib/remoteWorkspaceHistory.js";
import { logger } from "@/logger.js";
import { bindRemoteWorkspaceIdentity, bindRemoteWorkspacePath } from "@/store/remoteWorkspaceSessionStore.js";
/** 把 UI 最终确定的 canonical workspacePath/workspaceIdentity 绑定回 main/host 的 logical session。 */
export type BindRemoteWorkspaceSessionContextFn = (params: {
    sessionId: string;
    workspacePath: string;
    workspaceIdentity: string;
}) => Promise<void>;
type ManualReconnectRemoteWorkspaceParams = {
    sessionEntry: RemoteWorkspaceSessionEntry;
    activateTabByPath: (workspacePath: string, options?: {
        workspaceIdentity?: string;
    }) => boolean;
    setReconnectingRemoteWorkspaceKeys: Dispatch<SetStateAction<string[]>>;
    loadCredential: IServiceAccessor["credentialService"]["load"];
    connectRemoteWorkspaceTarget: (target: Parameters<IPlatformService["connectRemote"]>[0], requestId?: string, context?: Parameters<IPlatformService["connectRemote"]>[2]) => Promise<string>;
    resolveRemoteWorkspaceCanonicalPath: (sessionId: string, workspacePath: string) => Promise<string>;
    disposeRemoteWorkspaceSession: (sessionId: string) => Promise<void>;
    bindRemoteWorkspaceSessionContext: BindRemoteWorkspaceSessionContextFn;
    bindRemoteWorkspacePath: typeof bindRemoteWorkspacePath;
    bindRemoteWorkspaceIdentity: typeof bindRemoteWorkspaceIdentity;
    upsertWorkspaceTab: (workspacePath: string, options?: {
        remoteSessionId?: string;
        remoteTarget?: Parameters<IPlatformService["connectRemote"]>[0];
        workspaceIdentity?: string;
        localWorkspacePath?: string;
    }) => void;
    commitRemoteWorkspaceSessionMutation: (mutation: ReturnType<typeof buildRemoteWorkspaceSessionMutation>) => Promise<RemoteWorkspaceSessionEntry>;
    getRemoteSessions: () => RemoteWorkspaceSessionEntry[];
    logger: Pick<typeof logger, "warn">;
    toast: typeof toast;
    shouldKeepReconnectedWorkspace?: (context: Pick<RemoteWorkspaceSessionEntry, "workspacePath" | "workspaceIdentity">) => boolean;
    onWorkspaceActivated?: (target: {
        workspacePath: string;
        workspaceIdentity: string;
    }) => void;
    options?: ReconnectRemoteWorkspaceOptions;
};
export interface SshReconnectCredentials {
    password: string | null;
    privateKeyPassphrase: string | null;
}
export interface ReconnectRemoteWorkspaceOptions {
    activateWorkspaceAfterReconnect?: boolean;
    showErrorToast?: boolean;
    requestId?: string;
    throwOnFailure?: boolean;
    /** 共享 Host ready 后，sibling 复用 initiator 凭据附着，禁止再次读取各自历史凭据。 */
    sshCredentialsOverride?: SshReconnectCredentials;
    /** logical connect 已返回，表示共享 SSH Host ready；workspace 初始化仍可能继续或失败。 */
    onSshHostReady?: (credentials: SshReconnectCredentials) => void;
}
export declare function reconnectRemoteWorkspaceHistoryEntry({ sessionEntry, activateTabByPath, setReconnectingRemoteWorkspaceKeys, loadCredential, connectRemoteWorkspaceTarget, resolveRemoteWorkspaceCanonicalPath, disposeRemoteWorkspaceSession, bindRemoteWorkspaceSessionContext, bindRemoteWorkspacePath, bindRemoteWorkspaceIdentity, upsertWorkspaceTab, commitRemoteWorkspaceSessionMutation, getRemoteSessions, logger, toast, shouldKeepReconnectedWorkspace, onWorkspaceActivated, options, }: ManualReconnectRemoteWorkspaceParams): Promise<void>;
export {};
//# sourceMappingURL=reconnectRemoteWorkspaceHistoryEntry.d.ts.map