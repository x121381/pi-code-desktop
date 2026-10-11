import { DATA_BASE_DIR_FORBIDDEN_WINDOWS_INSTALL_DIR_ERROR_CODE } from "@zcode/shared";
export declare const ZCODE_WINDOWS_APP_INSTALL_DIR_ENV = "ZCODE_WINDOWS_APP_INSTALL_DIR";
export interface DataBaseDirTargetValidationOptions {
    platform?: NodeJS.Platform | string;
    env?: Record<string, string | undefined>;
    appInstallDir?: string | null;
}
export type DataBaseDirTargetValidationResult = {
    ok: true;
} | {
    ok: false;
    code: typeof DATA_BASE_DIR_FORBIDDEN_WINDOWS_INSTALL_DIR_ERROR_CODE;
    forbiddenDir: string;
};
/** Set the base directory for app data (replaces homedir() prefix). */
export declare function setDataBaseDir(dir: string | null): void;
/** Get the current base directory. Priority: setDataBaseDir() > env ZCODE_DATA_BASE_DIR > homedir(). */
export declare function getDataBaseDir(): string;
/** {dataBaseDir}/.zcode */
export declare function getZCodeDataRootDir(): string;
/** 非项目对话共享的真实工作目录；默认 ~/.zcode/workspace/default。 */
export declare function getConversationWorkspaceDir(): string;
/** {dataBaseDir}/.zcode/v2 */
export declare function getAppConfigDir(): string;
export declare function validateDataBaseDirTarget(targetBaseDir: string, options?: DataBaseDirTargetValidationOptions): DataBaseDirTargetValidationResult;
export declare function getExportLogStageDir(): string;
export declare function getExportLogDir(): string;
export declare function getFeedbackRootDir(): string;
export declare function getFeedbackAttachmentDir(): string;
export declare function getFeedbackLogArchiveDir(): string;
export declare function getGitCheckpointIndexRootDir(): string;
/** ~/.zcode/v2/tasks-index.sqlite */
export declare function getTasksIndexDatabasePath(): string;
/** 与 ZCode session 持久化一致：使用 workspaceKey 的 SHA-256 前 12 位 */
export declare function getWorkspaceHash(workspacePath: string, workspaceIdentity?: string): string;
/** ~/.zcode/v2/sessions/{workspaceHash}/{taskId}.json */
export declare function getLegacyTaskSessionSnapshotPath(workspacePath: string, taskId: string, workspaceIdentity?: string): string;
/** ~/.zcode/v2/sessions/{workspaceHash}/{taskId}.deleted.json */
export declare function getLegacyDeletedTaskSessionSnapshotPath(workspacePath: string, taskId: string, workspaceIdentity?: string): string;
/**
 * GLM（唯一 agent provider）的配置目录：~/.zcode/cli。
 * Bugfix：GLM 配置改为直接读写新版 zcode-cli 的全局配置目录，不做 workspace 隔离，
 * 避免同机不同工作区配置漂移。
 */
export declare function getProviderWorkspaceConfigDir(): string;
/**
 * Copy the .zcode/v2 data directory from one base dir to another.
 * Excludes setting.json and its transient atomic-write siblings — bootstrap
 * state must only live at the default homedir location.
 */
export declare function copyDataDirectory(oldBaseDir: string, newBaseDir: string): Promise<void>;
//# sourceMappingURL=paths.d.ts.map