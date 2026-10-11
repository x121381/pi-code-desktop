import type { DynamicWorkflowClientConfig } from "@zcode/shared";
import type { ICodingPlanSubscriptionService } from "@zcode/services";
export type DynamicWorkflowAvailabilityStatus = "loading" | "ready";
export interface DynamicWorkflowAvailabilitySnapshot {
    readonly status: DynamicWorkflowAvailabilityStatus;
    /** loading 期间恒为 false：未知即不提供，入口宁可晚半拍出现也不闪一下再收起。 */
    readonly enabled: boolean;
    /**
     * 未就绪或取数失败时为 null；`source` 只用于观测，区分「服务端关」与「本地覆盖」。
     * `offeredMode` 是服务端提供的模式（设置行是否出现、哪个选项标「默认」），`mode` 是生效模式。
     */
    readonly config: DynamicWorkflowClientConfig | null;
}
interface DynamicWorkflowAvailabilityState extends DynamicWorkflowAvailabilitySnapshot {
    /** 首次取数；同一个 service 出过结果后是 no-op，并发调用共用同一次请求。 */
    ensureLoaded(service: ICodingPlanSubscriptionService): Promise<void>;
    /** 绕过闩与 Host 的 1h 快照缓存重取（forceRefresh）。 */
    refresh(service: ICodingPlanSubscriptionService): Promise<void>;
    /**
     * 绕过闩但不 forceRefresh：用户改了动态工作流选择、Host 重发策略之后重读生效值
     * （launch.md「The user's choice」）。服务端的「提供」没变，不需要重拉 client/configs。
     */
    reload(service: ICodingPlanSubscriptionService): Promise<void>;
}
export declare const useDynamicWorkflowAvailabilityStore: import("zustand").UseBoundStore<import("zustand").StoreApi<DynamicWorkflowAvailabilityState>>;
/** 测试用：清掉快照与「已出结果」闩。 */
export declare function resetDynamicWorkflowAvailabilityStoreForTests(): void;
export {};
//# sourceMappingURL=dynamicWorkflowAvailabilityStore.d.ts.map