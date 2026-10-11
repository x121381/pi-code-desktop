interface SettingsResourceHeaderActionsProps {
    onRefresh?: () => void;
    onImport?: () => void;
    onExport?: () => void;
    onNew?: () => void;
    refreshing?: boolean;
    refreshDisabled?: boolean;
    importDisabled?: boolean;
    exportDisabled?: boolean;
    newDisabled?: boolean;
    refreshTestId?: string;
    newTestId?: string;
    refreshLabel?: string;
    newLabel?: string;
    importActionId?: string;
    exportActionId?: string;
    newActionId?: string;
}
export declare function SettingsResourceHeaderActions({ onRefresh, onImport, onExport, onNew, refreshing, refreshDisabled, importDisabled, exportDisabled, newDisabled, refreshTestId, newTestId, refreshLabel, newLabel: customNewLabel, importActionId, exportActionId, newActionId, }: SettingsResourceHeaderActionsProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SettingsResourceHeaderActions.d.ts.map