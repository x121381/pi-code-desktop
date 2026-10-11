/**
 * 遥测文本与模型身份的脱敏收口。
 *
 * ARMS 自动采集的 exception / api / click 事件，以及自定义事件里带自由文本的字段，都可能包含
 * 本机路径、邮箱、完整 URL 和凭据。这里提供纯函数实现，供 desktop main 的 `beforeReport` 与
 * renderer 侧埋点共用，避免每个埋点各写一份模式。
 *
 * 模式与 CLI 的 `apps/zcode-cli/packages/telemetry/src/error-sanitizer.ts` 保持一致；两者位于不同
 * workspace 且不允许互相依赖，扩展任一侧时必须同步另一侧。
 */
/** 单字段默认上限；ARMS 单字段过长会被截断或拒绝，主动截断保证关键头部一定上得去。 */
export declare const TELEMETRY_TEXT_MAX_LENGTH = 2048;
export interface RedactTelemetryTextOptions {
    /** 输出上限，默认 {@link TELEMETRY_TEXT_MAX_LENGTH}。 */
    maxLength?: number;
}
/**
 * 把自由文本清洗成可上报形态：URL 去 query、路径/邮箱/凭据归一为占位符，并有界截断。
 *
 * 只作用于上报副本；错误展示、本地日志、崩溃归档和分类逻辑必须继续使用原值。
 */
export declare function redactTelemetryText(value: string | undefined | null, options?: RedactTelemetryTextOptions): string;
/**
 * 把 URL 清洗成 `protocol//host` 加归一化路由；丢弃 query 与 fragment。
 *
 * `file://`、本地绝对路径归一为 `local_file`，`blob:` / `data:` 只保留协议标记，
 * 无法解析时返回 `unknown`，不回退到原值。
 */
export declare function redactTelemetryUrl(value: string | undefined | null): string;
/**
 * telemetry 模型白名单：只有这里的内置稳定模型 ID 允许原样进入遥测。
 *
 * 白名单独立于账号返回的运行时 catalog，但以人工维护的官方 GLM 名单为来源：
 * 修复原因：此前手抄一份列表漏掉了 GLM-5.3 / GLM-5.3-Flash / GLM-5V-Turbo，导致旗舰模型在
 * plan_* / perf_ui_* 里整体写成 `custom`。派生自官方名单后，两处不会再各自漂移。
 */
export declare const TELEMETRY_SAFE_BUILTIN_MODEL_IDS: ReadonlySet<string>;
export type TelemetryProviderScope = "builtin" | "custom" | "unknown";
export interface TelemetryProviderIdentity {
    providerId: string;
    providerScope: TelemetryProviderScope;
}
/** 内置 provider 保留稳定 ID；自定义 provider 由用户命名，原样上报会泄露私有名称并制造高基数。 */
export declare function resolveTelemetryProviderScope(providerId: string | undefined | null): TelemetryProviderIdentity;
/**
 * 只保留白名单内的内置模型 ID。
 *
 * 自定义 provider 的模型、内置 provider 下未命中白名单的模型统一写 `custom`；
 * provider scope 未知或模型缺失时写空串，与既有留空口径一致。
 */
export declare function resolveTelemetryModelId(providerScope: TelemetryProviderScope, modelId: string | undefined | null): string;
/**
 * 归一化「只拿到一个模型值、没有独立 provider 字段」的场景。
 *
 * 支持三种形态：`custom:<providerId>[:<modelName>]` 编码值、`<providerId>/<modelId>` 复合值和
 * 裸模型 ID。裸 ID 直接按白名单判定，未命中一律降级为 `custom`——这正是「新增内置模型未进入
 * 白名单时必须默认降级」的要求，因此不需要调用方额外传 provider。
 */
export declare function sanitizeTelemetryModelValue(value: string | undefined | null): string;
//# sourceMappingURL=telemetryRedaction.d.ts.map