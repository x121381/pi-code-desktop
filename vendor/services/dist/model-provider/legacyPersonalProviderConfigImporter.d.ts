import { type ProviderConfigLayerUpdate } from "@zcode/provider";
import { type ModelProviderConfig } from "./legacyModelProviderSerialized.js";
interface LegacyPersonalProviderConfigImportInput {
    readonly legacyProviders: readonly ModelProviderConfig[];
}
/**
 * 从旧 Effective Store 中只提取仍能确认的 Personal 用户意图。
 *
 * 旧 Store 把 Built-in、Catalog enrichment、设置页默认值和用户输入写在同一
 * 个模型对象里。迁移整份对象或与当前 Built-in 求差异，都会把系统生成事实冻结成
 * Personal Overlay；因此这里只保留自定义 Provider 调用配置、成员顺序和 context。
 */
export declare function importLegacyPersonalProviderConfig(input: LegacyPersonalProviderConfigImportInput): ProviderConfigLayerUpdate;
export {};
//# sourceMappingURL=legacyPersonalProviderConfigImporter.d.ts.map