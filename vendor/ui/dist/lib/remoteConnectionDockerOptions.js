export async function loadRemoteConnectionDockerOptions(platform) {
    try {
        const dockerAvailable = await platform.isDockerAvailable();
        if (!dockerAvailable) {
            return {
                dockerAvailable: false,
                dockerContainers: [],
                error: "",
            };
        }
        const dockerContainers = await platform.listDockerContainers();
        return {
            dockerAvailable: true,
            dockerContainers,
            error: "",
        };
    }
    catch (runtimeError) {
        return {
            dockerAvailable: null,
            dockerContainers: [],
            error: String(runtimeError),
        };
    }
}
export function resolveDockerContainerSelectionAfterRefresh({ currentContainer, dockerContainers, }) {
    const selectedContainer = currentContainer.trim();
    if (!selectedContainer) {
        return "";
    }
    const selectedContainerStillRunning = dockerContainers.some((container) => container.name === selectedContainer || container.id === selectedContainer);
    return selectedContainerStillRunning ? selectedContainer : "";
}
//# sourceMappingURL=remoteConnectionDockerOptions.js.map