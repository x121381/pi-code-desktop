/**
 * 数据根解析：R1 = 家目录下的 .zcode（永远存在），R2 = 自定义数据存储路径下的 .zcode（仅当设置了且 ≠ 家目录）。
 * 路径来源由调用方注入（desktop host 传 homedir 与 getDataBaseDir），模块内不读环境变量。
 */
import { join, resolve } from "node:path";
export const ZCODE_DATA_DIR_NAME = ".zcode";
export function resolveStorageRoots(params) {
    const home = resolve(params.homeDir);
    const dataBase = resolve(params.dataBaseDir);
    const hasCustomDataBaseDir = dataBase !== home;
    const roots = [
        { id: "home", path: join(home, ZCODE_DATA_DIR_NAME), hasCustomDataBaseDir },
    ];
    if (hasCustomDataBaseDir) {
        roots.push({
            id: "dataBaseDir",
            path: join(dataBase, ZCODE_DATA_DIR_NAME),
            hasCustomDataBaseDir,
        });
    }
    return roots;
}
export function createStorageRootsResolver(params) {
    return {
        resolveRoots: async () => resolveStorageRoots({ homeDir: params.getHomeDir(), dataBaseDir: params.getDataBaseDir() }),
    };
}
//# sourceMappingURL=rootsResolver.js.map