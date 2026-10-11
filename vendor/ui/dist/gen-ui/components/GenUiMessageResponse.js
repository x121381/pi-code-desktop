import { jsx as _jsx } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { memo, useMemo } from "react";
import { MessageResponse } from "../../components/ai-elements/message.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { projectGenUiReferences } from "../domain/references.js";
import { GenUiCard } from "./GenUiCard.js";
export const GenUiMessageResponse = memo(function GenUiMessageResponse({ completed, messageKey, ...props }) {
    const { intl } = useZCodeIntl();
    const parts = useMemo(() => projectGenUiReferences(typeof props.children === "string" ? props.children : "", completed), [props.children, completed]);
    const targets = useMemo(() => parts.map((part) => part.kind === "ui" && props.workspacePath && props.sessionId
        ? {
            workspacePath: props.workspacePath,
            workspaceIdentity: props.workspaceIdentity,
            remoteSessionId: props.workspaceRemoteSessionId,
            sessionId: props.sessionId,
            path: part.reference.path,
            instanceKey: `${messageKey}:${part.offset}`,
        }
        : null), [
        parts,
        props.workspacePath,
        props.workspaceIdentity,
        props.workspaceRemoteSessionId,
        props.sessionId,
        messageKey,
    ]);
    return parts.map((part, index) => part.kind === "text" ? (_createElement(MessageResponse, { ...props, key: `text:${index}` }, part.text)) : part.kind === "ui" && targets[index] ? (_jsx(GenUiCard, { reference: part.reference, target: targets[index] }, `${messageKey}:${part.offset}`)) : (_jsx("div", { className: "my-3 rounded-xl border border-panel-border p-3 text-ui-sm text-foreground-subtle", children: intl.formatMessage({
            id: part.kind === "pending"
                ? props.streaming
                    ? "genUi.waiting"
                    : "genUi.incomplete"
                : "genUi.invalid",
        }) }, `status:${index}`)));
});
//# sourceMappingURL=GenUiMessageResponse.js.map