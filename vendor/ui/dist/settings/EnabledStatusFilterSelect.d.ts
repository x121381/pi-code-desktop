export type EnabledStatusFilter = "all" | "enabled" | "disabled";
export declare function matchesEnabledStatusFilter(enabled: boolean, filter: EnabledStatusFilter): boolean;
export declare function EnabledStatusFilterSelect({ value, onValueChange, ariaLabel, }: {
    value: EnabledStatusFilter;
    onValueChange: (value: EnabledStatusFilter) => void;
    ariaLabel?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=EnabledStatusFilterSelect.d.ts.map