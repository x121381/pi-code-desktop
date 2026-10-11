import type { RemoteTarget } from "@zcode/shared";
export type ComputerUseAvailabilityKind = "local-macos" | "local-windows" | "local-linux" | "remote-ssh" | "remote-wsl" | "remote-docker" | "remote-server" | "web";
export interface ComputerUseAvailability {
    kind: ComputerUseAvailabilityKind;
    supported: boolean;
}
export interface ComputerUseAvailabilityInput {
    isDesktop?: boolean;
    isMacDesktop?: boolean;
    isWindowsDesktop?: boolean;
    remoteSessionId?: string | null;
    remoteTarget?: RemoteTarget | null;
    workspaceIdentity?: string | null;
}
export declare function resolveComputerUseAvailability({ isDesktop, isMacDesktop, isWindowsDesktop, remoteSessionId, remoteTarget, workspaceIdentity, }?: ComputerUseAvailabilityInput): ComputerUseAvailability;
export declare function matchesComputerUseSearch(query: string): boolean;
export declare function isComputerUseRemoteOrLinux(availability: ComputerUseAvailability): boolean;
//# sourceMappingURL=computerUseAvailability.d.ts.map