export interface TrajectoryFileTail {
    text: string;
    bytesRead: number;
    truncated: boolean;
}
export declare function resolveModelIODirs(): string[];
export declare function sanitizeSessionSegment(value: string): string;
export declare function readTrajectoryFileTail(filePath: string): Promise<TrajectoryFileTail>;
//# sourceMappingURL=modelTrajectoryFileTail.d.ts.map