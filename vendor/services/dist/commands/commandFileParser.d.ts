import type { CommandConfig } from "@zcode/shared";
export type CommandFileFormat = "markdown";
interface ParsedCommandFile {
    name: string;
    prompt: string;
    content: string;
    filePath: string;
    description?: string;
    argumentHint?: string;
}
export declare class CommandFileParser {
    static parseCommandFile(content: string, filePath: string, _format?: CommandFileFormat): ParsedCommandFile | null;
    static generateCommandFileContent(config: CommandConfig, _format?: CommandFileFormat, existingContent?: string): string;
}
export {};
//# sourceMappingURL=commandFileParser.d.ts.map