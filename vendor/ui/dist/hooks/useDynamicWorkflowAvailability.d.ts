import type { ICodingPlanSubscriptionService, IZCodeAgentService } from "@zcode/services";
import type { DynamicWorkflowMode } from "@zcode/shared";
import { type DynamicWorkflowAvailabilitySnapshot } from "@/store/dynamicWorkflowAvailabilityStore.js";
/**
 * 读动态工作流灰度快照。
 * 只读，不触发请求：取数由 Root 里的 loader 唯一负责。消费方（自动化页、run 面板）可能位于
 * 工作区级 ServiceProvider 内（远程 Host 的 accessor），让它们各自取数会把 app 级那一份覆盖掉。
 */
export declare function useDynamicWorkflowAvailability(): DynamicWorkflowAvailabilitySnapshot;
/**
 * app 会话级取数，挂在 Root 里一次。service 换了（手机 `/remote` 完成工作区桥接）会重试，
 * 取数与失败重试的规则见 dynamicWorkflowAvailabilityStore。
 */
export declare function useDynamicWorkflowAvailabilityLoader(service: ICodingPlanSubscriptionService): void;
/**
 * 用户选择变化后的同步（docs/dynamic-workflow/launch.md「The user's choice」），挂在 Root 里一次。
 * 设置文件是选择的唯一来源；任何窗口写入后，共享设置广播让每个窗口的 Root 都读到新值，
 * 各自通知本窗口的 Host（重发 CLI 策略、转发给远程 Host），Host 处理完再重读快照。
 *   - 首次读到的值只是基线：启动时 Host 自己会读设置文件，不需要信号；
 *   - 多次变化串行：上一轮「信号 → 重读」完成后才开始下一轮，慢的重读不会盖掉新结果；
 *   - Host 同步失败仍重读：快照以 Host 当前算出的结果为准。
 */
export declare function useDynamicWorkflowUserModeSync(params: {
    settingsLoaded: boolean;
    userMode: DynamicWorkflowMode | undefined;
    zcodeAgentService: Pick<IZCodeAgentService, "syncDynamicWorkflowUserMode">;
    codingPlanSubscriptionService: ICodingPlanSubscriptionService;
}): void;
//# sourceMappingURL=useDynamicWorkflowAvailability.d.ts.map