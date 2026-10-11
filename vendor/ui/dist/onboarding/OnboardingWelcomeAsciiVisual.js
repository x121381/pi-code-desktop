import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ThemeHeroVisual, useResolvedThemeHeroPalette } from "@/openWorkspacePageThemeHero.js";
export function OnboardingWelcomeAsciiVisual() {
    const { intl } = useZCodeIntl();
    const palette = useResolvedThemeHeroPalette();
    return (_jsx(ThemeHeroVisual, { className: "h-full min-h-0 rounded-xl", contentClassName: "flex h-full items-center justify-center", children: _jsx("div", { className: "space-y-4 text-center", children: _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: cn("whitespace-nowrap text-3xl font-semibold leading-[1.08] tracking-tight", palette.heading), children: intl.formatMessage({ id: "projectSelector.heroTitle" }) }), _jsx("p", { className: cn("mx-auto whitespace-nowrap text-ui-base leading-6", palette.description), children: intl.formatMessage({ id: "projectSelector.heroDescription" }) })] }) }) }));
}
//# sourceMappingURL=OnboardingWelcomeAsciiVisual.js.map