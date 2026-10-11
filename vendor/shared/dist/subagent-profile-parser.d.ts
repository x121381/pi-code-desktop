import type { AgentProfile, AgentProfileSource, AgentProfileParseDiagnostic } from "./subagent-profile.js";
export declare function parseAgentProfileFromMarkdown(input: {
    content: string;
    path?: string;
    source: AgentProfileSource;
}): {
    diagnostic?: AgentProfileParseDiagnostic;
    profile?: AgentProfile;
};
//# sourceMappingURL=subagent-profile-parser.d.ts.map