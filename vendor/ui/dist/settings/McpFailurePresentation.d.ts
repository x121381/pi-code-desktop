import type { McpServerFailureKind } from "@zcode/shared";
export declare function resolveMcpFailureMessageId(failureKind: McpServerFailureKind | undefined): `settings.mcp.failure.${McpServerFailureKind}`;
export declare function McpFailurePresentation({ error, failureKind, }: {
    error?: string;
    failureKind?: McpServerFailureKind;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=McpFailurePresentation.d.ts.map