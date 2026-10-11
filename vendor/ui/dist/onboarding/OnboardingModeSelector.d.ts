import type { InterfaceMode } from "@/lib/interfaceMode.js";
interface ModeSelectorProps {
    mode: InterfaceMode | null;
    saving: boolean;
    onSelect: (value: InterfaceMode) => void;
    label: string;
    formatLabel: (key: string) => string;
}
/** 引导第二步的 UI 模式选择；从 OccupationOnboarding 抽出以控制文件行数。 */
export declare function OnboardingModeSelector({ mode, saving, onSelect, label, formatLabel, }: ModeSelectorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=OnboardingModeSelector.d.ts.map