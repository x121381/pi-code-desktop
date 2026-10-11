export class PluginUiPageManager {
    timer;
    clearTask;
    changed;
    allocated = new Set();
    admission = Promise.resolve();
    pages = new Map();
    tasks = new Map();
    timers = new Map();
    pendingAdds = new Map();
    constructor(timer, clearTask, changed = () => { }) {
        this.timer = timer;
        this.clearTask = clearTask;
        this.changed = changed;
    }
    get(key) {
        return this.pages.get(key);
    }
    add(page) {
        const admission = { cancelled: false };
        this.pendingAdds.set(page, admission);
        const pending = this.admission
            .then(async () => {
            if (admission.cancelled)
                throw new Error("MCP App task was removed");
            if (this.pages.has(page.key))
                throw new Error("Duplicate MCP App page owner");
            if (!this.tasks.has(page.task) && this.tasks.size >= 30) {
                let evicted = false;
                for (const [task, keys] of this.tasks) {
                    const candidates = [...keys]
                        .map((key) => this.pages.get(key))
                        .filter((p) => p !== undefined);
                    if (candidates.some((p) => p.visible || p.busy()))
                        continue;
                    let idle = true;
                    for (const background of candidates) {
                        if ((await background.suspend()) === false) {
                            idle = false;
                            break;
                        }
                    }
                    if (admission.cancelled)
                        throw new Error("MCP App task was removed");
                    if (candidates.some((p) => p.visible || p.busy()))
                        continue;
                    if (!idle)
                        continue;
                    this.removeTask(task);
                    evicted = true;
                    break;
                }
                if (!evicted)
                    throw new Error("MCP App task capacity reached");
            }
            const keys = this.tasks.get(page.task) ?? new Set();
            this.tasks.delete(page.task);
            this.tasks.set(page.task, keys);
            keys.add(page.key);
            this.pages.set(page.key, page);
        })
            .finally(() => this.pendingAdds.delete(page));
        this.admission = pending.catch(() => undefined);
        return pending;
    }
    reserve(page) {
        const pending = this.admission.then(async () => {
            if (this.allocated.has(page))
                return;
            if (this.pages.get(page.key) !== page)
                throw new Error("MCP App page was removed");
            const running = [...this.allocated];
            if (running.length < 64) {
                this.allocated.add(page);
                return;
            }
            for (const candidate of running) {
                if (candidate.visible || candidate.busy())
                    continue;
                if ((await candidate.suspend()) === false)
                    continue;
                this.allocated.delete(candidate);
                // 回收等待期间任务可能被删除；旧 admission 不得重新占用已经撤销的槽位。
                if (this.pages.get(page.key) !== page)
                    throw new Error("MCP App page was removed");
                this.allocated.add(page);
                return;
            }
            throw new Error("MCP App sandbox capacity reached");
        });
        this.admission = pending.catch(() => undefined);
        return pending;
    }
    released(page) {
        this.allocated.delete(page);
    }
    visibility(page, visible) {
        if (this.pages.get(page.key) !== page)
            return;
        page.visible = visible;
        this.timers.get(page.key)?.();
        this.timers.delete(page.key);
        if (visible) {
            const keys = this.tasks.get(page.task);
            this.tasks.delete(page.task);
            this.tasks.set(page.task, keys);
        }
        else
            this.timers.set(page.key, this.timer(() => {
                this.timers.delete(page.key);
                if (!page.visible && !page.busy())
                    page.suspend();
            }, 5 * 60_000));
    }
    settled(page) {
        if (this.pages.get(page.key) !== page)
            return;
        if (!page.visible && !page.busy() && !this.timers.has(page.key))
            page.suspend();
    }
    removeTask(task) {
        for (const [page, pending] of this.pendingAdds) {
            if (page.task === task)
                pending.cancelled = true;
        }
        const keys = this.tasks.get(task);
        if (!keys)
            return;
        this.tasks.delete(task);
        for (const key of keys) {
            const page = this.pages.get(key);
            this.pages.delete(key);
            this.timers.get(key)?.();
            this.timers.delete(key);
            page?.destroy();
            this.changed(key);
        }
        this.clearTask(task);
    }
    clear() {
        for (const pending of this.pendingAdds.values())
            pending.cancelled = true;
        for (const task of this.tasks.keys())
            this.removeTask(task);
    }
}
//# sourceMappingURL=pluginUiPageManager.js.map