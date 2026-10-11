export function resolveZCodeAgentPresentationSurface(facts) {
    // Desktop 呈现能力必须从 Host 已有的可信装配事实推导，不能让每个调用方重复传递独立开关。
    // 普通 HTTP/manual app-server 没有这两个事实，继续保持 terminal，避免把 Desktop prompt 扩散出去。
    const isDesktopHost = facts.runtimeSurface === "desktop_local_host" ||
        facts.serviceAuthorityMode === "desktop-attached-remote";
    if (!isDesktopHost || facts.desktopContextPromptEnabled === false) {
        return undefined;
    }
    return "desktop";
}
//# sourceMappingURL=zcodeAgentPresentationSurface.js.map