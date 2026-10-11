import type { TerminalDetectedProfile } from "./terminalProfileTypes.js";
type TerminalProfileDetector = {
    id: string;
    platforms?: readonly NodeJS.Platform[];
    detect: (env: NodeJS.ProcessEnv) => TerminalDetectedProfile | null;
};
export declare function createMacOsTerminalProfileDetectors(): readonly TerminalProfileDetector[];
export {};
//# sourceMappingURL=terminalProfileMacOs.d.ts.map