import { type ZCodeProvider, type AppSettings } from "@zcode/shared";
export type BuiltinAgentCliStatus = "enabled" | "enabling" | "disabling" | "disabled";
export declare function getEnabledBuiltinAgentCliProviders(settings: Pick<AppSettings, "enabledBuiltinAgentCliProviders"> | null | undefined): ZCodeProvider[];
export declare function requiresBuiltinAgentCliInstall(provider: ZCodeProvider): boolean;
export declare function resolveBuiltinAgentCliStatus(params: {
    provider: ZCodeProvider;
    enabledProviders: readonly ZCodeProvider[];
    enablingProvider: ZCodeProvider | null;
    disablingProvider: ZCodeProvider | null;
}): BuiltinAgentCliStatus;
export declare function getEffectiveBuiltinAgentCliProvider(_settings: Pick<AppSettings, "enabledBuiltinAgentCliProviders"> | null | undefined, provider: ZCodeProvider): ZCodeProvider;
//# sourceMappingURL=builtinAgentCli.d.ts.map