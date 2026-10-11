/** 同一任务只有一个实时源；接收目标自己串行消费，单个渠道失败不阻塞其他渠道。 */
export function createBotTaskStreamHub() {
    const streams = new Map();
    return {
        add(taskKey, targetKey, subscribe, listener) {
            let stream = streams.get(taskKey);
            if (!stream) {
                const listeners = new Map();
                const upstream = subscribe(async (event) => {
                    await Promise.allSettled([...listeners.values()].map(async (receive) => receive(event)));
                });
                stream = { listeners, upstream };
                streams.set(taskKey, stream);
            }
            stream.listeners.set(targetKey, listener);
            const current = stream;
            return {
                dispose() {
                    if (current.listeners.get(targetKey) !== listener)
                        return;
                    current.listeners.delete(targetKey);
                    if (current.listeners.size === 0) {
                        current.upstream.dispose();
                        if (streams.get(taskKey) === current)
                            streams.delete(taskKey);
                    }
                },
            };
        },
        dispose() {
            for (const stream of streams.values()) {
                stream.listeners.clear();
                stream.upstream.dispose();
            }
            streams.clear();
        },
    };
}
//# sourceMappingURL=taskStreamHub.js.map