import { type HighspeedCardUsage, type HighspeedCardSnapshot, type HighspeedDrawRequest, type HighspeedDrawResponse, type HighspeedPrepareTurnParams, type HighspeedPrepareTurnResult, type HighspeedServiceSnapshot, type HighspeedTurnExecution, type ModelSelection } from "@zcode/shared";
import type { IHighspeedCardService } from "./highspeedCard.js";
export { createHighspeedHttpTransport } from "./highspeedHttpTransport.js";
export interface HighspeedServiceTransport {
    draw(request: HighspeedDrawRequest): Promise<HighspeedDrawResponse>;
    healthy(cardId: string): Promise<HighspeedCardUsage>;
}
/**
 * 加速推理的动态鉴权材料。加速走 /api/v1/highspeed/ 网关，与 draw 复用同一套 Coding Plan
 * 双 JWT 契约：zcode JWT 标识会话身份，Coding Plan 业务 JWT + Team 身份头校验套餐权益。
 * 这些字段必须来自同一次 selected connection 解析，禁止跨 Family 拼接
 * （ZAI JWT 配 BigModel key 只会在服务端取号时被拒）。
 */
export interface HighspeedInferenceAuth {
    zcodeJwt: string;
    family: "zai" | "bigmodel";
    codingPlanAuthorization: string;
    targetType: "PERSONAL" | "TEAM";
    organizationId?: string;
    projectId?: string;
}
export interface HighspeedCardServiceOptions {
    transport: HighspeedServiceTransport;
    now?: () => number;
    wait?: (milliseconds: number) => Promise<void>;
    /**
     * 加速推理动态鉴权材料。加速卡按账号 Family 拆分，不跨 Family 静默迁移；必须与 draw
     * 复用同一次 selected connection 解析。缺省夹具仅服务本地测试。
     */
    resolveInferenceAuth?: () => Promise<HighspeedInferenceAuth>;
    /** Mock 抽中只验证业务状态，消息继续走 session 当前的普通推理路由。 */
    inferenceMode?: "highspeed" | "session-default";
    /** draw 只对 Coding Plan 用户开放；缺省视为支持，保持 mock 与既有测试语义。 */
    resolveCodingPlanSupported?: () => Promise<boolean>;
    /**
     * 会话模型必须属于所选 Coding Plan Provider 的模型目录才允许发起新 draw（spec §3 规则 14）；
     * 缺省视为覆盖，保持 mock 与既有测试语义。判定异常按不通过处理，避免陈旧组合打到 draw 接口。
     */
    resolveModelCovered?: (providerId: string, modelId: string) => Promise<boolean>;
}
/**
 * Coding Plan 双 JWT + Team 身份头。draw 与加速推理走同一个 /api/v1/highspeed/ 网关、同一套
 * 鉴权中间件：两者必须携带完全一致的 Coding Plan 凭据，加速推理只是额外附带卡 ID。
 */
export declare function buildHighspeedCodingPlanAuthHeaders(params: {
    zcodeJwt: string;
    codingPlanAuthorization: string;
    targetType: "PERSONAL" | "TEAM";
    organizationId?: string;
    projectId?: string;
}): Record<string, string>;
/**
 * 构造一次加速执行的选择与动态鉴权材料。Endpoint、API 形态和模型能力等静态事实由
 * ZCode Built-in Provider Config 提供，禁止再随单次发送下发 provider 定义。
 */
export declare function buildHighspeedTurnExecution(params: {
    card: HighspeedCardSnapshot;
    auth: HighspeedInferenceAuth;
    /**
     * 抽卡时的提交选择（会话原模型 + 思考档位）。加速只换端点不换模型，execution 选择沿用它的档位，
     * 否则 CLI Registry 会因缺档位拒绝本轮；它同时是降级的退回目标，必须随 selectionFallback 下发。
     */
    sessionSelection: ModelSelection;
}): HighspeedTurnExecution;
export declare class HighspeedCardService implements IHighspeedCardService {
    private readonly transport;
    private readonly now;
    private readonly wait;
    private readonly resolveInferenceAuth;
    private readonly inferenceMode;
    private readonly resolveCodingPlanSupported;
    private readonly resolveModelCovered;
    private card;
    private nextDrawAt;
    private inFlightDraw;
    constructor(options: HighspeedCardServiceOptions);
    prepareTurn(params: HighspeedPrepareTurnParams): Promise<HighspeedPrepareTurnResult>;
    getSnapshot(): Promise<HighspeedServiceSnapshot>;
    healthy(cardId: string): Promise<HighspeedCardUsage>;
    /**
     * 新 draw 的门禁：规则 14 模型目录、规则 11 Coding Plan 支持，按序判定，返回 fallback 原因，
     * 全部通过返回 null。判定异常按不通过处理；不改变卡、冷却与 in-flight 状态。
     * 会话恢复出的陈旧（coding-plan provider, 已下线模型）组合会照常通过 provider 白名单，
     * 必须由模型目录拦下，避免把无效组合或无效凭据打到 draw 接口。
     */
    private checkDrawGates;
    /**
     * 截止时间在进入 prepareTurn 时固定；计时器按需懒创建且只建一次，后续各段 await 复用，
     * automation / 冷却 / 白名单外等同步降级路径不注册计时器。
     */
    private createSendBudget;
    private isCodingPlanSupported;
    private isModelCovered;
    private startDraw;
    private applyDrawResponse;
    private expireCard;
    private prepareWithCard;
}
//# sourceMappingURL=highspeedCardService.d.ts.map