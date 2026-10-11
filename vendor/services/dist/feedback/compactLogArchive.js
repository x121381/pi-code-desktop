import { rm } from "node:fs/promises";
import { join } from "node:path";
import { getAppConfigDir, getFeedbackLogArchiveDir } from "../paths.js";
import { createFeedbackDiagnosticArchive } from "./feedbackLogArchive.js";
export async function prepareCompactLogArchive(options) {
    const sourceDir = getAppConfigDir();
    if (options?.full && options.createFullArchive) {
        return options.createFullArchive(sourceDir, { onProgress: options.onProgress });
    }
    return createFeedbackDiagnosticArchive({
        sources: [{ directory: join(sourceDir, "logs"), archivePrefix: "logs" }],
        outputRootDir: getFeedbackLogArchiveDir(),
        ...(!options?.full ? { maxTotalBytes: 2 * 1024 * 1024 } : {}),
        onProgress: options?.onProgress,
    });
}
export async function cleanupLogArchive(path) {
    await rm(join(path, ".."), { recursive: true, force: true }).catch(() => { });
}
//# sourceMappingURL=compactLogArchive.js.map