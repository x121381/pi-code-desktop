import { DEFAULT_FEEDBACK_TICKET_FRAMEWORK, } from "@zcode/shared";
import { persistFeedbackContactPreference } from "../feedback/feedbackContactPreference.js";
import { buildDeveloperFacingDescription, buildFeedbackTitle, } from "../feedback/feedbackSubmitDescription.js";
import { startFeedbackSubmissionJob, } from "../feedback/feedbackSubmissionJob.js";
const FEEDBACK_ZCODE_AGENT_LABEL = "ZCode Agent";
export const DEFAULT_FEEDBACK_TYPE = "bug";
export const DEFAULT_FEEDBACK_SEVERITY = "P2-中";
export const DEFAULT_FEEDBACK_MODULE = "其它";
export async function startSimplifiedFeedbackSubmission({ feedbackService, title, description, contact, screenshots, includeLogs, ticketType, ticketSeverity, ticketModule, modelContext, locale, copy, formatMessage, onTicketCreated, onCompleted, onError, }) {
    const device = await feedbackService.getDeviceSnapshot();
    const framework = DEFAULT_FEEDBACK_TICKET_FRAMEWORK;
    const normalizedDescription = description.trim();
    const trimmedContact = contact.trim();
    persistFeedbackContactPreference(trimmedContact);
    const attachmentDrafts = screenshots.map(({ id: _id, ...screenshot }) => ({ ...screenshot }));
    const formDraft = {
        ...(title !== undefined ? { title } : {}),
        description,
        contact,
        screenshots: attachmentDrafts,
        includeLogs,
        type: ticketType,
        severity: ticketSeverity,
        module: ticketModule,
    };
    return startFeedbackSubmissionJob({
        feedbackService,
        ticketInput: {
            title: buildFeedbackTitle(title ?? normalizedDescription, formatMessage),
            description: buildDeveloperFacingDescription({
                raw: normalizedDescription,
                modelContext,
                ticketType,
                ticketModule,
                ticketSeverity,
                formatMessage,
            }),
            type: ticketType,
            severity: ticketSeverity,
            module: ticketModule,
            framework,
            device: {
                ...device,
                agentProvider: FEEDBACK_ZCODE_AGENT_LABEL,
                agentFramework: framework,
                ...(modelContext.model ? { agentModel: modelContext.model } : {}),
                ...(modelContext.display ? { agentModelDisplay: modelContext.display } : {}),
            },
            source: "desktop-app",
            contact: trimmedContact || undefined,
            locale,
        },
        screenshots: attachmentDrafts,
        includeLogs,
        formDraft,
        copy,
        onTicketCreated,
        onCompleted,
        onError,
    });
}
//# sourceMappingURL=feedbackSubmitSubmission.js.map