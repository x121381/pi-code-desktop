import type { IServiceAccessor } from "@zcode/services";
import type { ZCodeProvider } from "@zcode/shared";
export declare function useWorkspaceSessionReload({ intl, services, workspaceAbsPath, reloadSessionDisabled, }: {
    intl: {
        formatMessage: (descriptor: {
            id: string;
        }) => string;
    };
    services: IServiceAccessor;
    workspaceAbsPath: string;
    reloadSessionDisabled: boolean;
}): {
    reloadSessionPending: boolean;
    handleReloadSession: (options?: {
        resumeTaskId?: string | null;
        provider?: ZCodeProvider | null;
    }) => Promise<void>;
};
//# sourceMappingURL=useWorkspaceSessionReload.d.ts.map