interface WeixinRegistrationBeginResult {
    qrCode: string;
    qrUrl: string;
    interval: number;
    expiresAt: number;
}
interface WeixinRegistrationPollParams {
    qrCode: string;
}
type WeixinRegistrationPollResult = {
    status: "pending" | "scanned";
    interval: number;
} | {
    status: "success";
    botToken: string;
    botId?: string;
} | {
    status: "expired" | "error";
    message?: string;
};
export declare function beginWeixinRegistration(): Promise<WeixinRegistrationBeginResult>;
export declare function pollWeixinRegistration(params: WeixinRegistrationPollParams): Promise<WeixinRegistrationPollResult>;
export {};
//# sourceMappingURL=weixinRegistration.d.ts.map