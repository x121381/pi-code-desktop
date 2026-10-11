import type { SkillSyncCandidate } from "@zcode/shared";
export interface RemoteSkillSyncRow {
    candidate: SkillSyncCandidate;
    exists: boolean;
}
export declare function shouldToggleRemoteSkillSyncCardSelection({ exists, target, }: {
    exists: boolean;
    target: EventTarget | null;
}): boolean;
export declare function RemoteSkillSyncSelectionList({ rows, selectedIds, emptyMessageId, onToggle, }: {
    rows: readonly RemoteSkillSyncRow[];
    selectedIds: ReadonlySet<string>;
    emptyMessageId?: string;
    onToggle: (skillId: string, checked: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=RemoteSkillSyncSelectionList.d.ts.map