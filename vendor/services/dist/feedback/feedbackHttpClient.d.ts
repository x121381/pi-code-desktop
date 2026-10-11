import type { ApiClient, CreateFeedbackTicketInput, FeedbackAttachment, FeedbackAttachmentKind, FeedbackComment, FeedbackListQuery, FeedbackListResult, FeedbackTicketDetail } from "@zcode/shared";
import { type ServiceLogger } from "#src/logger/serviceLogger.js";
interface FeedbackHttpClientOptions {
    baseUrl: string;
    apiClient: ApiClient;
    getAuthHeaders: () => Promise<Record<string, string>>;
    logger?: ServiceLogger;
}
interface FeedbackUploadProgressEvent {
    uploadedBytes: number;
    totalBytes: number;
}
interface FeedbackUploadFileOptions {
    messageId?: string;
    onUploadProgress?: (event: FeedbackUploadProgressEvent) => void;
    signal?: AbortSignal;
}
interface FeedbackCreateRequestOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
}
export declare class FeedbackUploadCanceledError extends Error {
    constructor();
}
export declare class FeedbackHttpClient {
    private readonly options;
    constructor(options: FeedbackHttpClientOptions);
    private get apiBaseUrl();
    private get logger();
    private request;
    create(input: CreateFeedbackTicketInput, options?: FeedbackCreateRequestOptions): Promise<FeedbackTicketDetail>;
    list(query?: FeedbackListQuery): Promise<FeedbackListResult>;
    get(id: string): Promise<FeedbackTicketDetail>;
    comment(id: string, body: string): Promise<FeedbackComment>;
    uploadFile(ticketId: string, kind: FeedbackAttachmentKind, filePath: string, filename: string, contentType: string, options?: FeedbackUploadFileOptions): Promise<FeedbackAttachment>;
}
export {};
//# sourceMappingURL=feedbackHttpClient.d.ts.map