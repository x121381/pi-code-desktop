import type { CodingPlanProviderId } from "@/settings/model-provider-section/constants.js";
import type { CodingPlanFunnelContext } from "@/lib/codingPlanFunnelTelemetry.js";
import { type CodingPlanPurchaseAudience, CODING_PLAN_WEBVIEW_OVERRIDE_ENV_KEY } from "@/settings/model-provider-section/codingPlanEmbeddedWebview.js";
interface CodingPlanEmbeddedWebviewDialogProps {
    credentialService: {
        load(key: string): Promise<string | null>;
    };
    onOpenChange: (open: boolean) => void;
    open: boolean;
    onOpenResult?: (opened: boolean) => void;
    providerId: CodingPlanProviderId;
    funnelContext?: CodingPlanFunnelContext | null;
    audience?: CodingPlanPurchaseAudience;
    teamPlanKey?: string | null;
    /**
     * 官网页购买成功后的回调。
     *
     * 官网页通过 preload 注入的 window.zcodeBridge.notifyPurchaseComplete({ provider })
     * 发送 zcode:coding-plan-purchase-complete 频道消息，本组件在 webview 的
     * ipc-message 事件里识别该频道并触发此回调（经 onPurchaseCompleteRef 防 stale closure）。
     * 上层（CodingPlanUpgradeDialog）在此回调里刷新 entitlements/providers 并关闭 webview。
     */
    onPurchaseComplete?: () => void;
}
export declare function CodingPlanEmbeddedWebviewDialog({ credentialService, onOpenChange, open, providerId, funnelContext, audience, teamPlanKey, onPurchaseComplete, onOpenResult, }: CodingPlanEmbeddedWebviewDialogProps): import("react/jsx-runtime").JSX.Element | null;
export { CODING_PLAN_WEBVIEW_OVERRIDE_ENV_KEY };
//# sourceMappingURL=CodingPlanEmbeddedWebviewDialog.d.ts.map