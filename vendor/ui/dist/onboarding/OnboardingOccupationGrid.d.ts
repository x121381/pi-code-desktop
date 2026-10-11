import { type OccupationValue } from "@/onboarding/occupationOptions.js";
interface OccupationGridProps {
    occupation: string | null;
    saving: boolean;
    onSelect: (value: OccupationValue) => void;
    label: string;
    /** 职业显示文案（i18n 已格式化）。 */
    formatLabel: (value: OccupationValue) => string;
}
/** 引导第一步的职业选择网格；从 OccupationOnboarding 抽出以控制文件行数。 */
export declare function OnboardingOccupationGrid({ occupation, saving, onSelect, label, formatLabel, }: OccupationGridProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=OnboardingOccupationGrid.d.ts.map