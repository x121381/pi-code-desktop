export declare const BUILTIN_PROVIDER_TEMPLATE_IDS: {
    readonly zai: "zai-api";
    readonly bigmodel: "bigmodel-api";
};
export declare const BUILTIN_MODEL_PROVIDER_IDS: {
    readonly zaiIndividualCodingPlan: "account:zai-individual-coding-plan";
    readonly zaiTeamCodingPlan: "account:zai-team-coding-plan";
    readonly zaiStartPlan: "account:zai-start-plan";
    readonly bigmodelIndividualCodingPlan: "account:bigmodel-individual-coding-plan";
    readonly bigmodelTeamCodingPlan: "account:bigmodel-team-coding-plan";
    readonly bigmodelStartPlan: "account:bigmodel-start-plan";
};
export type BuiltinOAuthProviderId = keyof typeof BUILTIN_MODEL_PROVIDER_IDS;
export type BuiltinModelProviderId = (typeof BUILTIN_MODEL_PROVIDER_IDS)[BuiltinOAuthProviderId];
export declare function isBuiltinModelProviderId(id: string): id is BuiltinModelProviderId;
export declare function isZaiCodingPlanProviderId(id: string): boolean;
export declare function isBigModelStartPlanProviderId(id: string): boolean;
export declare function isStartPlanModelProviderId(id: string): boolean;
/**
 * 个人版 Coding Plan（不含 Start Plan 与 Team Plan）。
 * Start Plan 用 disconnected 展示领取/付费卡，Team Plan 有独立文案，
 * "服务端明确无权益"只对个人版需要区分成"未开通"。
 */
export declare function isIndividualCodingPlanModelProviderId(id: string): boolean;
export declare function isCodingPlanModelProviderId(id: string): boolean;
/** 一个正式 Model 的连通性测试结果。 */
export type ModelConnectivityResult = {
    readonly success: true;
} | {
    readonly success: false;
    readonly error: {
        readonly message: string;
        /** 设置连接测试边界已确认的资格失败；其他执行错误保留原消息。 */
        readonly code?: "provider-unavailable" | "model-unavailable";
    };
};
//# sourceMappingURL=model-provider-types.d.ts.map