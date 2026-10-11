import type { ZCodeSlashCommand } from "@zcode/shared";
export declare function extractActiveSlashQuery(textBeforeCursor: string): string | null;
export declare function filterSlashCommands(commands: ZCodeSlashCommand[], query: string | null): ZCodeSlashCommand[];
interface SlashCommandReplacement {
    cursorOffset: number;
    text: string;
}
export declare function replaceActiveSlashCommand(textBeforeCursor: string, textAfterCursor: string, commandName: string): SlashCommandReplacement | null;
export {};
//# sourceMappingURL=slashCommands.d.ts.map