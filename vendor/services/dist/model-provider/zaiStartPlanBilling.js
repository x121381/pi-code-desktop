import { buildRuntimeZCodeEndpointUrls, normalizeOfficialGlmModelId, ZCODE_VERSION, } from "@zcode/shared";
import { readApiJson } from "../providers/api/apiJson.js";
const REQUEST_TIMEOUT_MS = 15_000;
const ZAI_START_PLAN_BALANCE_URL = buildRuntimeZCodeEndpointUrls(process.env).zcodePlanBillingBalanceUrl;
const inflightBalanceRequests = new WeakMap();
export function buildZaiStartPlanBalanceUrl() {
    const url = new URL(ZAI_START_PLAN_BALANCE_URL);
    // Start Plan balance 接口按真实 app_version 判定能力；
    // 开发环境也不能固定 3.0.0，否则本地验证会绕过当前 App 版本的后端策略。
    url.searchParams.set("app_version", ZCODE_VERSION);
    return url.toString();
}
export async function fetchZaiStartPlanBalanceEnvelope(apiClient, authorization, invalidateCache = false) {
    const requestKey = JSON.stringify({
        authorization: authorization.trim(),
        url: buildZaiStartPlanBalanceUrl(),
    });
    let requests = inflightBalanceRequests.get(apiClient);
    if (!requests) {
        requests = new Map();
        inflightBalanceRequests.set(apiClient, requests);
    }
    if (invalidateCache)
        requests.delete(requestKey);
    const inflight = requests.get(requestKey);
    if (inflight) {
        return inflight;
    }
    const url = buildZaiStartPlanBalanceUrl();
    const startedAt = Date.now();
    let responseTime;
    const observedApi = {
        request: async (input, init) => {
            const response = await apiClient.request(input, init);
            const date = Date.parse(response.headers.get("date") ?? "");
            if (Number.isFinite(date))
                responseTime = date / 1000;
            return response;
        },
    };
    const request = readApiJson(observedApi, url, {
        method: "GET",
        timeoutMs: REQUEST_TIMEOUT_MS,
        headers: {
            Authorization: authorization,
        },
    })
        .then((payload) => normalizeStartPlanExpiry(payload, responseTime))
        .finally(() => {
        // 账号校验先完成，用量查询随后到达：保留同一响应至发起后 1 秒。
        // 失败同样保留，避免 429 之后立刻重复请求；旧请求不得删除失效后创建的新记录。
        const evict = () => {
            if (requests?.get(requestKey) !== request)
                return;
            requests.delete(requestKey);
            if (requests.size === 0)
                inflightBalanceRequests.delete(apiClient);
        };
        const remainingMs = 1000 - (Date.now() - startedAt);
        if (remainingMs > 0)
            setTimeout(evict, remainingMs);
        else
            evict();
    });
    requests.set(requestKey, request);
    return request;
}
export function resolveZaiStartPlanBalanceModelIds(payload) {
    const seen = new Set();
    const modelIds = [];
    for (const balance of payload.data?.balances ?? []) {
        const fromCapabilities = (balance.capabilities ?? [])
            .map((capability) => {
            const normalized = capability.trim();
            return normalized.toLowerCase().startsWith("model:")
                ? normalized.slice("model:".length).trim()
                : "";
        })
            .filter(Boolean);
        const candidates = fromCapabilities.length > 0 ? fromCapabilities : [balance.show_name ?? ""];
        for (const candidate of candidates) {
            const modelId = normalizeOfficialGlmModelId(candidate.trim());
            const key = modelId.toLowerCase();
            if (!modelId || seen.has(key)) {
                continue;
            }
            seen.add(key);
            modelIds.push(modelId);
        }
    }
    return modelIds;
}
/** HTTP Date 与本次响应配对，避免旧 JSON 时间让过期 active 记录继续提供权益。 */
function normalizeStartPlanExpiry(payload, responseTime) {
    if (!payload.data)
        return payload;
    const serverTime = payload.data.server_time;
    const now = responseTime ??
        (typeof serverTime === "number" && Number.isFinite(serverTime) && serverTime >= 0
            ? serverTime
            : Date.now() / 1000);
    const plans = (payload.data.plans ?? []).map((plan) => {
        const end = Number(plan.ends_at);
        return plan.status?.trim().toLowerCase() === "active" &&
            Number.isFinite(end) &&
            end > 0 &&
            end <= now
            ? { ...plan, status: "expired" }
            : plan;
    });
    const balances = payload.data.balances?.filter((balance) => {
        const owners = plans.filter((plan) => balance.user_plan_id && plan.user_plan_id
            ? plan.user_plan_id === balance.user_plan_id
            : plan.plan_id === balance.plan_id);
        // 无归属桶继续由既有诊断处理，不能误删同商品另一个有效实例的余额。
        return !owners.length || owners.some((plan) => plan.status?.trim().toLowerCase() !== "expired");
    });
    return { ...payload, data: { ...payload.data, plans, balances } };
}
//# sourceMappingURL=zaiStartPlanBilling.js.map