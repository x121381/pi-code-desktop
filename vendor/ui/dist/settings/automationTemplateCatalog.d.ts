import type { ClientSceneConfig } from "@zcode/services";
import type { AutomationScheduledTemplateIconName } from "@/settings/AutomationScheduledTemplateIcon.js";
import type { OffPeakTemplateIconName } from "@/settings/OffPeakTemplateIcon.js";
export interface AutomationTemplateLocalizedText {
    cn?: string;
    en?: string;
}
interface AutomationTemplateBase {
    id: string;
    iconName?: string;
    title: AutomationTemplateLocalizedText;
    description: AutomationTemplateLocalizedText;
    prompt: AutomationTemplateLocalizedText;
}
export interface ScheduledAutomationTemplate extends AutomationTemplateBase {
    cronExpr: string;
    icon: AutomationScheduledTemplateIconName;
}
export interface OffPeakAutomationTemplate extends AutomationTemplateBase {
    homepageDescription?: AutomationTemplateLocalizedText;
    customize: boolean;
    icon: OffPeakTemplateIconName;
}
type FormatAutomationMessage = (descriptor: {
    id: string;
}) => string;
export interface AutomationTemplateCatalog {
    scheduled: ScheduledAutomationTemplate[];
    offPeak: OffPeakAutomationTemplate[];
    rejectedScheduledTemplateIds: string[];
}
/**
 * New task 首页专用选择规则；Automations 模板区必须保持远程目录原样。
 * 首页始终使用本地 Customize，避免远程同名项占用两条远程模板名额或改变最后一项的位置。
 */
export declare function appendLocalCustomizeTemplate(templates: readonly OffPeakAutomationTemplate[]): OffPeakAutomationTemplate[];
export declare function mapClientScenesToAutomationTemplates(scenes: readonly ClientSceneConfig[], isValidCronExpr: (cronExpr: string) => boolean): AutomationTemplateCatalog;
export declare function resolveAutomationTemplateText(text: AutomationTemplateLocalizedText, locale?: string): string;
export declare function resolveOffPeakTemplateText(template: OffPeakAutomationTemplate, field: "title" | "description" | "homepageDescription", locale: string, formatMessage: FormatAutomationMessage): string;
export declare function materializeScheduledTemplateDraft(template: ScheduledAutomationTemplate, locale: string): {
    templateId: string;
    title: string;
    cronExpr: string;
    prompt: string;
};
export declare function materializeOffPeakTemplateDraft(template: OffPeakAutomationTemplate, locale: string): {
    templateId: string;
    title: string;
    prompt: string;
};
export {};
//# sourceMappingURL=automationTemplateCatalog.d.ts.map