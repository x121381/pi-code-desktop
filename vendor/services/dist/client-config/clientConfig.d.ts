import { type ClientConfigReadOptions, type ClientConfigSnapshot } from "@zcode/shared";
/** 窗口级公开配置读取。业务模块只消费自己的字段，不拥有第二份请求缓存。 */
export interface IClientConfigService {
    getSnapshot(options?: ClientConfigReadOptions): Promise<ClientConfigSnapshot>;
}
export declare const IClientConfigService: import("../descriptors.js").ServiceDescriptor<IClientConfigService>;
//# sourceMappingURL=clientConfig.d.ts.map