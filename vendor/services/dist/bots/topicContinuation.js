/** 仅协调未提交的材料；run 的权威状态仍由调用方从 CLI 获取。 */
export function createTopicContinuation(ports) {
    let pending = [];
    let generation = 0;
    let releaseCancellation;
    let cancellation = new Promise((resolve) => {
        releaseCancellation = resolve;
    });
    let draining;
    const seen = new Set();
    async function drain() {
        while (pending.length) {
            const currentGeneration = generation;
            const cancelled = cancellation;
            let submitting;
            try {
                const runId = await Promise.race([ports.readRunningRun(), cancelled.then(() => undefined)]);
                if (currentGeneration !== generation)
                    continue;
                // 旧实现串行等待附件，导致后来的输入无法及时停止运行。先停止，再等材料。
                if (runId)
                    await Promise.race([ports.stopAndWait(runId), cancelled]);
                if (currentGeneration !== generation)
                    continue;
                let batch = [];
                let prepared = [];
                do {
                    batch = [...pending];
                    prepared = await Promise.race([
                        Promise.all(batch.map((message) => message.prepared)),
                        cancelled.then(() => []),
                    ]);
                    if (currentGeneration !== generation)
                        break;
                    // 等附件期间到达的消息也属于下一轮，保留到达顺序而非完成顺序。
                } while (batch.length !== pending.length);
                if (currentGeneration !== generation)
                    continue;
                pending.splice(0, batch.length);
                const failure = prepared.find((item) => !item.ok);
                if (failure && !failure.ok) {
                    await ports.failed(batch.map((message) => message.id), failure.error);
                    continue;
                }
                submitting = batch;
                await ports.submit(prepared.map((item) => {
                    if (!item.ok)
                        throw item.error;
                    return item.value;
                }));
            }
            catch (error) {
                if (currentGeneration !== generation)
                    continue;
                const failed = submitting ?? pending;
                if (!submitting)
                    pending = [];
                await ports.failed(failed.map((message) => message.id), error);
            }
        }
    }
    function start() {
        if (draining)
            return;
        draining = drain().finally(() => {
            draining = undefined;
            if (pending.length)
                start();
        });
    }
    return {
        receive(id, prepare) {
            if (seen.has(id))
                return false;
            seen.add(id);
            const prepared = Promise.resolve()
                .then(prepare)
                .then((value) => ({ ok: true, value }), (error) => ({ ok: false, error }));
            pending.push({ id, prepared });
            start();
            return true;
        },
        cancel() {
            generation++;
            pending = [];
            releaseCancellation();
            cancellation = new Promise((resolve) => {
                releaseCancellation = resolve;
            });
        },
        async settled() {
            while (draining)
                await draining;
        },
    };
}
//# sourceMappingURL=topicContinuation.js.map