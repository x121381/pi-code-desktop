import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Code2Icon, MessageSquareTextIcon, Trash2Icon } from "lucide-react";
import { Button } from "../../components/ui/button.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { ContextAttachmentPill } from "../../v4/composer/ContextAttachmentPill.js";
function getContextKey(comment) {
    return `${comment.workspaceIdentity?.trim() || comment.workspacePath}\0${comment.id}`;
}
export function CodeCommentAttachmentChip({ comments, contentAlign = "start", onRemove, onRemoveAll, }) {
    const { intl } = useZCodeIntl();
    if (comments.length === 0)
        return null;
    const label = intl.formatMessage({
        id: comments.length === 1 ? "chat.codeComments.one" : "chat.codeComments.many",
    }, { count: String(comments.length) });
    const removeLabel = intl.formatMessage({ id: "chat.codeComments.remove" });
    return (_jsx(ContextAttachmentPill, { contentAlign: contentAlign, icon: _jsx(MessageSquareTextIcon, { className: "size-4 shrink-0 text-foreground-subtle" }), label: label, onRemoveAll: onRemoveAll, removeLabel: removeLabel, children: comments.map((comment) => {
            const lineLabel = comment.startLine === comment.endLine
                ? `L${comment.startLine}`
                : `L${comment.startLine}-L${comment.endLine}`;
            return (_jsxs("div", { className: "group/comment flex min-h-7 cursor-default gap-2 rounded-lg px-2 py-1 text-ui-base/relaxed text-foreground hover:bg-menu-hover", children: [_jsx(Code2Icon, { className: "mt-1 size-4 shrink-0 text-foreground-subtle" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [_jsx("span", { className: "truncate font-medium", children: comment.sourceTitle }), _jsx("span", { className: "shrink-0 font-mono text-ui-base text-foreground-subtle", children: lineLabel })] }), _jsx("div", { className: "truncate font-mono text-ui-base text-foreground-subtlest", children: comment.sourcePath ?? comment.sourceTitle }), comment.comment.trim() ? (_jsx("div", { className: "line-clamp-2 text-ui-base/relaxed text-foreground-subtle", children: comment.comment })) : null] }), onRemove ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-xs", className: "mt-0.5 size-5 shrink-0 rounded-sm text-foreground-subtle opacity-0 transition-opacity hover:text-foreground group-hover/comment:opacity-100", "aria-label": removeLabel, title: removeLabel, onClick: (event) => {
                            event.stopPropagation();
                            onRemove(comment);
                        }, children: _jsx(Trash2Icon, { className: "size-3.5" }) })) : null] }, getContextKey(comment)));
        }) }));
}
//# sourceMappingURL=CodeCommentAttachmentChip.js.map