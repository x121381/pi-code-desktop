import type { ConversationSharePreview } from "@zcode/shared";
export declare class MockConversationSharePreviewClient {
    getPreview(shareCode: string, accessToken?: string): Promise<ConversationSharePreview>;
}
