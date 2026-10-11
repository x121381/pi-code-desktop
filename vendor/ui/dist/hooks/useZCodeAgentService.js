import { useServices } from "../hooks/useServices.js";
import { useWorkspaceServices } from "../hooks/useWorkspaceServices.js";
export function useZCodeAgentService(workspacePath, preferredRemoteSessionId, workspaceIdentity) {
    const services = workspacePath
        ? useWorkspaceServices(workspacePath, preferredRemoteSessionId, workspaceIdentity)
        : useServices();
    return services.zcodeAgentService;
}
//# sourceMappingURL=useZCodeAgentService.js.map