import { type AppSettings, type DynamicWorkflowMode } from "@zcode/shared";
import type { DynamicWorkflowAvailabilitySnapshot } from "@/store/dynamicWorkflowAvailabilityStore.js";
/**
 * 设置行要显示什么（docs/dynamic-workflow/launch.md「The user's choice」）。快照加载中、读取失败、
 * 服务端未提供功能时都返回 null：行不渲染，灰度对用户不可见。值与「默认」都取 Host 算好的结果，
 * renderer 不自己套用户选择。
 */
export declare function resolveDynamicWorkflowModeSettingView(snapshot: DynamicWorkflowAvailabilitySnapshot): {
    value: DynamicWorkflowMode;
    offeredMode: DynamicWorkflowMode;
} | null;
/** 选回服务端提供的模式等于删除选择（空串哨兵，服务层归一成删除），安装继续跟随服务端翻转。 */
export declare function buildDynamicWorkflowModePatch(next: DynamicWorkflowMode, offeredMode: DynamicWorkflowMode): Pick<AppSettings, "dynamicWorkflowMode">;
export declare function DynamicWorkflowModeSetting(): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=DynamicWorkflowModeSetting.d.ts.map