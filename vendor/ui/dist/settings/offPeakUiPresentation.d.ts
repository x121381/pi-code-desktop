import type { ZCodeOffPeakTask } from "@zcode/shared";
import type { IntlInstance } from "@/i18n/IntlProvider.js";
import type { OffPeakTakeNumberAvailabilityStatus } from "@/store/offPeakTaskStore.js";
export type OffPeakCreateBlockReason = "plan" | "quota" | "unavailable";
/** 闲时创建禁用原因属于长提示，不能沿用通用短 Tooltip 的单行布局。 */
export declare const OFF_PEAK_CREATE_TOOLTIP_CLASSNAME = "max-w-[220px] [&>span]:break-words [&>span]:whitespace-normal [&>span]:text-wrap-pretty";
/** 只有服务端成功确认可取号才放行创建，其余资格与依赖状态全部 fail-closed。 */
export declare function resolveOffPeakCreateBlockReason({ availabilityStatus, canTakeNumber, grayEnabled, noPlan, }: {
    availabilityStatus: OffPeakTakeNumberAvailabilityStatus;
    canTakeNumber: boolean | undefined;
    grayEnabled: boolean;
    noPlan: boolean;
}): OffPeakCreateBlockReason | null;
/** 将服务端绝对恢复点转换成只包含小时/分钟的本地化剩余时长。 */
export declare function formatOffPeakRemainingWait(nextTakeAt: number, now: number, intl: IntlInstance): string;
export type OffPeakStatusIconKind = "moon" | "pause" | "spinner" | "success" | "warning" | "stopped";
export interface OffPeakStatusFooterPresentation {
    icon: OffPeakStatusIconKind;
    className: string;
    labelId: string;
    labelValues?: Record<string, string>;
}
/**
 * 只同步仍保持自动默认值的创建态标题。
 * locale 切换后不能覆盖用户输入、模板草稿或已保存任务标题。
 */
export declare function resolveLocalizedOffPeakCreateTitle({ currentTitle, hasInitialTitle, isEditing, nextDefaultTitle, previousDefaultTitle, titleTouched, }: {
    currentTitle: string;
    hasInitialTitle: boolean;
    isEditing: boolean;
    nextDefaultTitle: string;
    previousDefaultTitle: string;
    titleTouched: boolean;
}): string;
/** 闲时卡片状态图标与文案的唯一映射，避免带位次的 paused 被误画成 queued 月亮。 */
export declare function resolveOffPeakStatusFooter(task: Pick<ZCodeOffPeakTask, "queuePosition" | "status">): OffPeakStatusFooterPresentation;
/** 终态任务不会再被调度，不能把历史选择失效显示成当前待修复错误。 */
export declare function shouldShowOffPeakModelSelectionIssue(status: Pick<ZCodeOffPeakTask, "status">["status"]): boolean;
/**
 * 失败任务仍保留服务端返回的排队位次时，单独渲染弱化位次。
 * 主状态映射只能返回一个 footer；失败状态需额外保留队列上下文，避免被 Failure 覆盖。
 */
export declare function resolveFailedOffPeakQueueFooter(task: Pick<ZCodeOffPeakTask, "queuePosition" | "status">): OffPeakStatusFooterPresentation | null;
//# sourceMappingURL=offPeakUiPresentation.d.ts.map