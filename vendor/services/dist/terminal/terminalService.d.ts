import type { ISettingService } from "../setting/setting.js";
import type { ITerminalService, TerminalWindowsPtyInfo } from "./terminal.js";
export declare function parseWindowsBuildNumber(releaseText: string): number | undefined;
export declare function resolveTerminalWindowsPtyInfo(platform?: NodeJS.Platform, releaseText?: string): TerminalWindowsPtyInfo | undefined;
export declare function resolveTerminalEnv(env?: NodeJS.ProcessEnv): NodeJS.ProcessEnv;
export declare function resolveTerminalShell(): string;
export declare function resolveTerminalCwd(cwd?: string): string;
export declare function createTerminalService(dependencies: {
    settingService: ISettingService;
}): ITerminalService;
//# sourceMappingURL=terminalService.d.ts.map