export declare function markPendingModeSwitchGuard(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string;
    modeId: string;
}): void;
export declare function clearPendingModeSwitchGuard(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    modeId?: string;
}): void;
export declare function ackPendingModeSwitchGuardFromModeUpdate(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    modeId: string | null | undefined;
}): void;
export declare function shouldPreserveModeAgainstConfigUpdate(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    activeTaskId: string | null;
    currentModeId: string | null;
    incomingModeId: string | null;
}): boolean;
export declare function resetPendingModeSwitchGuardForTest(): void;
//# sourceMappingURL=modeConfigUpdateGuard.d.ts.map