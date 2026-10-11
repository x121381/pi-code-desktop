import type { IntranetProbeRequest, IntranetProbeResult, SystemInfo } from "@zcode/shared";
/** 生成 request 的稳定 key，避免调用方传 inline object 时因引用变化导致重复自动探测 */
export declare function createIntranetProbeRequestStableKey(request: IntranetProbeRequest | null): string;
/** 只允许最后一次探测写回，防止并发请求乱序覆盖新状态 */
export declare function shouldApplyIntranetProbeRunResult(runId: number, latestRunId: number): boolean;
/** 获取系统信息，自带 loading/error/refresh 状态管理 */
export declare function useSystemInfo(): {
    info: SystemInfo | null;
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
};
interface UseIntranetProbeOptions {
    enabled?: boolean;
    autoProbe?: boolean;
}
/** 探测当前运行环境是否满足内网判定条件 */
export declare function useIntranetProbe(request: IntranetProbeRequest | null, options?: UseIntranetProbeOptions): {
    result: IntranetProbeResult | null;
    isIntranet: boolean;
    probing: boolean;
    error: Error | null;
    probeNow: () => Promise<IntranetProbeResult | null>;
};
export {};
//# sourceMappingURL=useSystemService.d.ts.map