export interface AppCaCertPaths {
    certPath: string;
    keyPath: string;
}
export declare function getAppCaCertPaths(): AppCaCertPaths;
/**
 * 确保 app 自签 CA 存在；缺失时生成一份。返回证书（公钥）路径。
 * 幂等：证书与私钥都已存在时直接返回，不重新生成。
 */
export declare function ensureAppCaCert(): string;
//# sourceMappingURL=appCaCert.d.ts.map