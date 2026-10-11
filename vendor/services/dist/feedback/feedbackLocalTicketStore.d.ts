import type { FeedbackListQuery, FeedbackTicketSummary } from "@zcode/shared";
export declare class FeedbackLocalTicketStore {
    private readonly filePath;
    constructor(rootDir?: string);
    list(deviceMid: string, query?: FeedbackListQuery): Promise<FeedbackTicketSummary[]>;
    upsert(deviceMid: string, ticket: FeedbackTicketSummary): Promise<void>;
    private read;
    private write;
}
//# sourceMappingURL=feedbackLocalTicketStore.d.ts.map