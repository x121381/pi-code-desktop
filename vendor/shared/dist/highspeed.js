import { z } from "zod";
import { modelExecutionSelectionFallbackReasonSchema, } from "./model-execution.js";
import { BUILTIN_MODEL_PROVIDER_IDS } from "./model-provider-types.js";
/**
 * 卡在 Turn 中过期时加速网关返回的业务错误码（HTTP 400 / provider_code=3402）。
 * 见 docs/highspeed/highspeed-card-spec.md：命中它要保留上下文并退回原模型跑完本轮。
 */
export const HIGHSPEED_CARD_EXPIRED_PROVIDER_ERROR_CODE = "3402";
/**
 * 加速卡的隐藏 Built-in Provider；端点与模型名单由 ZCode Built-in Provider Config 提供
 * （config/provider/zcode-builtin.json），这里只保留跨层引用的 ID。
 * 与 Off-Peak 同规则按账号 Family 拆分：卡是对当前账号 Coding Plan 权益的抽取，
 * 不跨 Family 静默迁移。
 */
export const HIGHSPEED_PROVIDER_IDS = {
    zai: "account:zai-highspeed-card",
    bigmodel: "account:bigmodel-highspeed-card",
};
export function resolveHighspeedProviderId(family) {
    return HIGHSPEED_PROVIDER_IDS[family];
}
/**
 * 判定一次 Selection 是否指向加速卡 Provider。拆 Family 之后不能再和单个常量比较，
 * 否则 BigModel 账号的卡在队列提升时会被判成「非加速」而静默丢卡。
 */
export function isHighspeedProviderId(providerId) {
    if (providerId === undefined)
        return false;
    return Object.values(HIGHSPEED_PROVIDER_IDS).some((id) => id === providerId);
}
/**
 * draw body 的 provider 契约值：服务端 highspeed 白名单只认 Coding Plan 的 builtin 身份
 * （builtin:zai-coding-plan / builtin:bigmodel-coding-plan，2026-09-17 与服务端确认；
 * 设计文档示例里的 "zai" 是缩写示意，非线上取值）。Start Plan、Off-Peak、API Key 与
 * 自定义 Provider 都不在白名单内，必须解析为 null 后降级，禁止映射后发送。
 */
export const HIGHSPEED_DRAW_PROVIDER_IDS = {
    zai: "builtin:zai-coding-plan",
    bigmodel: "builtin:bigmodel-coding-plan",
};
const HIGHSPEED_DRAW_PROVIDER_ID_BY_PROVIDER_ID = new Map([
    [BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan, HIGHSPEED_DRAW_PROVIDER_IDS.zai],
    [BUILTIN_MODEL_PROVIDER_IDS.zaiTeamCodingPlan, HIGHSPEED_DRAW_PROVIDER_IDS.zai],
    [BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan, HIGHSPEED_DRAW_PROVIDER_IDS.bigmodel],
    [BUILTIN_MODEL_PROVIDER_IDS.bigmodelTeamCodingPlan, HIGHSPEED_DRAW_PROVIDER_IDS.bigmodel],
]);
/** 把会话选择的 Provider ID 解析成 draw body 可用的白名单 provider 值；不命中返回 null。 */
export function resolveHighspeedDrawProviderId(providerId) {
    return HIGHSPEED_DRAW_PROVIDER_ID_BY_PROVIDER_ID.get(providerId) ?? null;
}
export const highspeedCardSchema = z.object({
    card_id: z.string().min(1),
    task_id: z.string().min(1),
    provider: z.string().min(1),
    model: z.string().min(1),
    issued_at: z.number().int().nonnegative(),
    expires_at: z.number().int().nonnegative(),
});
/**
 * 写入 message.data 的协议级卡快照。版本字段保证后续扩展仍能宽容读取旧消息。
 */
export const highspeedMessageMetaSchema = z
    .object({
    schemaVersion: z.literal(1),
    cardId: z.string().min(1),
    taskId: z.string().min(1),
    provider: z.string().min(1),
    model: z.string().min(1),
    issuedAt: z.number().int().nonnegative(),
    expiresAt: z.number().int().nonnegative(),
    /** 发送该轮时从 Coding Plan 健康检查采样的普通 Pro/Max decode TPS。 */
    regularTps: z.number().positive().optional(),
    /** 完成态统计；这些字段由同一次 CLI 持久化更新原子写入。 */
    outputTokens: z.number().int().nonnegative().optional(),
    durationMs: z.number().nonnegative().optional(),
    /** 卡到期后从 Highspeed healthy usage 采样的卡级平均 completion TPS。 */
    highspeedTps: z.number().positive().optional(),
    savedDurationMs: z.number().nonnegative().optional(),
    /** CLI 从运行时事件聚合的真实耗时拆分；缺省时客户端回退到 20/80 估算。 */
    modelDurationMs: z.number().nonnegative().optional(),
    toolDurationMs: z.number().nonnegative().optional(),
    otherDurationMs: z.number().nonnegative().optional(),
    /** Turn 内加速请求失败并回落普通模型的时刻；只用于投影降级提示，不改变分享统计。 */
    fallbackAt: z.number().int().nonnegative().optional(),
    /** 回落原因：卡过期或其他加速请求失败；Renderer 据此选择提示文案，缺省按卡过期处理旧数据。 */
    fallbackReason: modelExecutionSelectionFallbackReasonSchema.optional(),
})
    .strict();
export const highspeedDrawRequestSchema = z.object({
    task_id: z.string().min(1),
    provider: z.string().min(1),
    model: z.string().min(1),
});
export const highspeedDrawResponseSchema = z.object({
    code: z.number().int(),
    msg: z.string(),
    data: z.object({
        card: highspeedCardSchema.nullable(),
        next_draw_at: z.number().int().nonnegative(),
    }),
});
export const highspeedHealthyResponseSchema = z.object({
    code: z.number().int(),
    msg: z.string(),
    data: z.object({
        card_id: z.string().min(1),
        prompt_tokens: z.number().int().nonnegative(),
        completion_tokens: z.number().int().nonnegative(),
        duration_seconds: z.number().int().nonnegative(),
    }),
});
//# sourceMappingURL=highspeed.js.map