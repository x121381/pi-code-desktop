import { reportAppTelemetryEvent } from "@/lib/appTelemetry.js";
export const PROMPT_TEMPLATE_CLICK_EVENT_NAME = "prompt_template_ck";
const PROMPT_TEMPLATE_EVENT_REGION = "app.session";
const PROMPT_TEMPLATE_EVENT_TYPE = "ck";
export function buildPromptTemplateClickTelemetryPayload(params) {
    return {
        elementName: PROMPT_TEMPLATE_CLICK_EVENT_NAME,
        eventRegion: PROMPT_TEMPLATE_EVENT_REGION,
        eventType: PROMPT_TEMPLATE_EVENT_TYPE,
        eventText: params.templateName,
        eventExtraDetail: {
            template_id: params.templateId,
            template_prompt: params.templatePrompt,
        },
    };
}
export function reportPromptTemplateClick(platform, params) {
    return reportAppTelemetryEvent(platform, buildPromptTemplateClickTelemetryPayload(params), "prompt-template-telemetry");
}
//# sourceMappingURL=promptTemplateTelemetry.js.map