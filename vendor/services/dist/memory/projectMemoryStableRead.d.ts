export declare function readProjectMemoryFileFromStableHandle(params: {
    fileName: string;
    filePath: string;
    validatePath: () => Promise<void>;
}): Promise<{
    content: string;
    updatedAt: number;
}>;
//# sourceMappingURL=projectMemoryStableRead.d.ts.map