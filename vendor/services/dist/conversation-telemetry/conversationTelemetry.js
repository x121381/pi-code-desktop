export function createConversationTelemetryService(zcodeAgentService) {
    return {
        onFact: (target) => 
        // 带 workspace 参数的 RPC Event 必须使用 onDynamic* 命名，
        // 否则 ProxyChannel 会把它当普通 Event，并把 target 误当 listener。
        zcodeAgentService.onDynamicConversationTelemetryFact(target),
    };
}
//# sourceMappingURL=conversationTelemetry.js.map