import type { RemoteWorkspaceSessionEntry } from "@zcode/shared";
interface SshConnectionHistorySuggestions {
    hosts: string[];
    ports: string[];
    usernames: string[];
    privateKeyPaths: string[];
}
export declare function buildSshConnectionHistorySuggestions(remoteWorkspaceSessions: readonly RemoteWorkspaceSessionEntry[]): SshConnectionHistorySuggestions;
export {};
//# sourceMappingURL=sshHistorySuggestions.d.ts.map