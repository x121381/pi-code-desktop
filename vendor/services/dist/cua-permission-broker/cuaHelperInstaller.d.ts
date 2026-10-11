import { type CuaHelperInstaller, type CuaHelperInstallerOptions } from "@zcode/zcode-cua/broker/server";
type CuaHelperInstallerFactory = (options: CuaHelperInstallerOptions) => CuaHelperInstaller;
/**
 * macOS `lipo -archs` 对 Intel 二进制返回 `x86_64`，而 Node 的运行时架构名是 `x64`。
 * 两者表示同一架构；如果直接比较字符串，合法的 Intel Helper 会被误判为不可用。
 */
export declare function normalizeCuaHelperArch(rawArch: string): string;
export declare function normalizeCuaHelperArchs(archs: readonly string[]): string[];
export declare function canonicalizeCuaHelperInstallerOptions(options: CuaHelperInstallerOptions): CuaHelperInstallerOptions;
export declare function createCanonicalCuaHelperInstaller(options: CuaHelperInstallerOptions, createInstaller?: CuaHelperInstallerFactory): CuaHelperInstaller;
export {};
//# sourceMappingURL=cuaHelperInstaller.d.ts.map