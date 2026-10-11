export function canRenderGitActionMenu(options) {
    // Bugfix: 顶部 Git 操作入口之前把创建分支当作空状态兜底，
    // 导致干净且无需推送的仓库仍显示 Create branch，像是在提示用户必须新建分支。
    // 这里只在存在可执行的 commit / push 工作流时渲染入口，创建分支保留为菜单内的辅助动作。
    return options.actionAvailable && (options.commitEnabled || options.pushEnabled);
}
export function canUseGitActionMenu(summary) {
    return summary.isGitAvailable && summary.isRepository;
}
export function resolveGitActionMenuPrimaryAction(options) {
    // 关键业务逻辑：主按钮只承载提交或推送；创建分支保留在下拉菜单里。
    // 这样干净仓库仍可通过菜单创建分支，但不会把“提交或推送”误触发为创建分支。
    if (options.actionAvailable && options.commitEnabled) {
        return "commit";
    }
    if (options.actionAvailable && options.pushEnabled) {
        return "push";
    }
    return null;
}
export function canPushGitBranch(summary) {
    const branchName = summary.branchName?.trim() ?? "";
    if (summary.headRefType !== "branch" || branchName.length === 0) {
        return false;
    }
    return !summary.trackingBranchName || summary.ahead > 0;
}
//# sourceMappingURL=display.js.map