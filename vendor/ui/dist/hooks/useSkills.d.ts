import type { ZCodeSkillReferenceCatalogEntry } from "@zcode/shared";
export interface ConversationSkillCatalogState {
    skills: ZCodeSkillReferenceCatalogEntry[];
    authority: "session" | "workspace" | null;
    loading: boolean;
    error: string | null;
}
export interface UseSkillsOptions {
    workspacePath: string;
    workspaceIdentity?: string;
    sessionId: string | null;
    enabled: boolean;
    preferredRemoteSessionId?: string;
}
/**
 * Composer 的 Skill catalog。
 * 无 prewarm 的 draft 以 workspace 当前扫描为 authority；prewarm/已有 Session 以对应
 * AgentRuntime 冻结快照为 authority。workspace/session/remote attachment/runtime 代次变化时，
 * 旧异步结果一律不得回填。
 */
export declare function useSkills(options: UseSkillsOptions): ConversationSkillCatalogState;
//# sourceMappingURL=useSkills.d.ts.map