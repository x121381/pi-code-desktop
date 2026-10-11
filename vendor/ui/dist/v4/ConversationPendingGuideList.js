import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo } from "react";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { ConversationTurnRow } from "../v4/ConversationTurnRow.js";
function pendingGuideRow(item, turnId) {
    return {
        rowId: -(item.order.admissionSeq + 1),
        turnId,
        productTurnId: turnId,
        entityId: item.queueItemId,
        kind: "userInput",
        text: item.text,
        origin: "realUser",
        sourceCommandId: item.sourceCommandId,
        clientId: item.clientId,
        attachments: item.attachments,
        createdAt: item.admittedAt,
        createdAtSeq: item.order.admissionSeq,
    };
}
function ConversationPendingGuideListImpl({ context, items, turnId, }) {
    const { intl } = useZCodeIntl();
    const rows = useMemo(() => items.map((item) => pendingGuideRow(item, turnId)), [items, turnId]);
    const status = intl.formatMessage({ id: "chat.message.turnSteer.pending" });
    if (rows.length === 0)
        return null;
    return (_jsx("div", { "data-v4-pending-guide-list": "true", className: "flex flex-col gap-5 px-4 pt-5", children: rows.map((row) => (_jsx(ConversationTurnRow, { row: row, context: context, userInputStatus: status }, row.sourceCommandId))) }));
}
export const ConversationPendingGuideList = memo(ConversationPendingGuideListImpl);
//# sourceMappingURL=ConversationPendingGuideList.js.map