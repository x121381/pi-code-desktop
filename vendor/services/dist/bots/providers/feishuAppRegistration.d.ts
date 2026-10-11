type FeishuAppRegistrationDomain = "feishu" | "lark";
interface FeishuAppRegistrationBeginResult {
    deviceCode: string;
    qrUrl: string;
    userCode: string;
    interval: number;
    expiresAt: number;
    domain: FeishuAppRegistrationDomain;
    pollDomain?: FeishuAppRegistrationDomain;
}
type FeishuAppRegistrationPollResult = {
    status: "pending";
    interval: number;
    domain: FeishuAppRegistrationDomain;
    pollDomain?: FeishuAppRegistrationDomain;
} | {
    status: "success";
    appId: string;
    appSecret: string;
    domain: FeishuAppRegistrationDomain;
    appName?: string;
    openId?: string;
} | {
    status: "access_denied" | "expired" | "error";
    message?: string;
    domain: FeishuAppRegistrationDomain;
};
export declare function beginFeishuAppRegistration(domain?: FeishuAppRegistrationDomain): Promise<FeishuAppRegistrationBeginResult>;
export declare function pollFeishuAppRegistration(params: {
    deviceCode: string;
    domain?: FeishuAppRegistrationDomain;
    pollDomain?: FeishuAppRegistrationDomain;
}): Promise<FeishuAppRegistrationPollResult>;
export {};
//# sourceMappingURL=feishuAppRegistration.d.ts.map