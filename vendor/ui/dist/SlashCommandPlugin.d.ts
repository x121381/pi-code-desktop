import type { ZCodeProvider } from "@zcode/shared";
import { type SlashCommandPluginProps } from "./slashCommandHelpers.js";
export declare function SlashCommandPlugin({ workspacePath, workspaceIdentity, sessionId, provider, container, disabled, excludedCommandNames, appCommands, }: SlashCommandPluginProps & {
    provider: ZCodeProvider;
}): import("react").ReactPortal | null;
//# sourceMappingURL=SlashCommandPlugin.d.ts.map