import type { ConversationOpenTiming, ConversationSnapshot } from "@zcode/shared/zcode-protocol-v4";
import { type SessionOpenKind, type SessionOpenArmsReporter, type SessionOpenTrigger } from "@/lib/sessionOpenArmsTelemetry.js";
import type { SessionOpenRendererTiming } from "@/v4/conversationProjectionStore.js";
export interface UseSessionOpenArmsTelemetryParams {
    sessionId: string | null;
    snapshot: ConversationSnapshot | null;
    openTiming?: ConversationOpenTiming;
    rendererTiming?: SessionOpenRendererTiming;
    openKind?: SessionOpenKind;
    openTrigger?: SessionOpenTrigger;
    startedAt?: number;
    status: "connecting" | "live" | "error" | "closed";
    lastError: string | null;
    enabled?: boolean;
    readOnly?: boolean;
    reporter?: SessionOpenArmsReporter | null;
}
/**
 * 以 pane 首次 acquire 为 Renderer 可观测的打开起点；同一逻辑打开只发一组 start/result。
 * Web/mobile 即使挂载，也因 reporter 未安装而保持 no-op。
 */
export declare function useSessionOpenArmsTelemetry({ sessionId, snapshot, openTiming, rendererTiming, openKind, openTrigger, startedAt, status, lastError, enabled, readOnly, reporter, }: UseSessionOpenArmsTelemetryParams): void;
//# sourceMappingURL=useSessionOpenArmsTelemetry.d.ts.map