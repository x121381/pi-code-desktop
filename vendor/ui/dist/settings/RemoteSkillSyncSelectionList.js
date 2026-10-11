import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
const REMOTE_SKILL_SYNC_CARD_ACTION_SELECTOR = "button,input,a,textarea,select,label,[data-remote-skill-sync-card-action]";
export function shouldToggleRemoteSkillSyncCardSelection({ exists, target, }) {
    if (exists) {
        return false;
    }
    const closest = target?.closest;
    return (typeof closest !== "function" || !closest.call(target, REMOTE_SKILL_SYNC_CARD_ACTION_SELECTOR));
}
export function RemoteSkillSyncSelectionList({ rows, selectedIds, emptyMessageId = "settings.skills.remoteSync.empty", onToggle, }) {
    const { intl } = useZCodeIntl();
    const [expandedDescriptionIds, setExpandedDescriptionIds] = useState(new Set());
    const toggleDescription = (skillId) => {
        setExpandedDescriptionIds((current) => {
            const next = new Set(current);
            if (next.has(skillId)) {
                next.delete(skillId);
            }
            else {
                next.add(skillId);
            }
            return next;
        });
    };
    if (rows.length === 0) {
        return (_jsx("div", { className: "rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: emptyMessageId }) }));
    }
    return (_jsx("div", { className: "grid gap-2", children: rows.map((row) => {
            const checkboxId = `remote-skill-sync-${row.candidate.id}`;
            const labelId = `${checkboxId}-label`;
            const descriptionExpanded = expandedDescriptionIds.has(row.candidate.id);
            const selected = !row.exists && selectedIds.has(row.candidate.id);
            const handleCardClick = (event) => {
                if (!shouldToggleRemoteSkillSyncCardSelection({
                    exists: row.exists,
                    target: event.target,
                })) {
                    return;
                }
                onToggle(row.candidate.id, !selected);
            };
            return (_jsxs("div", { className: `grid grid-cols-[auto_1fr] gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-ui-base ${row.exists
                    ? "cursor-default"
                    : "cursor-pointer hover:border-border-hover hover:bg-surface-hover"}`, onClick: handleCardClick, children: [_jsx("input", { id: checkboxId, type: "checkbox", "aria-labelledby": labelId, className: "mt-1 size-4", disabled: row.exists, checked: selected, onChange: (event) => onToggle(row.candidate.id, event.currentTarget.checked) }), _jsxs("span", { className: "min-w-0", children: [_jsxs("span", { className: "flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1", children: [_jsx("label", { id: labelId, htmlFor: checkboxId, className: "font-medium text-foreground", children: row.candidate.name }), row.candidate.description ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-xs", className: "size-5 rounded-sm text-foreground-subtle hover:text-foreground", "aria-expanded": descriptionExpanded, "aria-label": intl.formatMessage({
                                            id: descriptionExpanded
                                                ? "settings.skills.remoteSync.collapseDescription"
                                                : "settings.skills.remoteSync.expandDescription",
                                        }), "data-remote-skill-sync-card-action": "description-toggle", onClick: () => toggleDescription(row.candidate.id), children: descriptionExpanded ? (_jsx(ChevronDown, { className: "size-3.5", "aria-hidden": "true" })) : (_jsx(ChevronRight, { className: "size-3.5", "aria-hidden": "true" })) })) : null, row.exists ? (_jsx("span", { className: "text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: "settings.skills.remoteSync.existing" }) })) : null] }), row.candidate.description ? (_jsx("span", { className: "mt-1 block min-w-0", children: _jsx("span", { className: `text-ui-base text-foreground-subtle ${descriptionExpanded ? "block whitespace-pre-wrap" : "line-clamp-1"}`, children: row.candidate.description }) })) : null, _jsx("span", { className: "mt-1 block break-all font-mono text-ui-base text-foreground-subtlest", children: row.candidate.directoryName })] })] }, row.candidate.id));
        }) }));
}
//# sourceMappingURL=RemoteSkillSyncSelectionList.js.map