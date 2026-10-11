import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
export function ToolSnapshotFieldNotice({ refs, onLoadFullToolCallFields, }) {
    const { intl, locale } = useZCodeIntl();
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    if (refs.length === 0 || !onLoadFullToolCallFields) {
        return null;
    }
    const previewBytes = refs.reduce((total, ref) => total + ref.previewBytes, 0);
    const fullBytes = refs.reduce((total, ref) => total + ref.fullBytes, 0);
    const description = intl.formatMessage({ id: "chat.toolCall.snapshot.notice" }, {
        fields: String(refs.length),
        previewBytes: formatBytes(previewBytes, locale),
        fullBytes: formatBytes(fullBytes, locale),
    });
    const buttonLabel = intl.formatMessage({
        id: loading
            ? "chat.toolCall.snapshot.loading"
            : failed
                ? "chat.toolCall.snapshot.retry"
                : "chat.toolCall.snapshot.loadFull",
    });
    return (_jsxs("div", { className: "flex flex-col gap-2 rounded-xl border border-border/70 bg-muted/40 px-3 py-2 text-ui-base text-foreground-subtle sm:flex-row sm:items-center sm:justify-between", children: [_jsx("span", { children: description }), _jsxs(Button, { type: "button", variant: "secondary", size: "sm", className: "h-7 self-start px-2 text-ui-base sm:self-auto", disabled: loading, onClick: () => {
                    setLoading(true);
                    setFailed(false);
                    void Promise.resolve(onLoadFullToolCallFields())
                        .then((result) => {
                        setFailed(result === false);
                    }, () => {
                        setFailed(true);
                    })
                        .finally(() => {
                        setLoading(false);
                    });
                }, children: [loading ? _jsx(Loader2Icon, { className: "mr-1 size-3 animate-spin" }) : null, buttonLabel] })] }));
}
function formatBytes(bytes, locale) {
    if (bytes >= 1024 * 1024) {
        return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(bytes / 1024 / 1024)} MB`;
    }
    if (bytes >= 1024) {
        return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(bytes / 1024)} KB`;
    }
    return `${new Intl.NumberFormat(locale).format(bytes)} B`;
}
//# sourceMappingURL=ToolSnapshotFieldNotice.js.map