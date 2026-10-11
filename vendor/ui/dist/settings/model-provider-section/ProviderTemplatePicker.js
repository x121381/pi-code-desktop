import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { resolveProviderTemplateName } from "@zcode/provider";
import { TID_MODEL_PROVIDER_TEMPLATE_BACK_BUTTON, TID_MODEL_PROVIDER_TEMPLATE_ITEM, TID_MODEL_PROVIDER_TEMPLATE_PICKER, testId, } from "@zcode/shared";
import { Button } from "../../components/ui/button.js";
import { ControlHintTooltip } from "../../ControlHintTooltip.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { logger } from "../../logger.js";
import { ProviderLogo } from "./ProviderLogo.js";
import { useProviderDetailFeedback } from "./ProviderDetailFeedback.js";
export function ProviderTemplatePicker({ templates, onBack, onCreateFromTemplate, onCreateCustom, creating, }) {
    const { intl, locale } = useZCodeIntl();
    const { dismissFeedback, showFeedback } = useProviderDetailFeedback();
    const customLabel = intl.formatMessage({ id: "settings.modelProvider.newProviderName" });
    const zhipuIds = ["bigmodel-api", "zai-api", "bigmodel-standard-api", "zai-standard-api"];
    const groups = [
        {
            id: "zhipu",
            templates: zhipuIds.flatMap((id) => templates.filter((template) => template.templateId === id)),
        },
        {
            id: "other",
            templates: templates.filter((template) => !zhipuIds.includes(template.templateId)),
        },
    ];
    const createWithFeedback = async (create) => {
        const feedbackKey = "provider-template-create";
        dismissFeedback(feedbackKey);
        try {
            await create();
        }
        catch (error) {
            // Template 创建失败过去只写日志，用户留在选择页却看不到任何结果。
            // 失败继续留在当前页，并复用详情栏底部反馈横幅提供同一次创建的重试入口。
            // 完整 Schema issues 只进入统一 UI 日志；横幅保持可读摘要，避免原始数组撑满详情区。
            logger.error("[ProviderTemplatePicker] 创建供应商失败", error);
            const retry = () => void createWithFeedback(create);
            showFeedback({
                key: feedbackKey,
                state: "failure",
                message: intl.formatMessage({ id: "settings.modelProvider.templateCreateFailed" }),
                actionLabel: intl.formatMessage({ id: "settings.modelProvider.templateCreateRetry" }),
                onAction: retry,
                dismissible: true,
            });
        }
    };
    return (_jsxs("section", { className: "space-y-5", "data-testid": TID_MODEL_PROVIDER_TEMPLATE_PICKER, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "data-testid": TID_MODEL_PROVIDER_TEMPLATE_BACK_BUTTON, "aria-label": intl.formatMessage({ id: "settings.modelProvider.templatePickerBack" }), onClick: onBack, children: _jsx(ArrowLeftIcon, { className: "size-4", "aria-hidden": "true" }) }), _jsx("h2", { className: "text-ui-lg font-semibold text-foreground", children: intl.formatMessage({ id: "settings.modelProvider.templatePickerTitle" }) })] }), _jsx("div", { className: "space-y-6", children: groups.map((group) => (_jsxs("section", { "data-provider-template-group": group.id, className: "space-y-3", children: [_jsx("h3", { className: "text-ui-base font-medium text-foreground-subtle", children: intl.formatMessage({ id: `settings.modelProvider.templateGroup.${group.id}` }) }), _jsxs("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: [group.id === "other" ? (_jsx(ProviderTemplateCard, { label: intl.formatMessage({ id: "settings.modelProvider.createCustomProvider" }), disabled: creating, testId: testId(TID_MODEL_PROVIDER_TEMPLATE_ITEM, "custom"), icon: _jsx("span", { className: "flex size-9 shrink-0 items-center justify-center rounded-lg bg-hover", children: _jsx(PlusIcon, { className: "size-4", "aria-hidden": "true" }) }), onClick: () => void createWithFeedback(() => onCreateCustom(customLabel)) })) : null, group.templates.map((template) => {
                                    const label = resolveProviderTemplateName(template.templateId, template, locale);
                                    return (_jsx(ProviderTemplateCard, { label: label, disabled: creating, testId: testId(TID_MODEL_PROVIDER_TEMPLATE_ITEM, template.templateId), icon: _jsx("span", { className: "flex size-9 shrink-0 items-center justify-center", children: _jsx(ProviderLogo, { logo: template.config.logo, className: "size-8" }) }), onClick: () => void createWithFeedback(() => onCreateFromTemplate(template.templateId)) }, template.templateId));
                                })] })] }, group.id))) })] }));
}
function ProviderTemplateCard({ label, disabled, testId: cardTestId, icon, onClick, }) {
    return (_jsx(ControlHintTooltip, { title: label, children: _jsxs("button", { type: "button", "data-testid": cardTestId, disabled: disabled, onClick: onClick, className: "flex min-h-16 min-w-0 items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-left transition-colors outline-none hover:border-border-hover hover:bg-hover focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:opacity-60", children: [icon, _jsx("span", { className: "min-w-0 flex-1 break-words text-ui-base font-medium", children: label }), _jsx(ChevronRightIcon, { className: "size-4 shrink-0 text-foreground-subtlest", "aria-hidden": "true" })] }) }));
}
//# sourceMappingURL=ProviderTemplatePicker.js.map