import type { ZCodeSavedWorkflowMeta, ZCodeSavedWorkflowScope, ZCodeWorkflowsForRunCandidate } from "@zcode/shared";
import type { ZCodeAgentWorkspaceTarget } from "./zcodeAgentPluginParams.js";
export type ZCodeAgentSavedWorkflowTarget = (ZCodeAgentWorkspaceTarget & {
    scope?: ZCodeSavedWorkflowScope;
}) | ({
    scope: "global";
} & Partial<ZCodeAgentWorkspaceTarget>);
export type ZCodeAgentListSavedWorkflowsParams = ZCodeAgentSavedWorkflowTarget;
export type ZCodeAgentGetSavedWorkflowParams = ZCodeAgentSavedWorkflowTarget & {
    name: string;
};
export type ZCodeAgentUpdateSavedWorkflowMetaParams = ZCodeAgentSavedWorkflowTarget & {
    name: string;
    meta: ZCodeSavedWorkflowMeta;
};
export type ZCodeAgentDeleteSavedWorkflowParams = ZCodeAgentSavedWorkflowTarget & {
    name: string;
};
export type ZCodeAgentListSavedWorkflowRunsParams = ZCodeAgentSavedWorkflowTarget & {
    /** 只要这个工作流名下的 run；缺省即（该 scope 下）全部。 */
    name?: string;
    /** [1, 50]；服务端钳制。 */
    limit: number;
};
export type ZCodeAgentMoveSavedWorkflowParams = ZCodeAgentWorkspaceTarget & {
    name: string;
};
export type ZCodeAgentSaveSavedWorkflowFromRunParams = ZCodeAgentWorkspaceTarget & {
    /** 要保存的那次 run；脚本取它实际执行的那一份。 */
    runId: string;
    name: string;
    meta: ZCodeSavedWorkflowMeta;
    /** 缺省 `project`。 */
    scope?: ZCodeSavedWorkflowScope;
    /** 只有在已经把覆盖警告摆给用户看过之后才传 true。 */
    overwrite?: boolean;
};
export type ZCodeAgentFindSavedWorkflowForRunParams = ZCodeAgentWorkspaceTarget & {
    runId: string;
    /** 转写自对话的候选（模型存过并认领了这次 run）；最多 8 个，由 agent 再解析一遍。 */
    candidates?: readonly ZCodeWorkflowsForRunCandidate[];
};
//# sourceMappingURL=zcodeAgentWorkflowParams.d.ts.map