import { type IPlatformService } from "@zcode/shared";
interface LegacyScenarioResult {
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
            run(caseId: string): Promise<LegacyScenarioResult>;
        };
    }
}
export declare function installLegacyConversationTelemetryParityE2EBridge(input: {
    platform: IPlatformService;
    isDesktop: boolean;
}): () => void;
export {};
//# sourceMappingURL=conversationTelemetryLegacyParityE2E.d.ts.map