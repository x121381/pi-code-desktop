interface ComposerDraftWorkspaceTransferRequest {
    sourceWorkspacePath: string;
    sourceWorkspaceIdentity?: string;
    targetWorkspacePath: string;
    targetWorkspaceIdentity?: string;
}
export declare function requestV4ComposerDraftWorkspaceTransfer(request: ComposerDraftWorkspaceTransferRequest): void;
export declare function consumeV4ComposerDraftWorkspaceTransferRequest(transition: ComposerDraftWorkspaceTransferRequest): boolean;
export declare function clearV4ComposerDraftWorkspaceTransferRequest(): void;
export {};
//# sourceMappingURL=composerDraftWorkspaceTransfer.d.ts.map