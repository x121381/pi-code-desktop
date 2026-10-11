import { type StorageManagementBridge } from "@zcode/shared";
export declare function StorageSection({ bridge, active, }: {
    /** preload 暴露的 window.resourceManager.storage；缺省表示桥接不可用 */
    bridge: StorageManagementBridge | undefined;
    /** tab 是否处于激活态：激活才扫描，切走即取消 */
    active: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=StorageSection.d.ts.map