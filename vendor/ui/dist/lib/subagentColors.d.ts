import type { AgentColor } from "@zcode/shared";
export declare const SUBAGENT_COLORS: AgentColor[];
export declare const SUBAGENT_COLOR_CLASS: Record<AgentColor, string>;
export declare const SUBAGENT_TEXT_COLOR_CLASS: Record<AgentColor, string>;
export declare function isSubagentColor(value: string): value is AgentColor;
export declare function resolveSubagentColorFromName(name: string): AgentColor;
//# sourceMappingURL=subagentColors.d.ts.map