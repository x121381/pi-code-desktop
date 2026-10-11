import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronRight, Loader2 } from "lucide-react";
import { TID_RESOURCE_MANAGER_STORAGE_CATEGORY_CLEAN, TID_RESOURCE_MANAGER_STORAGE_CATEGORY_ROW, TID_RESOURCE_MANAGER_STORAGE_CATEGORY_SIZE, testId, } from "@zcode/shared";
import { Button } from "../../components/ui/button.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { formatBytes } from "../../resource-manager/resourceUsageView.js";
import { STORAGE_CATEGORY_ICONS, storageCategoryDescriptionId, storageCategoryTitleId, } from "./storageCategoryPresentation.js";
export function StorageCategoryList({ categories, cleaningCategory, disabled, onOpen, onClean, }) {
    const { intl } = useZCodeIntl();
    return (_jsx("div", { className: "overflow-hidden rounded-xl border border-card-border bg-card", children: categories.map((category) => {
            const Icon = STORAGE_CATEGORY_ICONS[category.id];
            const cleanable = category.cleanability !== "none" && category.bytes > 0;
            const cleaning = cleaningCategory === category.id;
            return (_jsxs("div", { className: "flex items-center gap-3 border-t border-border px-4 py-3 first:border-t-0", children: [_jsxs("button", { type: "button", "data-testid": testId(TID_RESOURCE_MANAGER_STORAGE_CATEGORY_ROW, category.id), className: "flex min-w-0 flex-1 items-center gap-3 text-left", onClick: () => onOpen(category.id), children: [_jsx("span", { className: "flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface text-foreground-subtle", children: _jsx(Icon, { className: "size-4", "aria-hidden": "true" }) }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block truncate text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: storageCategoryTitleId(category.id) }) }), _jsx("span", { "data-testid": testId(TID_RESOURCE_MANAGER_STORAGE_CATEGORY_SIZE, category.id), className: "block text-ui-caption tabular-nums text-foreground-subtle", title: intl.formatMessage({ id: storageCategoryDescriptionId(category.id) }), children: formatBytes(category.bytes) })] })] }), cleanable ? (_jsxs(Button, { type: "button", variant: "outline", size: "sm", "data-testid": testId(TID_RESOURCE_MANAGER_STORAGE_CATEGORY_CLEAN, category.id), disabled: disabled, onClick: () => onClean(category.id), children: [cleaning ? _jsx(Loader2, { className: "size-4 animate-spin", "aria-hidden": "true" }) : null, intl.formatMessage({
                                id: cleaning
                                    ? "resourceManager.storage.cleaning"
                                    : "resourceManager.storage.clean",
                            })] })) : null, _jsx("button", { type: "button", className: "flex size-8 shrink-0 items-center justify-center rounded-md text-foreground-subtlest hover:bg-surface-hover", "aria-label": intl.formatMessage({ id: storageCategoryTitleId(category.id) }), onClick: () => onOpen(category.id), children: _jsx(ChevronRight, { className: "size-4", "aria-hidden": "true" }) })] }, category.id));
        }) }));
}
//# sourceMappingURL=StorageCategoryList.js.map