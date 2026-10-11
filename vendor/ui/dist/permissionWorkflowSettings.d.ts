import type { ZCodePermissionOption } from "@zcode/shared";
import type { WorkflowAskSettingsContent } from "@/components/workflow-timeline/workflowAskSettings.js";
/** 设置块的定位属性：Shift+Tab 从第一个选项回到这里。 */
export declare const WORKFLOW_PERMISSION_SETTINGS_SELECTOR = "[data-testid=\"workflow-permission-settings\"]";
/**
 * 窗里改过的设置与「所选模型不可用」。两份状态都记下它属于哪个 requestId，读时不匹配即视为没有：
 * 同一个对话框实例换请求时不靠 effect 归零——子组件按 requestId 重挂后会先回报新请求的状态，
 * 父组件的归零 effect 晚于它执行，会把新回报的「不可用」抹掉。
 */
export declare function usePermissionWorkflowSettings(requestId: string): {
    content: WorkflowAskSettingsContent | undefined;
    blocked: boolean;
    onBlockedChange: (value: boolean) => void;
    onContentChange: (value: WorkflowAskSettingsContent | undefined) => void;
};
/** 设置只随放行应答走：拒绝什么都不启动，Refine 的下一个窗带着模型改过的调用重来。 */
export declare function isWorkflowSettingsCarrier(option: ZCodePermissionOption): boolean;
/** 改过设置后，前两个选项说清这次应答带着什么走；其余描述不变。 */
export declare function workflowAdjustedOptionDescriptionId(messageId: string | null): string | null;
/**
 * Shift+Tab 在第一个选项上：离开选项列表，落到设置块的最后一个控件（倒着走的下一站），
 * 让焦点次序与阅读次序一致。块不在或没有可聚焦控件即返回 false，交回选项列表自己的循环。
 */
export declare function focusLastWorkflowSettingsControl(root: HTMLElement | null): boolean;
//# sourceMappingURL=permissionWorkflowSettings.d.ts.map