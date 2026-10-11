import type { IPlatformService } from "@zcode/shared";
export interface ConversationTelemetryParityScenarioResult {
    caseId: string;
    minimumArmsInventory: Record<string, number>;
    minimumReportInventory: Record<string, number>;
    operationCount: number;
    proof: string[];
    stateAssertions: string[];
}
declare global {
    interface Window {
        __zcodeConversationTelemetryParityE2E?: {
            variant: "current" | "legacy";
            run(caseId: string): Promise<ConversationTelemetryParityScenarioResult>;
        };
    }
}
export declare function installConversationTelemetryParityE2EBridge(input: {
    platform: IPlatformService;
    isDesktop: boolean;
}): () => void;
//# sourceMappingURL=conversationTelemetryParityE2E.d.ts.map