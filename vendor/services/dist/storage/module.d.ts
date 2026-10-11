/**
 * storage 模块清单：设置页「存储管理」的磁盘占用扫描与清理。
 * 依赖声明与 architecture-policy.yaml 保持一致；对外只暴露 contract.ts。
 */
export declare const storageModule: {
    readonly id: "storage";
    readonly requires: readonly ["shared", "rpc", "services"];
    readonly provides: readonly ["storage-service"];
    readonly publicEntrypoints: readonly ["contract.ts"];
};
//# sourceMappingURL=module.d.ts.map