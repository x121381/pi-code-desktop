import { type ConversationShareArtifactDescriptor, type ConversationShareConfirmRequest } from "@zcode/shared";
type ConversationShareConfirmRequestBase = Omit<ConversationShareConfirmRequest, "integrity"> & {
    artifacts: ConversationShareArtifactDescriptor[];
};
export declare function canonicalizeConversationShareJson(value: unknown): string;
export declare function sha256ConversationShareJson(value: unknown): string;
export declare function buildConversationShareConfirmRequest(input: ConversationShareConfirmRequestBase): ConversationShareConfirmRequest;
/**
 * 用服务端**原样发来的** rows / artifacts 复核两个摘要。
 *
 * 关键点是「原始值」：以前这里拿的是 zod 解析产物，而 zod 默认剥掉未知字段，所以发布端
 * 只要给 row 加一个 optional 字段，老导入端重算的哈希就必然不一致，报出「分享文件校验
 * 失败」——一条看着像被篡改的告警，加一个永远不会成功的重试按钮。
 *
 * 校验对原始字节之后，完整性与 schema 认知彻底解耦：schema 可以自由 additive 演进，而
 * 哈希不一致重新变成它本该表达的意思——内容真的被改过或损坏了。
 */
export declare function verifyConversationShareIntegrity(input: {
    rawRows: unknown;
    rawArtifacts: unknown;
    integrity: {
        projection_sha256: string;
        artifact_set_sha256: string;
    };
}): boolean;
export {};
//# sourceMappingURL=conversationShareIntegrity.d.ts.map