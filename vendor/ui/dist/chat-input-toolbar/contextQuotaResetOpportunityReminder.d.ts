import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
export declare const CONTEXT_QUOTA_RESET_URGENT_SECONDS = 180;
export type ContextQuotaResetOpportunityReminderPhase = "initial" | "urgent";
export interface ContextQuotaResetOpportunityDismissal {
    opportunityKey: string | null;
    initial: boolean;
    urgent: boolean;
}
export interface ContextQuotaResetOpportunity {
    count: number;
    expiresAt: number | null;
    sourceKey: string | null;
    visible: boolean;
}
export interface ContextQuotaResetOpportunityReminder {
    count: number;
    opportunityKey: string;
    phase: ContextQuotaResetOpportunityReminderPhase;
    remainingSeconds: number;
}
export declare function createContextQuotaResetOpportunityDismissalStore(): {
    dismiss(reminder: ContextQuotaResetOpportunityReminder): void;
    getSnapshot: () => ContextQuotaResetOpportunityDismissal;
    subscribe(listener: () => void): () => boolean;
};
export declare const contextQuotaResetOpportunityDismissalStore: {
    dismiss(reminder: ContextQuotaResetOpportunityReminder): void;
    getSnapshot: () => ContextQuotaResetOpportunityDismissal;
    subscribe(listener: () => void): () => boolean;
};
export type ContextQuotaResetOpportunityTriggerTone = "available" | "urgent";
export declare function resolveContextQuotaResetOpportunityTriggerTone({ now, opportunity, }: {
    now: number;
    opportunity: ContextQuotaResetOpportunity;
}): ContextQuotaResetOpportunityTriggerTone | null;
export declare function resolveContextQuotaResetOpportunityReminder({ dismissal, now, opportunity, }: {
    dismissal: ContextQuotaResetOpportunityDismissal;
    now: number;
    opportunity: ContextQuotaResetOpportunity;
}): ContextQuotaResetOpportunityReminder | null;
export declare function resolveContextTriggerTooltipKind(resetStatus: "processing" | "completed" | null, opportunityPhase: ContextQuotaResetOpportunityReminderPhase | null): "reset-status" | ContextQuotaResetOpportunityReminderPhase | null;
export declare function shouldDismissContextQuotaResetOpportunityReminder(target: EventTarget | null, trigger: HTMLElement | null): boolean;
export declare function ContextQuotaResetOpportunityReminderContent({ count, intl, onDismiss, phase, remainingSeconds, }: {
    count: number;
    intl: ReturnType<typeof useZCodeIntl>["intl"];
    onDismiss: () => void;
    phase: ContextQuotaResetOpportunityReminderPhase;
    remainingSeconds: number;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=contextQuotaResetOpportunityReminder.d.ts.map