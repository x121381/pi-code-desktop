export declare function migrateLegacyOfficialGlmModelId(providerId: string, modelId: string): string;
/**
 * 仅供已发布旧数据的单向升级使用，不是运行时 Provider 别名或选择兜底。
 * 依赖当前账号解释旧 Coding Plan 会使离线/SSH 迁移丢失原意图。
 * 同域 Individual 仅是确定性迁移落点，当前账号对应留给有效选择解析，不能据此绑定执行。
 * 迁移不查模型/档位是否可用；普通未知 ID 不构成旧格式证据。
 */
export declare function migrateLegacyModelProviderId(providerId: string): string | undefined;
//# sourceMappingURL=legacy-model-provider-identity.d.ts.map