import { type ZCodeConfigOption } from "@zcode/shared";
export declare function readModelCurrentValueForModelStateGuard(configOptions: readonly ZCodeConfigOption[]): string | null;
export declare function shouldApplyModelStateUpdateForTaskModel(params: {
    currentModelValue: string | null | undefined;
    incomingModelValue: string | null | undefined;
    reason: string;
}): boolean;
//# sourceMappingURL=modelStateUpdateGuard.d.ts.map