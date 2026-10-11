const roleTextClasses = {
    system: "text-foreground-subtle",
    user: "text-trajectory-user/80",
    assistant: "text-trajectory-assistant/80",
    reasoning: "text-trajectory-reasoning/80",
    "tool-call": "text-trajectory-tool-call/80",
    "tool-result": "text-trajectory-tool-result/80",
};
export function trajectoryRoleTextClass(role) {
    return roleTextClasses[role];
}
//# sourceMappingURL=ModelTrajectoryRoleStyles.js.map