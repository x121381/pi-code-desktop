export const REMOTE_RESOURCE_PACKAGE_IDS = [
    "server-bundle",
    "node-runtime",
    "node-pty",
    "glm",
    "bfs",
    "ripgrep",
    "ugrep",
];
export const ACTIVE_REMOTE_RESOURCE_PACKAGE_IDS = [
    "server-bundle",
    "node-runtime",
    "node-pty",
    "glm",
    "bfs",
    "ripgrep",
    "ugrep",
];
export const REQUIRED_REMOTE_RESOURCE_PACKAGE_IDS = [
    "server-bundle",
    "node-runtime",
];
export const REMOTE_RESOURCE_PACKAGE_DEPENDENCIES = {};
export const OPTIONAL_REMOTE_RESOURCE_PACKAGE_IDS = ACTIVE_REMOTE_RESOURCE_PACKAGE_IDS.filter((id) => !REQUIRED_REMOTE_RESOURCE_PACKAGE_IDS.includes(id));
const REMOTE_RESOURCE_PACKAGE_ID_SET = new Set(REMOTE_RESOURCE_PACKAGE_IDS);
const ACTIVE_REMOTE_RESOURCE_PACKAGE_ID_SET = new Set(ACTIVE_REMOTE_RESOURCE_PACKAGE_IDS);
const REQUIRED_REMOTE_RESOURCE_PACKAGE_ID_SET = new Set(REQUIRED_REMOTE_RESOURCE_PACKAGE_IDS);
export function normalizeRemoteResourcePackageSelection(_selection) {
    // 当前分支只保留一个 ZCode Agent，历史 SSH 资源包选择已经没有业务意义。
    // 无论旧配置里保存过什么选择，新版本都统一部署完整 active 资源集，避免重连时沿用过时裁剪。
    return [...ACTIVE_REMOTE_RESOURCE_PACKAGE_IDS];
}
export function isActiveRemoteResourcePackage(packageId) {
    return ACTIVE_REMOTE_RESOURCE_PACKAGE_ID_SET.has(packageId);
}
export function isKnownRemoteResourcePackageId(packageId) {
    return REMOTE_RESOURCE_PACKAGE_ID_SET.has(packageId);
}
export function isRequiredRemoteResourcePackage(packageId) {
    return REQUIRED_REMOTE_RESOURCE_PACKAGE_ID_SET.has(packageId);
}
export function getRemoteResourcePackageDependencies(packageId) {
    return REMOTE_RESOURCE_PACKAGE_DEPENDENCIES[packageId] ?? [];
}
export function isRemoteResourcePackageSelectedAsDependency(packageId, selectedPackageIds) {
    const selectedPackages = new Set(selectedPackageIds);
    return selectedPackageIds.some((selectedPackageId) => getRemoteResourcePackageDependencies(selectedPackageId).some((dependencyId) => dependencyId === packageId && selectedPackages.has(dependencyId)));
}
//# sourceMappingURL=remoteResourcePackages.js.map