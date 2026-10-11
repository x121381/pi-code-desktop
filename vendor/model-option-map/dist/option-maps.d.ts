import { type JsonObject } from "./types.js";
export interface ModelOptionMapSpecs {
    readonly reasoningLevel: {
        readonly map: string;
    };
    readonly maxOutputTokens: {
        readonly map: string;
    };
}
export interface ModelOptionValues {
    readonly reasoningLevel: string;
    readonly maxOutputTokens: number;
}
export interface CompiledModelOptionMaps {
    apply(body: JsonObject, values: ModelOptionValues): JsonObject;
}
/** Model 创建时编译一次；每个请求只绑定本轮冻结的 Option value。 */
export declare function compileModelOptionMaps(specs: ModelOptionMapSpecs): CompiledModelOptionMaps;
//# sourceMappingURL=option-maps.d.ts.map