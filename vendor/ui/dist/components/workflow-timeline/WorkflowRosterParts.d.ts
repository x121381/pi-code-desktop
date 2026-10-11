import type { RosterCounts } from "./roster-model.js";
/** 计数行：`✓ n · ◌ n · ✕ n · ○ n`，为零的项缺席；每项的 title 是整句。 */
export declare function RosterTally({ className, counts }: {
    counts: RosterCounts;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 量条：段序 done · failed · running · pending，从左到右随阶段结算填满；pending 段用 `--color-border`
 * 作轨道。段宽随计数过渡（`.wf-meter-seg`）。`mini` 是折叠节头上的 44 px 版本。
 */
export declare function RosterMeter({ className, counts, mini, }: {
    counts: RosterCounts;
    className?: string;
    mini?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowRosterParts.d.ts.map