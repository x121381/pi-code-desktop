// ============================================================
// 脚本 transcript 的「日志簿」形态：将卡片组织为章节（阶段）、时间标尺和命令输出尾部。
// 无 React、无 DOM、无取数。
// ============================================================
// 章节按**执行顺序**切：连续同一阶段的卡是一章，再次进入同一阶段是新的一章、轮次 +1——
// 与侧板脊线的 ⟳n 同一口径（进入次数），而不是某个站点被调用的次数。
export function buildWorkspaceChapters(cards) {
    const chapters = [];
    const entries = new Map();
    for (const card of cards) {
        const last = chapters.at(-1);
        const phaseId = card.phase?.id;
        if (last !== undefined && last.phase?.id === phaseId) {
            last.cards.push(card);
            last.startedAt = Math.min(last.startedAt, card.node.createdAt);
            last.endedAt = Math.max(last.endedAt, card.node.updatedAt);
            continue;
        }
        const round = phaseId === undefined ? 1 : (entries.get(phaseId) ?? 0) + 1;
        if (phaseId !== undefined)
            entries.set(phaseId, round);
        chapters.push({
            key: `${phaseId ?? "-"}#${chapters.length}`,
            phase: card.phase,
            round,
            cards: [card],
            startedAt: card.node.createdAt,
            endedAt: card.node.updatedAt,
        });
    }
    return chapters;
}
/** 时间标尺的零点：第一张卡的准入时刻（run 自己的开始时刻不在清单上）。 */
export function transcriptOrigin(cards) {
    let origin;
    for (const card of cards) {
        if (origin === undefined || card.node.createdAt < origin)
            origin = card.node.createdAt;
    }
    return origin;
}
/** `+0:00` / `+1:12` / `+1:02:05`：一张卡相对零点的时刻。 */
export function formatOffset(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const seconds = total % 60;
    const minutes = Math.floor(total / 60) % 60;
    const hours = Math.floor(total / 3600);
    const mmss = `${minutes}:${String(seconds).padStart(2, "0")}`;
    return hours > 0
        ? `+${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        : `+${mmss}`;
}
/** `6s` / `2m 05s`：running 的那张卡「开始于多久前」。 */
export function formatAgo(ms) {
    const seconds = Math.max(0, Math.round(ms / 1000));
    if (seconds < 60)
        return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)
        return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${String(minutes % 60).padStart(2, "0")}m`;
}
export function transcriptSummary(cards, now) {
    const phases = new Set();
    let start;
    let end = 0;
    let running = false;
    for (const card of cards) {
        if (card.phase !== undefined)
            phases.add(card.phase.id);
        if (start === undefined || card.node.createdAt < start)
            start = card.node.createdAt;
        end = Math.max(end, card.node.updatedAt);
        if (card.node.status === "running")
            running = true;
    }
    const durationMs = start === undefined ? 0 : Math.max(0, (running ? now : end) - start);
    return { phases: phases.size, steps: cards.length, durationMs };
}
export function isErrorLine(line) {
    const trimmed = line.trim();
    return /^([×✗✖]|x\s|FAIL\b|ERR(OR)?\b|Error\b|error:)/i.test(trimmed) || /Error:/.test(trimmed);
}
/** 命令输出的尾巴：stdout 最后几行非空行；stdout 空则 stderr；字符串正文同理；其余没有 peek。 */
export function peekLinesOf(result, max = 3) {
    let text;
    if (typeof result === "string")
        text = result;
    else if (result !== null && typeof result === "object" && !Array.isArray(result)) {
        const fields = result;
        const stdout = typeof fields.stdout === "string" ? fields.stdout : "";
        const stderr = typeof fields.stderr === "string" ? fields.stderr : "";
        text = stdout.trim().length > 0 ? stdout : stderr;
    }
    if (text === undefined)
        return [];
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    return lines.slice(-max).map((line) => ({ text: line, error: isErrorLine(line) }));
}
// 展开态按卡记忆（与 ToolLayout 的模块级 map 同一做法）：收起再展开、切 tab 再回来都还在。
const openState = new Map();
export function rememberedOpen(key) {
    return openState.get(key) ?? false;
}
export function setRememberedOpen(key, open) {
    openState.set(key, open);
}
/** 测试用：清空展开态记忆。 */
export function resetWorkspaceEntryOpenState() {
    openState.clear();
}
//# sourceMappingURL=workflowWorkspaceLogbook.js.map