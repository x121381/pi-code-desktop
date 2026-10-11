import type { IPlatformService, TelemetryEventPayload } from "@zcode/shared";
export declare const PROMPT_TEMPLATE_CLICK_EVENT_NAME = "prompt_template_ck";
export interface PromptTemplateClickTelemetryParams {
    templateId: string;
    templateName: string;
    templatePrompt: string;
}
export declare function buildPromptTemplateClickTelemetryPayload(params: PromptTemplateClickTelemetryParams): TelemetryEventPayload;
export declare function reportPromptTemplateClick(platform: Pick<IPlatformService, "reportTelemetryEvent">, params: PromptTemplateClickTelemetryParams): Promise<void>;
//# sourceMappingURL=promptTemplateTelemetry.d.ts.map