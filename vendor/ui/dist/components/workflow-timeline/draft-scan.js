const TOKEN = /\b(phase|agent)\(\s*(?:(["'`])([^"'`\n]*)(\2)?)?/gu;
export function scanWorkflowDraft(script) {
    const phases = [];
    const agents = [];
    for (const match of script.matchAll(TOKEN)) {
        const [, kind, quote, body, closing] = match;
        if (quote === undefined)
            continue;
        // 模板字面量里的插值只取头部：`研究员${i}` 记成「研究员」——名字的形状比空着强。
        const name = (body ?? "").split("${")[0].trim();
        const closed = closing !== undefined;
        if (kind === "phase") {
            // 已经在 typing 的站就是这个标记本身：流式下同一处会被扫到多次，定名而不是再开一站。
            const last = phases[phases.length - 1];
            if (last?.typing === true) {
                last.name = name;
                if (closed)
                    delete last.typing;
                continue;
            }
            if (closed && phases.some((phase) => phase.name === name))
                continue;
            phases.push({ name, ...(closed ? {} : { typing: true }) });
            continue;
        }
        if (!closed || name.length === 0)
            continue;
        if (!agents.includes(name))
            agents.push(name);
    }
    return { agents, phases };
}
/** 草稿 → 时间线模型：只有站与淡墨轨道段，没有药丸、没有弧、没有状态。 */
export function draftTimeline(draft) {
    const stations = draft.phases.map((phase, i) => ({
        id: `draft:${i}`,
        naming: { id: `draft:${i}`, name: phase.name },
        onLoop: false,
        pills: [],
        rounds: 0,
        status: undefined,
        track: 0,
        visited: false,
        ...(phase.typing === true ? { typing: true } : {}),
    }));
    return {
        arcs: [],
        bands: [],
        draft: { agents: draft.agents.length },
        live: false,
        rails: stations.slice(1).map((_, i) => ({ from: i, ink: "faint", to: i + 1 })),
        runningIndex: undefined,
        stations,
    };
}
//# sourceMappingURL=draft-scan.js.map