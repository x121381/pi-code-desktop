import { API_KEY_USAGE_SCENE } from "@zcode/shared";
import { readApiJson } from "../providers/api/apiJson.js";
const BIGMODEL_TEAM_PLAN_API_KEY_NAME = "zcode-team-api-key";
const BIGMODEL_TEAM_PLAN_API_KEY_TYPE = 2;
export function createBigModelBizHeaders(authorization, teamContext) {
    const headers = {
        Authorization: authorization,
        "Content-Type": "application/json",
    };
    if (teamContext) {
        headers["bigmodel-organization"] = teamContext.organizationId;
        headers["bigmodel-project"] = teamContext.projectId;
    }
    return headers;
}
function createBigModelTeamPlanApiKeyPayload() {
    return {
        name: BIGMODEL_TEAM_PLAN_API_KEY_NAME,
        keyType: BIGMODEL_TEAM_PLAN_API_KEY_TYPE,
        // keyType 描述团队 Key 类型，usageScene 描述编程套餐用途，两者不能互相替代。
        usageScene: API_KEY_USAGE_SCENE.CODING_PLAN,
    };
}
function isUsableBigModelTeamPlanApiKey(item) {
    return (item.name === BIGMODEL_TEAM_PLAN_API_KEY_NAME &&
        item.keyType === BIGMODEL_TEAM_PLAN_API_KEY_TYPE &&
        Boolean(item.apiKey?.trim()));
}
export async function ensureBigModelTeamPlanProjectApiKey(params) {
    const result = await ensureBigModelTeamPlanProjectApiKeyWithStatus(params);
    return result.apiKey;
}
export async function ensureBigModelTeamPlanProjectApiKeyWithStatus(params) {
    const listUrl = buildBigModelTeamPlanApiKeysUrl(params.host, params.teamContext);
    const listPayload = await readApiJson(params.apiClient, listUrl, {
        method: "GET",
        timeoutMs: params.timeoutMs,
        headers: createBigModelBizHeaders(params.authorization, params.teamContext),
    });
    const apiKeys = isSuccessfulBigModelBizEnvelope(listPayload) ? (listPayload.data ?? []) : [];
    const listDiagnostics = {
        ...createBigModelBizEnvelopeDiagnostics(listPayload),
        apiKeyCount: apiKeys.length,
        usableApiKeyCount: apiKeys.filter(isUsableBigModelTeamPlanApiKey).length,
    };
    const existingApiKey = apiKeys.find(isUsableBigModelTeamPlanApiKey) ?? null;
    if (existingApiKey) {
        return {
            apiKey: existingApiKey,
            diagnostics: { list: listDiagnostics },
            status: "existing",
        };
    }
    // 一个账号可能有多个 Team Plan 项目，每个项目都需要自己的 keyType=2
    // 项目级 API Key；只给当前选中团队创建会导致切换到其他团队后 runtime 无法投影。
    const createPayload = await readApiJson(params.apiClient, listUrl, {
        method: "POST",
        timeoutMs: params.timeoutMs,
        headers: createBigModelBizHeaders(params.authorization, params.teamContext),
        body: JSON.stringify(createBigModelTeamPlanApiKeyPayload()),
    });
    const createData = isSuccessfulBigModelBizEnvelope(createPayload)
        ? (createPayload.data ?? null)
        : null;
    const createdApiKey = createData && isUsableBigModelTeamPlanApiKey(createData) ? createData : null;
    return {
        apiKey: createdApiKey,
        diagnostics: {
            create: {
                ...createBigModelBizEnvelopeDiagnostics(createPayload),
                dataHasApiKey: Boolean(createPayload.data?.apiKey?.trim()),
                dataKeyType: typeof createPayload.data?.keyType === "number" ? createPayload.data.keyType : null,
                dataName: createPayload.data?.name?.trim() || null,
            },
            list: listDiagnostics,
        },
        status: createdApiKey ? "created" : "missing",
    };
}
function buildBigModelTeamPlanApiKeysUrl(host, teamContext) {
    return (`${host}/api/biz/v1/organization/${encodeURIComponent(teamContext.organizationId)}` +
        `/projects/${encodeURIComponent(teamContext.projectId)}/api_keys`);
}
function isSuccessfulBigModelBizEnvelope(envelope) {
    if (envelope.success === false) {
        return false;
    }
    if (typeof envelope.code === "number") {
        return envelope.code === 0 || envelope.code === 200;
    }
    return envelope.success === true || envelope.data !== undefined;
}
function createBigModelBizEnvelopeDiagnostics(envelope) {
    return {
        code: typeof envelope.code === "number" ? envelope.code : null,
        msg: envelope.msg?.trim() || null,
        success: typeof envelope.success === "boolean" ? envelope.success : null,
    };
}
//# sourceMappingURL=teamPlanApiKey.js.map