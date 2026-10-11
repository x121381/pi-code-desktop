import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { getLegacyTaskSessionSnapshotPath } from "#src/paths.js";
import { parseLegacyTaskSessionFile, } from "#src/session/legacyTaskSessionFile.js";
const TASK_SEARCH_TEXT_MAX_CHARS = 200_000;
export function buildSearchableTextFromMessages(messages) {
    const parts = [];
    let total = 0;
    for (const message of messages) {
        const content = message.content.trim();
        if (!content) {
            continue;
        }
        const next = total > 0 ? `\n${content}` : content;
        if (total + next.length > TASK_SEARCH_TEXT_MAX_CHARS) {
            parts.push(next.slice(0, TASK_SEARCH_TEXT_MAX_CHARS - total));
            break;
        }
        parts.push(next);
        total += next.length;
    }
    return parts.join("");
}
async function writeSessionFileAtomic(filePath, sessionFile) {
    const tempPath = `${filePath}.${process.pid}.${Date.now().toString(36)}.${Math.random()
        .toString(36)
        .slice(2, 8)}.tmp`;
    const serialized = JSON.stringify(sessionFile, null, 2);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(tempPath, `${serialized}\n`, "utf-8");
    await rename(tempPath, filePath);
}
export async function persistImportedClaudeTask(params) {
    const parsed = parseLegacyTaskSessionFile(params.sessionFile);
    const meta = {
        ...parsed.meta,
        ...(params.workspaceIdentity ? { workspaceIdentity: params.workspaceIdentity } : {}),
    };
    const indexMeta = {
        ...meta,
        // SQLite task index 的 mode 列仍是 NOT NULL；导入 snapshot 本身保持过滤后的缺省。
        mode: meta.mode ?? "default",
    };
    await writeImportedClaudeTaskSnapshot({ sessionFile: { ...parsed, meta } });
    return params.taskIndexRepo.syncTaskMeta({
        meta: indexMeta,
        // 用户删除/归档已导入会话后再次导入，旧 index 行会保留 archived/deleted。
        // 重导入语义是恢复这条会话到列表中，因此这里显式取消隐藏状态。
        archived: false,
        deleted: false,
        searchableText: buildSearchableTextFromMessages(parsed.messages),
    });
}
export async function writeImportedClaudeTaskSnapshot(params) {
    const parsed = parseLegacyTaskSessionFile(params.sessionFile);
    const filePath = getLegacyTaskSessionSnapshotPath(parsed.meta.workspacePath, parsed.meta.taskId, parsed.meta.workspaceIdentity);
    // legacy ACP 下线后 importClaudeSessions 变成空桩，导入虽复制了 jsonl 却没有写
    // ~/.zcode/v2/sessions/{hash}/{taskId}.json。现在真实 ZCode session 承担续聊，legacy snapshot
    // 只保存过滤后的迁移备份，避免 Claude 来源运行态污染当前模型选择。
    await writeSessionFileAtomic(filePath, parsed);
}
//# sourceMappingURL=persistImportedClaudeTask.js.map