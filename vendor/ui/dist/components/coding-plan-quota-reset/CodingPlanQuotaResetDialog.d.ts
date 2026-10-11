import type { CodingPlanResetType } from "@zcode/shared";
export interface CodingPlanQuotaResetDialogUsageItem {
    color: string;
    id: string;
    label: string;
    percentage: number | null;
    resetTime?: string;
    value: string;
}
export interface CodingPlanQuotaResetDialogResetItem {
    count: number;
    expiresAt: number | null;
    onReset: () => Promise<void>;
    processing?: boolean;
    resetType: CodingPlanResetType;
}
export interface CodingPlanQuotaResetDialogConfig {
    resetItems: CodingPlanQuotaResetDialogResetItem[];
    usageItems: CodingPlanQuotaResetDialogUsageItem[];
}
export declare function formatCodingPlanQuotaResetCountdown(totalSeconds: number, formatMessage: (descriptor: {
    id: string;
}, values?: Record<string, string>) => string): string;
export declare function CodingPlanQuotaResetDialog({ config, open, onOpenChange, }: {
    config: CodingPlanQuotaResetDialogConfig;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CodingPlanQuotaResetDialog.d.ts.map