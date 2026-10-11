import { isRemoteWorkspaceIdentity } from "@zcode/shared";
export function resolveComputerUseAvailability({ isDesktop = false, isMacDesktop = false, isWindowsDesktop = false, remoteSessionId, remoteTarget, workspaceIdentity, } = {}) {
    const isRemote = Boolean(remoteSessionId ||
        remoteTarget ||
        (workspaceIdentity?.trim() && isRemoteWorkspaceIdentity(workspaceIdentity.trim())));
    if (isRemote) {
        const remoteKind = remoteTarget?.kind === "ssh"
            ? "remote-ssh"
            : remoteTarget?.kind === "wsl"
                ? "remote-wsl"
                : remoteTarget?.kind === "docker"
                    ? "remote-docker"
                    : "remote-server";
        return {
            kind: remoteKind,
            supported: false,
        };
    }
    if (!isDesktop)
        return { kind: "web", supported: false };
    if (isMacDesktop)
        return { kind: "local-macos", supported: true };
    if (isWindowsDesktop)
        return { kind: "local-windows", supported: true };
    return { kind: "local-linux", supported: false };
}
const COMPUTER_USE_SEARCH_TERMS = ["电脑控制", "computer use", "zcode-cua", "cua"];
export function matchesComputerUseSearch(query) {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized)
        return true;
    return COMPUTER_USE_SEARCH_TERMS.some((term) => term.includes(normalized));
}
export function isComputerUseRemoteOrLinux(availability) {
    return !availability.supported && availability.kind !== "web";
}
//# sourceMappingURL=computerUseAvailability.js.map