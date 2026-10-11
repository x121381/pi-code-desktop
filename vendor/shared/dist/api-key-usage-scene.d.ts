/** Key 的创建用途；独立于 keyType，不包含仅供存量映射/缓存哨兵的 3 和 -1。 */
export declare const API_KEY_USAGE_SCENE: {
    readonly CODING_PLAN: 1;
    readonly STANDARD: 2;
};
export type ApiKeyCreationUsageScene = (typeof API_KEY_USAGE_SCENE)[keyof typeof API_KEY_USAGE_SCENE];
//# sourceMappingURL=api-key-usage-scene.d.ts.map