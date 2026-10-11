import type { ArmsCustomEventPayload } from "@zcode/shared";
export interface ArmsCustomEventE2EEntry extends ArmsCustomEventPayload {
    recordedAt: number;
}
type ArmsCustomEventDebugWindow = Window & {
    __zcodeArmsCustomEventsE2E?: ArmsCustomEventE2EEntry[];
};
/**
 * 仅 E2E 构建记录 renderer 实际提交给 desktop bridge 的 ARMS payload。
 * 缓冲保持有界，且生产构建不创建 window 字段，避免形成第二套持久化或回放通道。
 */
export declare function recordArmsCustomEventForE2E(payload: ArmsCustomEventPayload, options?: {
    enabled?: boolean;
    host?: ArmsCustomEventDebugWindow;
    now?: () => number;
}): void;
export {};
//# sourceMappingURL=armsCustomEventObservability.d.ts.map