export interface ContentBundle {
    format: "zip";
    url: string;
    entry: string;
    sha256: string;
    sizeBytes?: number;
}
export declare function validateContentBundlePath(path: string): string;
/** 仅供宿主装配：可信源和缓存根不从云端 payload 派生；cacheRoot 必须由单个宿主独占。 */
export declare function createContentBundleCache(options: {
    cacheRoot: string;
    isTrustedUrl: (url: URL) => boolean;
    fetch?: typeof globalThis.fetch;
    signal?: AbortSignal;
}): {
    acquire(bundle: ContentBundle): Promise<{
        leaseId: `${string}-${string}-${string}-${string}-${string}`;
        sha256: string;
        entry: string;
        cacheHit: boolean;
    }>;
    read(leaseId: string, path: string): Promise<Buffer<ArrayBufferLike>>;
    release(leaseId: string): Promise<void>;
    clear(): Promise<void>;
};
//# sourceMappingURL=contentBundleCache.d.ts.map