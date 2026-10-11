import type { RootsResolverPort } from "../app/ports.js";
import type { StorageRootSpec } from "@zcode/shared";
export declare const ZCODE_DATA_DIR_NAME = ".zcode";
export declare function resolveStorageRoots(params: {
    homeDir: string;
    dataBaseDir: string;
}): StorageRootSpec[];
export declare function createStorageRootsResolver(params: {
    getHomeDir: () => string;
    getDataBaseDir: () => string;
}): RootsResolverPort;
//# sourceMappingURL=rootsResolver.d.ts.map