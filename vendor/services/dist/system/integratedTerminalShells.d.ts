import type { IntegratedTerminalShellOption } from "@zcode/shared";
type ExecutableCheck = (path: string) => boolean;
export declare function listIntegratedTerminalShellOptions(options: {
    env: NodeJS.ProcessEnv;
    isExecutable?: ExecutableCheck;
    platform: NodeJS.Platform;
}): IntegratedTerminalShellOption[];
export {};
//# sourceMappingURL=integratedTerminalShells.d.ts.map