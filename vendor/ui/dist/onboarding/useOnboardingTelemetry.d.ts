import type { IPlatformService } from "@zcode/shared";
import type { InterfaceMode } from "@/lib/interfaceMode.js";
import type { OccupationValue } from "@/onboarding/occupationOptions.js";
type ExitAction = "start" | "skip" | "close";
/** 业务选择仍由引导组件持有；这里只记录本次真实展示范围和上报去重。 */
export declare function useOnboardingTelemetry({ platform, visible, step, occupation, mode, memory, suggestions, migration, }: {
    platform: Pick<IPlatformService, "reportTelemetryEvent">;
    visible: boolean;
    step: 0 | 1 | 2;
    occupation: OccupationValue | null;
    mode: InterfaceMode | null;
    memory: boolean;
    suggestions: boolean;
    migration: boolean;
}): (action: ExitAction, eventText: string) => () => void;
export {};
//# sourceMappingURL=useOnboardingTelemetry.d.ts.map