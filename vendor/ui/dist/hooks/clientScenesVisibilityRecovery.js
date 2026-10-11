/** Page Visibility 恢复协调器：同一 authority 可有多个 React 消费方，每次重开只执行一个回调。 */
export function createClientScenesVisibilityRecovery(documentTarget) {
    const activeRevalidators = new Map();
    const handledGenerations = new WeakMap();
    let listening = false;
    let rendererWasHidden = false;
    let reopenGeneration = 0;
    const handleVisibilityChange = () => {
        if (documentTarget.visibilityState === "hidden") {
            rendererWasHidden = true;
            return;
        }
        if (!rendererWasHidden)
            return;
        rendererWasHidden = false;
        reopenGeneration += 1;
        for (const [authority, revalidators] of activeRevalidators) {
            const revalidate = revalidators.values().next().value;
            if (!revalidate)
                continue;
            handledGenerations.set(authority, reopenGeneration);
            revalidate();
        }
    };
    return {
        subscribe(authority, revalidate) {
            if (!listening) {
                listening = true;
                rendererWasHidden = documentTarget.visibilityState === "hidden";
                documentTarget.addEventListener("visibilitychange", handleVisibilityChange);
            }
            const revalidators = activeRevalidators.get(authority) ?? new Set();
            revalidators.add(revalidate);
            activeRevalidators.set(authority, revalidators);
            const handledGeneration = handledGenerations.get(authority);
            if (handledGeneration === undefined) {
                handledGenerations.set(authority, reopenGeneration);
            }
            else if (handledGeneration < reopenGeneration) {
                handledGenerations.set(authority, reopenGeneration);
                revalidate();
            }
            return () => {
                // renderer 可能在没有 Scene 消费方挂载时被 hide/show；保留 authority 的已处理代次，
                // 让同一缓存下次挂载时仍能观察到失效，而不是继续命中重开前的 10 分钟缓存。
                revalidators.delete(revalidate);
                if (revalidators.size === 0)
                    activeRevalidators.delete(authority);
            };
        },
    };
}
//# sourceMappingURL=clientScenesVisibilityRecovery.js.map