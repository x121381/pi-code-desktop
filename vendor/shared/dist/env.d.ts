import type { ZCodeRuntimeEnv } from "./runtimeEnv.js";
export type ZCodeEnv = "test" | "production";
/** 安装包身份：决定应用名、app id、Electron 数据目录与更新策略；与后端环境 `ZCodeEnv` 是两个轴。 */
export type ZCodeProductFlavor = "production" | "preview";
export type ArmsRumEnv = "local" | "prod";
export declare function normalizeZCodeEnv(value: string | undefined): ZCodeEnv;
export declare const ZCODE_ENV: ZCodeEnv;
/**
 * 身份缺省跟随后端环境（test → preview，production → production）。
 * 桌面构建通过 `ZCODE_PREVIEW_IDENTITY=1` 显式注入 preview，得到连接生产后端的 Preview 包；
 * 未注入 define 的 bundle（web、CLI、测试）沿用旧的单轴语义。
 */
export declare function normalizeZCodeProductFlavor(value: string | undefined, zcodeEnv: ZCodeEnv): ZCodeProductFlavor;
export declare const ZCODE_PRODUCT_FLAVOR: ZCodeProductFlavor;
export declare const ZCODE_APP_VERSION_ENV: "ZCODE_APP_VERSION";
export declare const ZCODE_BUILD_COMMIT_ID_ENV: "ZCODE_BUILD_COMMIT_ID";
export declare const RUNTIME_ZCODE_DEBUG: string | undefined;
/** ARMS RUM 上报地址；为空时 SDK 以 enable=false 初始化，不产生上报。 */
export declare const ZCODE_ARMS_RUM_ENDPOINT: string;
/** 事件上报（数仓）地址；为空时不上报。 */
export declare const ZCODE_TELEMETRY_REPORT_ENDPOINT: string;
/** 桌面自动更新是否启用。 */
export declare const ZCODE_AUTO_UPDATE_ENABLED: boolean;
/** 将本地运行态与编译期 ZCODE_ENV 映射为 ARMS 控制台识别的上报环境标签 */
export declare function mapZCodeEnvToArmsRumEnv(runtimeEnv: ZCodeRuntimeEnv): ArmsRumEnv;
//# sourceMappingURL=env.d.ts.map