import type { ZCodePluginStoreListing } from "./zcode-protocol/index.js";
/** listing 的多语言字段先精确匹配，再按语言前缀兜底。 */
export declare function resolveLocalizedText(locale: string, base: string | undefined, i18n: Record<string, string> | undefined): string | undefined;
export declare function formatCanonicalPluginName(name: string, locale: string): string;
/**
 * 用户可见插件名称只信任与完整 Plugin ID 关联的 listing；缺失时才回退到 canonical slug。
 * 不按裸 manifest name 猜测官方产品名，避免同名 marketplace 插件互相覆盖。
 */
export declare function resolvePluginDisplayName(plugin: {
    name: string;
    listing?: ZCodePluginStoreListing;
}, locale: string): string;
//# sourceMappingURL=plugin-display-name.d.ts.map