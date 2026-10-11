import type { ZCodeModelTrajectoryMessage } from "@zcode/services";
export declare function trajectoryToolOutputs(message: ZCodeModelTrajectoryMessage): string[];
export declare function trajectoryToolCallInputs(message: ZCodeModelTrajectoryMessage): string[];
export declare function trajectoryToolHasError(message: ZCodeModelTrajectoryMessage): boolean;
export declare function trajectoryToolMetadata(message: ZCodeModelTrajectoryMessage): {
    names: string;
    ids: string;
};
export declare function trajectoryToolPayloadErrorText(value: unknown): string | undefined;
//# sourceMappingURL=ModelTrajectoryToolPayload.d.ts.map