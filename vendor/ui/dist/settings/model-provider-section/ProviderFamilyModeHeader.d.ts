import { type ProviderFamilyConnectionSelectionSettings } from "@zcode/shared";
import type { ReactNode } from "react";
import type { ModelProviderNavItem } from "./constants.js";
type ProviderFamilyConnectionOption = {
    key: string;
    label: string;
    item: Extract<ModelProviderNavItem, {
        type: "preset" | "codingPlan" | "teamPlan";
    }>;
    order: number;
};
export declare function ProviderFamilyDetailShell({ header, children, }: {
    header: ReactNode;
    children: ReactNode;
}): string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
export declare function ProviderFamilyHeader({ selectedNavItem, trailingAction, }: {
    selectedNavItem: ModelProviderNavItem | null;
    trailingAction?: ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function ProviderFamilyPlanModeSwitch({ selectedNavItem, navigationItems, connectionSettingsFailed, connectionSelections, onSelectNavItem, }: {
    selectedNavItem: ModelProviderNavItem | null;
    navigationItems: ModelProviderNavItem[];
    startPlanSubscriptionCount?: number;
    connectionSettingsFailed?: boolean;
    connectionSelections?: ProviderFamilyConnectionSelectionSettings;
    onSelectNavItem?: (item: ModelProviderNavItem) => void;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function buildProviderFamilyConnectionOptions({ familyId, navigationItems, codingPlanLabel, teamPlanFallbackLabel, }: {
    familyId: string;
    navigationItems: ModelProviderNavItem[];
    startPlanLabel: string;
    codingPlanLabel: string;
    teamPlanFallbackLabel: string;
}): ProviderFamilyConnectionOption[];
export {};
//# sourceMappingURL=ProviderFamilyModeHeader.d.ts.map