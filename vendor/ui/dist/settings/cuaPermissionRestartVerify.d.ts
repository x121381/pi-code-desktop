import { type CuaPermissionStatusResult } from "@zcode/services";
export interface WaitForAccessibilityNotStaleOptions {
    /** 总超时(默认 6s):覆盖 tccd 传播 lag,首轮通常立即 granted。 */
    timeoutMs?: number;
    /** 轮询间隔(默认 500ms)。 */
    intervalMs?: number;
}
export type GetCuaPermissionStatusFn = () => Promise<CuaPermissionStatusResult>;
/**
 * 重启 Helper 后轮询 accessibility,判断是否脱离 stale。
 *
 * @returns `false` —— accessibility 在超时内脱离 stale(granted/denied/unknown),无需升级。
 *          `true`  —— 直到超时仍 stale(或持续 unavailable/抛错),升级到"重启 ZCode"兜底。
 *
 * 语义说明:
 *  - `granted` → 重启吃到授权了,解决。
 *  - `denied`/`unknown` → 是真实权限缺口(用户没授权),不是"重启失败",不升级(交给授权引导)。
 *  - `stale` 持续 → tccd 缓存没刷新 / 重启机制卡住 → 升级。
 *  - unavailable / 抛错 → 重启中途瞬时态,继续轮询;超时仍未恢复 → 升级。
 */
export declare function waitForAccessibilityNotStale(getStatus: GetCuaPermissionStatusFn, options?: WaitForAccessibilityNotStaleOptions): Promise<boolean>;
//# sourceMappingURL=cuaPermissionRestartVerify.d.ts.map