import type { ZCodeProvider } from "@zcode/shared";
import { type BuiltinAgentCliStatus } from "@/lib/builtinAgentCli.js";
export declare function useBuiltinAgentCli(): {
    settings: import("@zcode/shared").AppSettings | null;
    loading: boolean;
    refreshing: boolean;
    error: string | null;
    enabledProviders: "glm"[];
    isEnabled: (provider: ZCodeProvider) => boolean;
    hasPendingMutation: boolean;
    activeMutatingProvider: "glm" | null;
    canMutateProvider: (provider: ZCodeProvider) => boolean;
    getEffectiveProvider: (provider: ZCodeProvider) => "glm";
    getStatus: (provider: ZCodeProvider) => BuiltinAgentCliStatus;
    getInstallProgress: (provider: ZCodeProvider) => number | null;
    installProvider: (provider: ZCodeProvider) => Promise<void>;
    uninstallProvider: (provider: ZCodeProvider) => Promise<void>;
    refresh: () => Promise<void>;
};
//# sourceMappingURL=useBuiltinAgentCli.d.ts.map