import type { CodingPlanResetType } from "@zcode/shared";
type CodingPlanQuotaResetActionBehavior = {
    onOpenDialog: () => void;
    onReset?: never;
} | {
    onOpenDialog?: never;
    onReset: () => Promise<void>;
};
export declare function LocalizedCodingPlanQuotaResetAction({ completedAt, processing, onOpenDialog, onReset, autoCelebrateCompletedAt, onAutoCelebrated, resetType, }: {
    completedAt: number | null;
    processing: boolean;
    /** 自动/运营完成时由 Composer 触发器在 hover 展开面板后要求补播撒花的 used_at；手动重置为 null。 */
    autoCelebrateCompletedAt?: number | null;
    onAutoCelebrated?: (completedAt: number) => void;
    /** 五小时与周额度共用同一按钮组件，仅无障碍/处理中文案按类型区分。 */
    resetType?: CodingPlanResetType;
} & CodingPlanQuotaResetActionBehavior): import("react/jsx-runtime").JSX.Element;
export declare function CodingPlanQuotaResetAction({ ariaLabel, autoCelebrateCompletedAt, completedAt, completedLabel, completedTooltipLabel, processing, processingLabel, resetLabel, successLabel, onAutoCelebrated, onOpenDialog, onReset, onCelebrate, }: {
    ariaLabel: string;
    autoCelebrateCompletedAt?: number | null;
    completedAt: number | null;
    completedLabel: string;
    completedTooltipLabel?: string;
    processing: boolean;
    processingLabel: string;
    resetLabel: string;
    successLabel: string;
    onAutoCelebrated?: (completedAt: number) => void;
    onCelebrate?: (origin: HTMLElement) => void;
} & CodingPlanQuotaResetActionBehavior): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CodingPlanQuotaResetAction.d.ts.map