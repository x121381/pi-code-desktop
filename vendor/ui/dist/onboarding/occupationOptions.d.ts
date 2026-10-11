import { type LucideIcon } from "lucide-react";
export declare const occupations: readonly ["developer", "independent", "infrastructure", "product", "design", "student", "finance", "creator", "operations", "marketing", "legal", "other"];
export type OccupationValue = (typeof occupations)[number];
/** 步骤 2 模式选择用的图标：coding / office。 */
export declare const modeOptionIcons: {
    readonly coding: LucideIcon;
    readonly office: LucideIcon;
};
export declare function getOccupationIcon(index: number): LucideIcon;
//# sourceMappingURL=occupationOptions.d.ts.map