import type { IPlatformService } from "@zcode/shared";
import type { IntlInstance } from "@/i18n/IntlProvider.js";
import type { FeedbackSubmitDraft } from "@/feedback/feedbackStore.js";
export interface HelpMenuActionHandlers {
    openIssueReport: () => Promise<void>;
    openProductDocs: () => void;
    exportLogs: () => void;
}
export declare function createHelpMenuActionHandlers({ platform, intl, openSubmit, }: {
    platform: Pick<IPlatformService, "captureWindowScreenshot" | "exportLogs" | "openExternal">;
    intl: IntlInstance;
    openSubmit: (draft?: FeedbackSubmitDraft) => void;
}): HelpMenuActionHandlers;
//# sourceMappingURL=helpMenuActions.d.ts.map