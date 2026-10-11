import { createBigModelProviderRuntimeConfig } from "./providers/bigmodelProviderConfig.js";
import { createZaiProviderRuntimeConfig } from "./providers/zaiProviderConfig.js";
/**
 * 从运行时环境变量生成 OAuth 配置。
 *
 * 注意：这里只能在 host process 使用，避免把敏感配置暴露给 renderer。
 */
export function createOAuthRuntimeConfig(env = process.env) {
    return {
        providers: [createBigModelProviderRuntimeConfig(env), createZaiProviderRuntimeConfig(env)],
    };
}
//# sourceMappingURL=runtimeConfig.js.map