import { spawn } from "node:child_process";
import { DEFAULT_GIT_DISCOVERY_TIMEOUT_MS, getGitBinaryCandidates, getGitCommandEnv, } from "../config.js";
async function canExecuteGitCandidate(candidate, env) {
    return await new Promise((resolve) => {
        const child = spawn(candidate, ["--version"], {
            env,
            stdio: "ignore",
            windowsHide: true,
        });
        const timer = setTimeout(() => {
            child.kill();
            resolve(false);
        }, DEFAULT_GIT_DISCOVERY_TIMEOUT_MS);
        child.once("error", () => {
            clearTimeout(timer);
            resolve(false);
        });
        child.once("close", (code) => {
            clearTimeout(timer);
            resolve(code === 0);
        });
    });
}
export function createGitEnvironmentProvider() {
    let cachedGitBinaryPromise = null;
    return {
        async resolveGitBinary() {
            if (cachedGitBinaryPromise) {
                return await cachedGitBinaryPromise;
            }
            const env = getGitCommandEnv();
            // Git binary 的探测在一次会话里不会频繁变化，
            // 这里缓存第一次探测结果，避免每个 Git RPC 都重复打一遍 `git --version`。
            cachedGitBinaryPromise = (async () => {
                for (const candidate of getGitBinaryCandidates()) {
                    if (await canExecuteGitCandidate(candidate, env)) {
                        return candidate;
                    }
                }
                return null;
            })();
            return await cachedGitBinaryPromise;
        },
        createCommandEnv() {
            return getGitCommandEnv();
        },
    };
}
//# sourceMappingURL=gitEnvironmentProvider.js.map