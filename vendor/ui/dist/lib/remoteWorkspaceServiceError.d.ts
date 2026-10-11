export declare const REMOTE_WORKSPACE_DISCONNECTED_ERROR_CODE = "ZCODE_REMOTE_WORKSPACE_DISCONNECTED";
export declare function createRemoteWorkspaceDisconnectedError(): Error & {
    code: typeof REMOTE_WORKSPACE_DISCONNECTED_ERROR_CODE;
};
export declare function isRemoteWorkspaceDisconnectedError(error: unknown): boolean;
//# sourceMappingURL=remoteWorkspaceServiceError.d.ts.map