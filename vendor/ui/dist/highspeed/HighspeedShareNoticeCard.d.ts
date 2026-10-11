import type { GlobalNoticeEnvelope } from "@/global-notice/globalNoticeStore.js";
export declare function HighspeedShareNoticeCard({ notice, onDismiss, }: {
    notice: GlobalNoticeEnvelope;
    onDismiss: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function HighspeedShareDialog({ metrics, open, onOpenChange, }: {
    metrics: {
        outputTokens: number;
        durationMs: number;
        regularTps: number;
        highspeedTps: number;
        savedDurationMs?: number;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=HighspeedShareNoticeCard.d.ts.map