export declare const REMOTE_RESOURCE_PACKAGE_IDS: readonly ["server-bundle", "node-runtime", "node-pty", "glm", "bfs", "ripgrep", "ugrep"];
export type RemoteResourcePackageId = (typeof REMOTE_RESOURCE_PACKAGE_IDS)[number];
export declare const ACTIVE_REMOTE_RESOURCE_PACKAGE_IDS: readonly ["server-bundle", "node-runtime", "node-pty", "glm", "bfs", "ripgrep", "ugrep"];
export declare const REQUIRED_REMOTE_RESOURCE_PACKAGE_IDS: readonly ["server-bundle", "node-runtime"];
export declare const REMOTE_RESOURCE_PACKAGE_DEPENDENCIES: Partial<Record<RemoteResourcePackageId, readonly RemoteResourcePackageId[]>>;
export declare const OPTIONAL_REMOTE_RESOURCE_PACKAGE_IDS: ("glm" | "server-bundle" | "node-runtime" | "node-pty" | "bfs" | "ripgrep" | "ugrep")[];
export interface RemoteResourcePackageSelection {
    selectedPackageIds?: string[];
}
export declare function normalizeRemoteResourcePackageSelection(_selection?: RemoteResourcePackageSelection | null): RemoteResourcePackageId[];
export declare function isActiveRemoteResourcePackage(packageId: RemoteResourcePackageId): boolean;
export declare function isKnownRemoteResourcePackageId(packageId: string): boolean;
export declare function isRequiredRemoteResourcePackage(packageId: RemoteResourcePackageId): boolean;
export declare function getRemoteResourcePackageDependencies(packageId: RemoteResourcePackageId): readonly RemoteResourcePackageId[];
export declare function isRemoteResourcePackageSelectedAsDependency(packageId: RemoteResourcePackageId, selectedPackageIds: readonly RemoteResourcePackageId[]): boolean;
//# sourceMappingURL=remoteResourcePackages.d.ts.map