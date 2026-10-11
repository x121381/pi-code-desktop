import { create } from "zustand";
import { logger } from "../logger.js";
const INITIAL_SNAPSHOT = {
    status: "loading",
    enabled: false,
    config: null,
};
let inFlight = null;
/** 已经出过结果（成功或失败）的 service 实例；同一实例不再重复请求。 */
let settledService = null;
async function loadDynamicWorkflowConfig(service, options, publish) {
    try {
        const config = await service.getDynamicWorkflowClientConfig(options);
        publish({ status: "ready", enabled: config.enabled === true, config });
    }
    catch (error) {
        logger.warn("[dynamic-workflow] 灰度快照读取失败，按未命中处理", error instanceof Error ? error.message : String(error));
        publish({ status: "ready", enabled: false, config: null });
    }
    finally {
        settledService = service;
    }
}
export const useDynamicWorkflowAvailabilityStore = create((set, get) => ({
    ...INITIAL_SNAPSHOT,
    ensureLoaded(service) {
        if (settledService === service)
            return Promise.resolve();
        if (inFlight) {
            // 在途的可能是另一份 service（手机 `/remote` 桥接期间 accessor 会换）：排在它后面再判一次。
            // 若在途的就是这一份，那时 settledService 已等于它，递归会立即命中上面的 no-op。
            return inFlight.then(() => get().ensureLoaded(service));
        }
        const run = loadDynamicWorkflowConfig(service, {}, set).finally(() => {
            if (inFlight === run)
                inFlight = null;
        });
        inFlight = run;
        return run;
    },
    refresh(service) {
        return loadDynamicWorkflowConfig(service, { forceRefresh: true }, set);
    },
    reload(service) {
        return loadDynamicWorkflowConfig(service, {}, set);
    },
}));
/** 测试用：清掉快照与「已出结果」闩。 */
export function resetDynamicWorkflowAvailabilityStoreForTests() {
    inFlight = null;
    settledService = null;
    useDynamicWorkflowAvailabilityStore.setState({ ...INITIAL_SNAPSHOT });
}
//# sourceMappingURL=dynamicWorkflowAvailabilityStore.js.map