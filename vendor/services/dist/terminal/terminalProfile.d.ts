import type { AppSettings } from "@zcode/shared";
import type { TerminalFontFamilySource, TerminalThemeProfile } from "./terminalProfileTypes.js";
export type { TerminalFontFamilySource, TerminalThemeProfile } from "./terminalProfileTypes.js";
interface TerminalFontProfile {
    fontFamily: string;
    fontSize?: number;
    theme?: TerminalThemeProfile;
    source: TerminalFontFamilySource;
}
interface TerminalFontProfileInput {
    settings: Pick<AppSettings, "terminalFontFamily" | "terminalInheritSystemProfile">;
    env?: NodeJS.ProcessEnv;
}
export declare function resolveTerminalFontProfile(input: TerminalFontProfileInput): TerminalFontProfile;
//# sourceMappingURL=terminalProfile.d.ts.map