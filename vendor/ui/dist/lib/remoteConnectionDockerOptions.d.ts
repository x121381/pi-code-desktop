import type { DockerContainerInfo, IPlatformService } from "@zcode/shared";
type DockerOptionsPlatform = Pick<IPlatformService, "isDockerAvailable" | "listDockerContainers">;
export interface RemoteConnectionDockerOptionsResult {
    dockerAvailable: boolean | null;
    dockerContainers: DockerContainerInfo[];
    error: string;
}
export declare function loadRemoteConnectionDockerOptions(platform: DockerOptionsPlatform): Promise<RemoteConnectionDockerOptionsResult>;
export declare function resolveDockerContainerSelectionAfterRefresh({ currentContainer, dockerContainers, }: {
    currentContainer: string;
    dockerContainers: DockerContainerInfo[];
}): string;
export {};
//# sourceMappingURL=remoteConnectionDockerOptions.d.ts.map