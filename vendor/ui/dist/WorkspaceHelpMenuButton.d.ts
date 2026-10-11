export declare function WorkspaceHelpMenuButton({ className, isDesktop, }: {
    className?: string;
    /**
     * 是否桌面端。由挂载处注入而不是在组件内嗅探：Web 的 IPlatformService 桩同样实现了
     * executeDesktopCommand（no-op），拿它判定会让 Web 端出现一个点了没反应的「资源管理器」。
     */
    isDesktop?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkspaceHelpMenuButton.d.ts.map