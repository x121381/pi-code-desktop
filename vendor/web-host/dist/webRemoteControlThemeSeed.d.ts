import { type WebRemoteControlThemeSeed } from "@zcode/shared";
export declare const WEB_REMOTE_CONTROL_DEFAULT_THEME: WebRemoteControlThemeSeed;
export declare function resolveWebRemoteControlInitialTheme({ storedTheme, qrTheme, defaultTheme, }: {
    storedTheme?: string | null;
    qrTheme?: string | null;
    defaultTheme?: WebRemoteControlThemeSeed;
}): WebRemoteControlThemeSeed;
export declare function seedWebRemoteControlThemePreference(qrTheme?: string | null): void;
