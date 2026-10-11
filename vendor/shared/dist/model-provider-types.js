/* eslint-disable max-lines -- 模型供应商 schema、迁移和运行时投影 helper 需要共享同一套类型边界，暂时集中在单文件避免契约分散。 */
export const BUILTIN_PROVIDER_TEMPLATE_IDS = {
    zai: "zai-api",
    bigmodel: "bigmodel-api",
};
export const BUILTIN_MODEL_PROVIDER_IDS = {
    zaiIndividualCodingPlan: "account:zai-individual-coding-plan",
    zaiTeamCodingPlan: "account:zai-team-coding-plan",
    zaiStartPlan: "account:zai-start-plan",
    bigmodelIndividualCodingPlan: "account:bigmodel-individual-coding-plan",
    bigmodelTeamCodingPlan: "account:bigmodel-team-coding-plan",
    bigmodelStartPlan: "account:bigmodel-start-plan",
};
export function isBuiltinModelProviderId(id) {
    return (id === BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan ||
        id === BUILTIN_MODEL_PROVIDER_IDS.zaiTeamCodingPlan ||
        id === BUILTIN_MODEL_PROVIDER_IDS.zaiStartPlan ||
        id === BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan ||
        id === BUILTIN_MODEL_PROVIDER_IDS.bigmodelTeamCodingPlan ||
        id === BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan);
}
export function isZaiCodingPlanProviderId(id) {
    return (id === BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan ||
        id === BUILTIN_MODEL_PROVIDER_IDS.zaiTeamCodingPlan ||
        id === BUILTIN_MODEL_PROVIDER_IDS.zaiStartPlan);
}
export function isBigModelStartPlanProviderId(id) {
    return id === BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan;
}
export function isStartPlanModelProviderId(id) {
    return (id === BUILTIN_MODEL_PROVIDER_IDS.zaiStartPlan ||
        id === BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan);
}
/**
 * 个人版 Coding Plan（不含 Start Plan 与 Team Plan）。
 * Start Plan 用 disconnected 展示领取/付费卡，Team Plan 有独立文案，
 * "服务端明确无权益"只对个人版需要区分成"未开通"。
 */
export function isIndividualCodingPlanModelProviderId(id) {
    return (id === BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan ||
        id === BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan);
}
export function isCodingPlanModelProviderId(id) {
    return (isZaiCodingPlanProviderId(id) ||
        id === BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan ||
        id === BUILTIN_MODEL_PROVIDER_IDS.bigmodelTeamCodingPlan ||
        id === BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan);
}
//# sourceMappingURL=model-provider-types.js.map