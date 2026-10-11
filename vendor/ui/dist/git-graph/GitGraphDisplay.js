import { jsx as _jsx } from "react/jsx-runtime";
import { GitBranchIcon, TagIcon } from "lucide-react";
export function getShortHash(hash) {
    return hash.slice(0, 7);
}
export function getRefIcon(ref, className = "size-3") {
    if (ref.kind === "tag") {
        return _jsx(TagIcon, { className: className });
    }
    return _jsx(GitBranchIcon, { className: className });
}
export function formatCommitTime(timestampMs, locale) {
    if (!timestampMs) {
        return "";
    }
    return new Intl.DateTimeFormat(locale, {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(timestampMs));
}
//# sourceMappingURL=GitGraphDisplay.js.map