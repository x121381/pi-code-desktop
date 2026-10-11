import type { ZCodeConfigOption } from "@zcode/shared";
import type { ModelSelectionView } from "@zcode/services";
import type { SessionConfigState } from "@zcode/shared/zcode-protocol-v4";
/** 只将结构化选择投影给现有展示控件；不能借旧 Snapshot 或平铺别名填满空选择。 */
export declare function resolveDraftDisplayedConfig(composer: Partial<SessionConfigState>): SessionConfigState | null;
export declare function resolveDraftModelThoughtOption(providerId: string, modelId: string, modelSelectionView: ModelSelectionView | null): ZCodeConfigOption | null;
export declare function resolveDraftThoughtCurrentValue(params: {
    thought: string | null | undefined;
    thoughtLevels: readonly string[];
}): string;
//# sourceMappingURL=draftWorkspaceDefaults.d.ts.map