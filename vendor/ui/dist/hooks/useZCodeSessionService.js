import { useServices } from "@/hooks/useServices.js";
import { useWorkspaceServices } from "@/hooks/useWorkspaceServices.js";
export function useZCodeSessionService(workspacePath, preferredRemoteSessionId, workspaceIdentity) {
    const services = workspacePath
        ? useWorkspaceServices(workspacePath, preferredRemoteSessionId, workspaceIdentity)
        : useServices();
    return services.zcodeSessionService;
}
//# sourceMappingURL=useZCodeSessionService.js.map