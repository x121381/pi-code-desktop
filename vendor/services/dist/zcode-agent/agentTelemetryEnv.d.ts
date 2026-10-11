export interface BuildAgentTelemetrySpawnEnvInput {
    telemetryEnv: Record<string, string>;
    deviceMid?: string;
    userId?: string;
    runtimeSurface: "desktop_local_host" | "remote_workspace_host";
}
export declare function buildAgentTelemetrySpawnEnv(input: BuildAgentTelemetrySpawnEnvInput): Record<string, string>;
//# sourceMappingURL=agentTelemetryEnv.d.ts.map