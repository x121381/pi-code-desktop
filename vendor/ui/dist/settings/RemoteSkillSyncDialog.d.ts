import { type RemoteTarget, type SkillSyncCandidate, type SkillSyncRemoteStatus } from "@zcode/shared";
import type { ISkillSyncService } from "@zcode/services";
import { type IntlInstance } from "@/i18n/IntlProvider.js";
import { type RemoteSkillSyncRow } from "@/settings/RemoteSkillSyncSelectionList.js";
export { RemoteSkillSyncSelectionList, shouldToggleRemoteSkillSyncCardSelection, } from "@/settings/RemoteSkillSyncSelectionList.js";
export type { RemoteSkillSyncRow } from "@/settings/RemoteSkillSyncSelectionList.js";
interface RemoteSkillSyncDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    localSkillSyncService: ISkillSyncService;
    remoteSkillSyncService: ISkillSyncService;
    remoteTarget: RemoteTarget;
    workspacePath: string;
    workspaceIdentity?: string;
    onSynced: () => Promise<void> | void;
}
export declare function buildRemoteSkillSyncRows(candidates: readonly SkillSyncCandidate[], statuses: readonly SkillSyncRemoteStatus[]): RemoteSkillSyncRow[];
export declare function resolveDefaultRemoteSkillSyncSelection(rows: readonly RemoteSkillSyncRow[]): Set<string>;
export declare function filterRemoteSkillSyncRows(rows: readonly RemoteSkillSyncRow[], showExistingRemoteSkills: boolean): RemoteSkillSyncRow[];
export declare function formatRemoteSkillSyncTarget(remoteTarget: RemoteTarget, workspacePath: string): string;
export declare function formatRemoteSkillSyncError(error: unknown, intl: Pick<IntlInstance, "formatMessage">): string;
export declare function getRemoteSkillSyncBulkSelectionState({ selectedCount, totalSelectable, }: {
    selectedCount: number;
    totalSelectable: number;
}): {
    checked: boolean;
    disabled: boolean;
    indeterminate: boolean;
};
export declare function RemoteSkillSyncExistingFilterCheckbox({ checked, onCheckedChange, }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function RemoteSkillSyncTargetRow({ targetLabel, showExistingRemoteSkills, showExistingFilter, onShowExistingRemoteSkillsChange, }: {
    targetLabel: string;
    showExistingRemoteSkills: boolean;
    showExistingFilter: boolean;
    onShowExistingRemoteSkillsChange: (checked: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function RemoteSkillSyncBulkSelectionCheckbox({ selectedCount, totalSelectable, onSelectAll, onClearAll, }: {
    selectedCount: number;
    totalSelectable: number;
    onSelectAll: () => void;
    onClearAll: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function RemoteSkillSyncDialog(props: RemoteSkillSyncDialogProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=RemoteSkillSyncDialog.d.ts.map