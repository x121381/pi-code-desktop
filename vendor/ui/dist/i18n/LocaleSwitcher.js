import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from "react";
import { TID_LOCALE_TOGGLE } from "@zcode/shared";
import { useZCodeIntl } from "./IntlProvider.js";
const LOCALE_CYCLE = ["zh-CN", "en-US"];
const LOCALE_LABELS = {
    "zh-CN": "中",
    "en-US": "En",
};
/**
 * 语言切换按钮 —— 点击循环切换语言
 */
export function LocaleSwitcher() {
    const { intl, locale, setLocale } = useZCodeIntl();
    const cycleLocale = useCallback(() => {
        const idx = LOCALE_CYCLE.indexOf(locale);
        const next = LOCALE_CYCLE[(idx + 1) % LOCALE_CYCLE.length] ?? LOCALE_CYCLE[0];
        setLocale(next);
    }, [locale, setLocale]);
    return (_jsx("button", { onClick: cycleLocale, "data-testid": TID_LOCALE_TOGGLE, className: "cursor-pointer rounded-lg bg-btn-alt-bg px-3 py-1 text-ui-base text-btn-alt-text transition hover:bg-surface-raised", title: intl.formatMessage({ id: "locale.switchLanguage" }), children: LOCALE_LABELS[locale] }));
}
//# sourceMappingURL=LocaleSwitcher.js.map