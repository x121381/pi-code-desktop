import { normalizeAgentProviderToZCodeAgent, ZCODE_AGENT_PROVIDER, } from "@zcode/shared";
import { useSkillStore } from "@/store/skillStore.js";
export async function refreshSharedSkillStoreForWorkspace(params) {
    const workspacePath = params.workspacePath;
    if (!workspacePath) {
        return;
    }
    const skillStore = useSkillStore.getState();
    const normalizedWorkspaceIdentity = params.workspaceIdentity?.trim() || null;
    const normalizedProvider = normalizeAgentProviderToZCodeAgent(params.provider ?? ZCODE_AGENT_PROVIDER);
    const refreshes = [];
    if (skillStore.workspacePath === workspacePath &&
        skillStore.workspaceIdentity === normalizedWorkspaceIdentity &&
        skillStore.loadedWorkspacePath === workspacePath &&
        skillStore.loadedWorkspaceIdentity === normalizedWorkspaceIdentity &&
        normalizeAgentProviderToZCodeAgent(skillStore.provider) === normalizedProvider &&
        skillStore.loadedProvider === normalizedProvider) {
        refreshes.push(skillStore.refresh(params.skillsService, normalizedWorkspaceIdentity ?? undefined));
    }
    await Promise.all(refreshes);
}
//# sourceMappingURL=skillStoreRefresh.js.map