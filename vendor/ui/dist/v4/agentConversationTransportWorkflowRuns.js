export function createWorkflowRunTransportMethods(input) {
    const { agentService, ensureHandshake, workspace } = input;
    return {
        async workflowRunEvents(params) {
            await ensureHandshake();
            return agentService.conversationWorkflowRunEventsV4({
                ...workspace,
                sessionId: params.sessionId,
                runId: params.runId,
                ...(params.afterSequence !== undefined ? { afterSequence: params.afterSequence } : {}),
                ...(params.limit !== undefined ? { limit: params.limit } : {}),
            });
        },
        async workflowRuns(params) {
            await ensureHandshake();
            return agentService.conversationWorkflowRunsV4({
                ...workspace,
                sessionId: params.sessionId,
                ...(params.limit !== undefined ? { limit: params.limit } : {}),
            });
        },
        // dwf 用户面产物的三条读面。
        // ⚠ 术语：artifact = 脚本发布给用户看的产出，不是 run 的顶层返回值。
        async workflowRunArtifacts(params) {
            await ensureHandshake();
            return agentService.conversationWorkflowRunArtifactsV4({
                ...workspace,
                sessionId: params.sessionId,
                runId: params.runId,
            });
        },
        async workflowRunArtifactData(params) {
            await ensureHandshake();
            return agentService.conversationWorkflowRunArtifactDataV4({
                ...workspace,
                sessionId: params.sessionId,
                runId: params.runId,
                artifactId: params.artifactId,
                ...(params.afterSequence !== undefined ? { afterSequence: params.afterSequence } : {}),
                ...(params.limit !== undefined ? { limit: params.limit } : {}),
            });
        },
        async workflowRunArtifactRead(params) {
            await ensureHandshake();
            return agentService.conversationWorkflowRunArtifactReadV4({
                ...workspace,
                sessionId: params.sessionId,
                runId: params.runId,
                artifactId: params.artifactId,
                version: params.version,
                offset: params.offset,
                limit: params.limit,
            });
        },
        // dwf 脚本 transcript 的两条读面。
        async workflowRunWorkspace(params) {
            await ensureHandshake();
            return agentService.conversationWorkflowRunWorkspaceV4({
                ...workspace,
                sessionId: params.sessionId,
                runId: params.runId,
            });
        },
        async workflowRunNodeResult(params) {
            await ensureHandshake();
            return agentService.conversationWorkflowRunNodeResultV4({
                ...workspace,
                sessionId: params.sessionId,
                runId: params.runId,
                siteId: params.siteId,
                ordinal: params.ordinal,
                ...(params.maxBytes !== undefined ? { maxBytes: params.maxBytes } : {}),
            });
        },
    };
}
//# sourceMappingURL=agentConversationTransportWorkflowRuns.js.map