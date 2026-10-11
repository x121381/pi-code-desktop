import type { ApiClient } from "@zcode/shared";
import type { ICredentialService } from "../credential/credential.js";
import type { IOAuthService } from "../oauth/oauth.js";
import type { IFeedbackService } from "./feedback.js";
export interface CreateFeedbackServiceOptions {
    credentialService: ICredentialService;
    oauthService: IOAuthService;
    apiClient: ApiClient;
    getDeviceMid?: () => string | undefined;
    apiBaseUrl?: string;
    createFullLogArchive?: (sourceDir: string, options?: {
        onProgress?: (event: {
            processedBytes: number;
            totalBytes: number;
        }) => void;
    }) => Promise<{
        path: string;
        size: number;
    }>;
    revealPath?: (path: string) => Promise<void>;
}
export declare function createFeedbackService(options: CreateFeedbackServiceOptions): IFeedbackService;
//# sourceMappingURL=feedbackService.d.ts.map