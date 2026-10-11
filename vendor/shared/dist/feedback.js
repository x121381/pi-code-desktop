/**
 * UI 层 Select 不允许空字符串作为可选项 value（Radix 会抛错），
 * 这里给『未指定』提供一个 sentinel；提交工单前会被转换成 undefined。
 */
export const FEEDBACK_FRAMEWORK_NONE = "none";
export const FEEDBACK_TICKET_MODULES = [
    "Plugin / MCP",
    "Agent任务执行失败",
    "模型配置 / API Key",
    "模型调用报错",
    "权限 / 配置保存",
    "SSH连接失败",
    "WSL连接失败",
    "UI布局 / 交互",
    "模型响应慢 / 额度",
    "崩溃 / Internal Error",
    "文档 / 使用咨询",
    "其它",
];
export const FEEDBACK_TICKET_TYPES = [
    { value: "bug", label: "Bug 反馈" },
    { value: "usage", label: "使用问题" },
    { value: "feature", label: "功能建议" },
    { value: "performance", label: "性能问题" },
];
export const FEEDBACK_TICKET_SEVERITIES = ["P1-高", "P2-中", "P3-低"];
export const DEFAULT_FEEDBACK_TICKET_FRAMEWORK = "zcode-agent";
export const FEEDBACK_TICKET_FRAMEWORK_OPTIONS = [{ value: "zcode-agent", label: "ZCode Agent" }];
/** 含「未指定」的完整列表，供管理端等场景使用。 */
export const FEEDBACK_TICKET_FRAMEWORKS = [{ value: FEEDBACK_FRAMEWORK_NONE, label: "未指定" }, ...FEEDBACK_TICKET_FRAMEWORK_OPTIONS];
//# sourceMappingURL=feedback.js.map