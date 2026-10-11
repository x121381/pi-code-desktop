import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const DEFAULT_ASSISTANT_CODE_COMMENT_CARDS_ENABLED = false;
const AssistantCodeCommentFeatureContext = createContext(DEFAULT_ASSISTANT_CODE_COMMENT_CARDS_ENABLED);
export function AssistantCodeCommentFeatureProvider({ children, enabled = DEFAULT_ASSISTANT_CODE_COMMENT_CARDS_ENABLED, }) {
    return (_jsx(AssistantCodeCommentFeatureContext.Provider, { value: enabled, children: children }));
}
export function useAssistantCodeCommentFeatureEnabled() {
    return useContext(AssistantCodeCommentFeatureContext);
}
//# sourceMappingURL=AssistantCodeCommentFeatureProvider.js.map