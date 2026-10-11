import { type ReactNode } from "react";
import { type CodingPlanUpgradeDialogTarget } from "@/settings/CodingPlanUpgradeDialog.js";
import { type CodingPlanEntryInventory } from "@/hooks/useCodingPlanEntryPlanList.js";
interface CodingPlanUpgradeDialogContextValue {
    inventory: CodingPlanEntryInventory;
    openCodingPlanUpgrade: (target: CodingPlanUpgradeDialogTarget, observation?: {
        signal: AbortSignal;
        onResult: (opened: boolean) => void;
    }) => boolean;
}
export declare function CodingPlanUpgradeDialogProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useCodingPlanUpgradeDialog(): CodingPlanUpgradeDialogContextValue;
/**
 * 可独立挂载的 conversation pane 使用可选上下文；完整 App Root 仍会注入真实购买面板。
 */
export declare function useOptionalCodingPlanUpgradeDialog(): CodingPlanUpgradeDialogContextValue | null;
export {};
//# sourceMappingURL=CodingPlanUpgradeDialogProvider.d.ts.map