import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState } from "react";
import { FileText, ImageIcon, Loader2, Paperclip, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Textarea } from "@/components/ui/textarea.js";
import { FeedbackErrorTip } from "@/feedback/feedbackBadges.js";
import { getErrorMessage } from "@/lib/errorMessage.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export const MAX_SUPPLEMENT_ATTACHMENTS = 6;
export const MAX_SUPPLEMENT_ATTACHMENT_BYTES = 100 * 1024 * 1024;
export async function submitSupplementFeedback({ ticketId, feedbackService, comment, attachments, formatUploadedAttachments, }) {
    const trimmed = comment.trim();
    const uploadedNames = attachments.map((attachment) => attachment.filename);
    const body = uploadedNames.length > 0
        ? [trimmed, formatUploadedAttachments(uploadedNames)].filter(Boolean).join("\n\n")
        : trimmed;
    const createdComment = await feedbackService.comment(ticketId, body);
    if (attachments.length > 0 && !createdComment.message_id) {
        // Bugfix: 新反馈接口要求 message 附件上传凭证携带 message_id；
        // 缺少后端 message_id 时继续上传会错误绑定到工单初始内容。
        throw new Error("Missing feedback message_id");
    }
    for (const attachment of attachments) {
        await feedbackService.uploadAttachmentData(ticketId, attachment.kind, {
            dataBase64: attachment.dataBase64,
            filename: attachment.filename,
            contentType: attachment.contentType,
            messageId: createdComment.message_id,
        });
    }
}
export function FeedbackSupplementComposer({ ticketId, feedbackService, onSubmitted, title, description, }) {
    const { intl } = useZCodeIntl();
    const formatMessage = intl.formatMessage;
    const displayTitle = title ?? formatMessage({ id: "feedback.supplement.title" });
    const displayDescription = description ?? formatMessage({ id: "feedback.supplement.description" });
    const inputRef = useRef(null);
    const [comment, setComment] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const appendFiles = useCallback(async (files) => {
        if (files.length === 0)
            return;
        setError(null);
        const remaining = MAX_SUPPLEMENT_ATTACHMENTS - attachments.length;
        if (remaining <= 0) {
            setError(formatMessage({ id: "feedback.supplement.attachmentLimit" }, { count: String(MAX_SUPPLEMENT_ATTACHMENTS) }));
            return;
        }
        const accepted = files.slice(0, remaining);
        const tooLarge = accepted.find((file) => file.size > MAX_SUPPLEMENT_ATTACHMENT_BYTES);
        if (tooLarge) {
            setError(formatMessage({ id: "feedback.supplement.attachmentTooLarge" }, { name: tooLarge.name || formatMessage({ id: "feedback.supplement.attachment" }) }));
            return;
        }
        try {
            const next = await Promise.all(accepted.map((file) => readSupplementAttachment(file)));
            setAttachments((current) => [...current, ...next].slice(0, MAX_SUPPLEMENT_ATTACHMENTS));
            if (files.length > remaining) {
                setError(formatMessage({ id: "feedback.supplement.attachmentLimit" }, { count: String(MAX_SUPPLEMENT_ATTACHMENTS) }));
            }
        }
        catch (readError) {
            setError(getErrorMessage(readError));
        }
    }, [attachments.length]);
    const removeAttachment = useCallback((id) => {
        setAttachments((current) => current.filter((item) => item.id !== id));
    }, []);
    const handlePaste = useCallback((event) => {
        const files = Array.from(event.clipboardData.files);
        if (files.length === 0)
            return;
        event.preventDefault();
        void appendFiles(files);
    }, [appendFiles]);
    const handleSubmit = useCallback(async () => {
        const trimmed = comment.trim();
        if (!trimmed && attachments.length === 0)
            return;
        setSubmitting(true);
        setError(null);
        try {
            await submitSupplementFeedback({
                ticketId,
                feedbackService,
                comment: trimmed,
                attachments,
                formatUploadedAttachments: (names) => formatMessage({ id: "feedback.supplement.uploadedAttachments" }, { names: names.join("、") }),
            });
            setComment("");
            setAttachments([]);
            await onSubmitted();
        }
        catch (submitError) {
            setError(getErrorMessage(submitError));
        }
        finally {
            setSubmitting(false);
        }
    }, [attachments, comment, feedbackService, formatMessage, onSubmitted, ticketId]);
    return (_jsxs("section", { className: "rounded-lg border border-card-border bg-card p-4", children: [_jsxs("div", { className: "mb-3 flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-ui-base font-semibold tracking-wide text-foreground-subtle", children: displayTitle }), _jsx("p", { className: "mt-1 text-ui-base leading-5 text-foreground-subtle", children: displayDescription })] }), _jsxs(Button, { type: "button", size: "sm", variant: "outline", disabled: submitting, onClick: () => inputRef.current?.click(), className: "h-8 shrink-0 rounded-lg px-3", children: [_jsx(Paperclip, {}), formatMessage({ id: "feedback.supplement.addAttachment" })] }), _jsx("input", { ref: inputRef, type: "file", multiple: true, className: "hidden", onChange: (event) => {
                            const files = Array.from(event.currentTarget.files ?? []);
                            event.currentTarget.value = "";
                            void appendFiles(files);
                        } })] }), _jsx(Textarea, { value: comment, onChange: (event) => setComment(event.target.value), onPaste: handlePaste, placeholder: formatMessage({ id: "feedback.supplement.placeholder" }), rows: 3, disabled: submitting, className: "min-h-[82px] resize-y rounded-lg border-input-border bg-input px-3 py-3 text-ui-base text-foreground placeholder:text-foreground-subtlest focus-visible:border-input-border-focused focus-visible:bg-input-focused" }), attachments.length > 0 ? (_jsx("ul", { className: "mt-2 space-y-1.5", children: attachments.map((attachment) => (_jsxs("li", { className: "flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2", children: [_jsx("span", { className: "flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground-subtle", children: attachment.kind === "image" ? (_jsx(ImageIcon, { className: "size-4" })) : (_jsx(FileText, { className: "size-4" })) }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block truncate text-ui-base font-medium text-foreground", children: attachment.filename }), _jsx("span", { className: "mt-0.5 block text-ui-xs text-foreground-subtle", children: formatBytes(attachment.size) })] }), _jsx("button", { type: "button", disabled: submitting, onClick: () => removeAttachment(attachment.id), className: "flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-subtle hover:bg-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", "aria-label": formatMessage({ id: "feedback.supplement.removeAttachment" }, { name: attachment.filename }), children: _jsx(X, { className: "size-3.5" }) })] }, attachment.id))) })) : null, error ? _jsx(FeedbackErrorTip, { message: error }) : null, _jsxs("div", { className: "mt-2 flex items-center justify-between gap-3", children: [_jsx("span", { className: "text-ui-xs text-foreground-subtle", children: formatMessage({ id: "feedback.supplement.attachmentHint" }) }), _jsxs(Button, { size: "sm", disabled: submitting || (!comment.trim() && attachments.length === 0), onClick: () => void handleSubmit(), className: "h-8 rounded-lg px-3", children: [submitting ? _jsx(Loader2, { className: "animate-spin" }) : _jsx(Send, {}), submitting
                                ? formatMessage({ id: "feedback.supplement.sending" })
                                : formatMessage({ id: "feedback.supplement.send" })] })] })] }));
}
function readSupplementAttachment(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Attachment read failed"));
        reader.onload = () => {
            const result = typeof reader.result === "string" ? reader.result : "";
            const commaIndex = result.indexOf(",");
            if (commaIndex < 0) {
                reject(new Error("Invalid attachment data"));
                return;
            }
            resolve({
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                filename: file.name || `attachment-${Date.now()}`,
                contentType: file.type || "application/octet-stream",
                dataBase64: result.slice(commaIndex + 1),
                size: file.size,
                kind: file.type.startsWith("image/") ? "image" : "other",
            });
        };
        reader.readAsDataURL(file);
    });
}
function formatBytes(size) {
    if (size < 1024)
        return `${size} B`;
    if (size < 1024 * 1024)
        return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
}
//# sourceMappingURL=FeedbackSupplementComposer.js.map