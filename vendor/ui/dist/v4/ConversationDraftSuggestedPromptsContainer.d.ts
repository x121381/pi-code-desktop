import type { AutomationsNavigationTab } from "@/lib/taskNavigationHistory.js";
import { type ConversationDraftSuggestedPromptsContainerProps } from "@/v4/ConversationDraftSuggestedPluginFlow.js";
type Props = ConversationDraftSuggestedPromptsContainerProps & {
    proactive?: boolean;
    onOpenAutomations?: (automationTab?: AutomationsNavigationTab) => void;
};
export declare function ConversationDraftSuggestedPromptsContainer({ className, proactive, workspacePath, workspaceIdentity, remoteSessionId, onOpenAutomations, isDesktop, isWebRemoteControl, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ConversationDraftSuggestedPromptsContainer.d.ts.map