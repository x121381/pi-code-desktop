const RELEASE_TARGET_MAP = {
    darwin: "darwin",
    linux: "linux",
    win32: "windows",
};
const RELEASE_ARCH_MAP = {
    x64: "x86_64",
    arm64: "aarch64",
};
function readOverride(name) {
    const value = process.env[name]?.trim();
    return value && value.length > 0 ? value : undefined;
}
export function resolveReleaseTarget(platform = process.platform) {
    const override = readOverride("ZCODE_TEST_RELEASE_TARGET");
    return override ?? RELEASE_TARGET_MAP[platform] ?? platform;
}
export function resolveReleaseArch(arch = process.arch) {
    const override = readOverride("ZCODE_TEST_RELEASE_ARCH");
    return override ?? RELEASE_ARCH_MAP[arch] ?? arch;
}
export function resolveClientConfigPlatform(platform = process.platform, arch = process.arch) {
    const override = readOverride("ZCODE_TEST_CLIENT_CONFIG_PLATFORM");
    return override ?? `${resolveReleaseTarget(platform)}-${resolveReleaseArch(arch)}`;
}
//# sourceMappingURL=clientPlatform.js.map