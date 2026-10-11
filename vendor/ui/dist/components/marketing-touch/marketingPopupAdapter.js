import { additionalRequestModalSelectors } from "../../request-security-edition/errors.js";
import { isStartPlanModelProviderId } from "@zcode/shared";
export function canOpenMarketingPopup() {
    return (document.visibilityState !== "hidden" &&
        !document.querySelector([
            '[role="dialog"]',
            '[role="alertdialog"]',
            '[data-testid="coding-plan-upgrade-surface"]',
            ...additionalRequestModalSelectors,
        ].join(", ")));
}
export function marketingLabel(text) {
    if (text.format !== "html")
        return text.content;
    const template = document.createElement("template");
    template.innerHTML = text.content;
    template.content
        .querySelectorAll("script,style,iframe,object,svg,math,template")
        .forEach((node) => node.remove());
    return template.content.textContent?.trim() ?? "";
}
export function adaptMarketingPopup(id, locale, popup, hero, viewPlanLabel) {
    const actions = {};
    const buttons = popup.buttons.map((button, index) => {
        const key = `button-${index}`;
        const action = button.action;
        const labelOverride = viewPlanLabel &&
            action.type === "navigate" &&
            action.args.page === "settings" &&
            action.args.section === "models" &&
            isStartPlanModelProviderId(action.args.provider_id ?? "")
            ? viewPlanLabel
            : undefined;
        actions[key] =
            action.type === "close"
                ? { type: "close" }
                : action.type === "open_url"
                    ? { type: "open_external", url: action.args.url }
                    : action.type === "copy_text"
                        ? { type: "copy_text", text: action.args.text }
                        : action.type === "navigate"
                            ? {
                                type: "navigate",
                                destination: action.args.page === "plugin_marketplace" ? "plugin_store" : "settings",
                            }
                            : { type: "claim_plan", planId: action.args.plan_id };
        return {
            id: key,
            actionId: key,
            label: labelOverride ?? marketingLabel(button.text),
            formattedLabel: {
                format: labelOverride || button.text.format === "plaintext"
                    ? "plain_text"
                    : button.text.format,
                text: labelOverride ?? button.text.content,
            },
            variant: action.type === "close" ? "secondary" : "primary",
            theme: button.theme ?? { variant: "default" },
        };
    });
    return {
        schemaVersion: 1,
        id,
        revision: 1,
        kind: "campaign",
        locale,
        dialog: {
            title: marketingLabel(popup.title),
            formattedTitle: {
                format: popup.title.format === "plaintext" ? "plain_text" : popup.title.format,
                text: popup.title.content,
            },
            description: {
                format: popup.description.format === "plaintext" ? "plain_text" : popup.description.format,
                text: popup.description.content,
            },
            hero,
            buttons,
        },
        actions,
    };
}
//# sourceMappingURL=marketingPopupAdapter.js.map