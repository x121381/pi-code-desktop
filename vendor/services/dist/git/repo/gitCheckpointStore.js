import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getAppConfigDir, getWorkspaceHash } from "../../paths.js";
function isGitCheckpointMeta(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const candidate = value;
    return (typeof candidate.checkpointId === "string" &&
        typeof candidate.workspacePath === "string" &&
        typeof candidate.repoRoot === "string" &&
        typeof candidate.workspaceInRepoPath === "string" &&
        typeof candidate.createdAt === "number" &&
        typeof candidate.refName === "string" &&
        typeof candidate.commitOid === "string" &&
        candidate.scope === "workspace");
}
export class GitCheckpointStore {
    options;
    constructor(options) {
        this.options = options;
    }
    writeChains = new Map();
    get checkpointsDir() {
        return this.options?.rootDir ?? join(getAppConfigDir(), "checkpoints");
    }
    checkpointDir(workspacePath) {
        return join(this.checkpointsDir, getWorkspaceHash(workspacePath));
    }
    checkpointFilePath(workspacePath, checkpointId) {
        return join(this.checkpointDir(workspacePath), `${checkpointId}.json`);
    }
    async waitForPendingWrite(filePath) {
        await this.writeChains.get(filePath)?.catch(() => { });
    }
    enqueueWrite(filePath, operation) {
        const previous = this.writeChains.get(filePath) ?? Promise.resolve();
        const result = previous.catch(() => { }).then(operation);
        const completion = result.then(() => undefined, () => undefined);
        this.writeChains.set(filePath, completion);
        void completion.finally(() => {
            if (this.writeChains.get(filePath) === completion) {
                this.writeChains.delete(filePath);
            }
        });
        return result;
    }
    async writeManifestAtomic(filePath, meta) {
        const tempPath = `${filePath}.${process.pid}.${Date.now().toString(36)}.${Math.random()
            .toString(36)
            .slice(2, 8)}.tmp`;
        await writeFile(tempPath, `${JSON.stringify(meta, null, 2)}\n`, "utf-8");
        await rename(tempPath, filePath);
    }
    async save(meta) {
        const filePath = this.checkpointFilePath(meta.workspacePath, meta.checkpointId);
        await this.enqueueWrite(filePath, async () => {
            await mkdir(this.checkpointDir(meta.workspacePath), { recursive: true });
            await this.writeManifestAtomic(filePath, meta);
        });
    }
    async load(workspacePath, checkpointId) {
        const filePath = this.checkpointFilePath(workspacePath, checkpointId);
        try {
            await this.waitForPendingWrite(filePath);
            const raw = await readFile(filePath, "utf-8");
            const parsed = JSON.parse(raw);
            return isGitCheckpointMeta(parsed) ? parsed : null;
        }
        catch {
            return null;
        }
    }
    async delete(workspacePath, checkpointId) {
        const filePath = this.checkpointFilePath(workspacePath, checkpointId);
        await this.enqueueWrite(filePath, async () => {
            await rm(filePath, { force: true });
        });
    }
}
//# sourceMappingURL=gitCheckpointStore.js.map