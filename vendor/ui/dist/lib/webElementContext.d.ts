export declare const WEB_ELEMENT_CONTEXT_ADD_TO_CHAT_EVENT = "zcode:web-element-context-add-to-chat";
export declare const WEB_ELEMENT_CONTEXT_REMOVE_FROM_CHAT_EVENT = "zcode:web-element-context-remove-from-chat";
export interface WebElementRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface WebElementStyleSummary {
    color?: string;
    backgroundColor?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    display?: string;
}
export interface WebElementContextPayload {
    id?: string;
    workspacePath: string;
    workspaceIdentity?: string;
    pageUrl: string;
    pageTitle: string;
    tagName: string;
    role?: string;
    accessibleName?: string;
    selector?: string;
    xpath?: string;
    text?: string;
    nearbyText?: string;
    htmlExcerpt?: string;
    attributes?: Record<string, string>;
    rect?: WebElementRect;
    style?: WebElementStyleSummary;
    capturedAt: number;
}
export interface WebElementContextComposerAttachment extends WebElementContextPayload {
    id: string;
}
interface ParsedWebElementContextPrompt {
    visibleContent: string;
    webElementContexts: WebElementContextComposerAttachment[];
}
type WebElementContextAddToChatEvent = CustomEvent<WebElementContextPayload>;
type WebElementContextRemoveFromChatEvent = CustomEvent<{
    id: string;
    workspacePath: string;
    workspaceIdentity?: string;
}>;
export declare function createWebElementContextId(): string;
export declare function getWebElementContextWorkspaceKey(workspacePath: string, workspaceIdentity?: string): string;
export declare function isWebElementContextAddToChatEvent(event: Event): event is WebElementContextAddToChatEvent;
export declare function isWebElementContextRemoveFromChatEvent(event: Event): event is WebElementContextRemoveFromChatEvent;
export declare function isWebElementContextPayload(payload: unknown): payload is WebElementContextPayload;
export declare function buildPromptWithWebElementContexts(text: string, contexts: readonly WebElementContextComposerAttachment[]): string;
export declare function parsePromptWebElementContexts(content: string, options: {
    workspacePath: string;
    workspaceIdentity?: string;
}): ParsedWebElementContextPrompt;
export declare function dispatchWebElementContextAddToChat(payload: WebElementContextPayload): void;
export declare function dispatchWebElementContextRemoveFromChat(payload: {
    id: string;
    workspacePath: string;
    workspaceIdentity?: string;
}): void;
export {};
//# sourceMappingURL=webElementContext.d.ts.map