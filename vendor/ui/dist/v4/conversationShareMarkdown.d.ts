/**
 * 分享正文不能把本地 citation directive 直接交给 MessageResponse：它既会暴露路径，
 * 也会在拥有 workspace authority 的情况下被解释成文件操作。公开投影只保留唯一匹配
 * 的 artifact display name；代码块里的协议示例由 directive parser 保护并保持原文。
 *
 * 同时剥离远程图片的自动加载，见 degradeRemoteImages。
 */
export declare function normalizeConversationShareMarkdown(markdown: string, artifactNames?: ReadonlyMap<string, string>): string;
//# sourceMappingURL=conversationShareMarkdown.d.ts.map