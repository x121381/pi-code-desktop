import type { RemoteAssetInstallMode, RemoteTarget } from "@zcode/shared";
import type { SSHAuthMethod } from "@/hooks/useRemoteConnectionForm.js";
import type { RemoteWizardStep } from "@/RemoteConnectionWizardChrome.js";
type WizardIntlLike = {
    formatMessage: (descriptor: {
        id: string;
    }, values?: Record<string, string>) => string;
};
interface RemoteConnectionFormSnapshot {
    kind: RemoteTarget["kind"];
    host: string;
    port: string;
    username: string;
    sshAuthMethod: SSHAuthMethod;
    assetInstallMode?: RemoteAssetInstallMode;
    selectedSshConfigAlias?: string | null;
    password: string;
    privateKeyPath: string;
    privateKeyPassphrase: string;
    wslDistro: string;
    wslUser?: string;
    dockerContainer: string;
    manualDockerContainer?: string;
    serverUrl?: string;
    serverName?: string;
    serverToken?: string;
    serverWorkspacePath?: string;
}
export declare function getRemoteWizardStepCopy(intl: WizardIntlLike, step: RemoteWizardStep, kind: RemoteTarget["kind"]): {
    title: string;
    description: string;
};
export declare function buildRemoteTarget(intl: WizardIntlLike, snapshot: RemoteConnectionFormSnapshot): {
    target?: RemoteTarget;
    errorMessage?: string;
};
export declare function withDefaultRemoteResourcePackages(target: RemoteTarget): RemoteTarget;
export {};
//# sourceMappingURL=remoteConnectionWizard.d.ts.map