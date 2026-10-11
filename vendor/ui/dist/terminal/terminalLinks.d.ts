import type { IBuffer, ILink } from "@xterm/xterm";
interface TerminalHttpLinkMatch {
    text: string;
    startIndex: number;
    endIndex: number;
}
type TerminalHttpLink = Pick<ILink, "range" | "text" | "decorations">;
export declare function findHttpLinksInTerminalText(text: string): TerminalHttpLinkMatch[];
export declare function getHttpLinksForTerminalBufferLine(buffer: IBuffer, bufferLineNumber: number, cols: number): TerminalHttpLink[] | undefined;
export {};
//# sourceMappingURL=terminalLinks.d.ts.map