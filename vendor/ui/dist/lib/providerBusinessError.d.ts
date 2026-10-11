/** 与 core `model-errors.ts` 中 anomaly guard 文案保持一致。 */
export declare const SUSPICIOUS_EMPTY_MODEL_RESULT_MESSAGE = "Model returned no text, no tool calls, and no usage before completing the turn.";
import { type RequestVerificationRecoveryAction } from "@/request-security-edition/errors.js";
export { resolveRequestVerificationBusinessCode, isRequestVerificationTerminalError, isRequestVerificationRejectedMessage, REQUEST_VERIFICATION_REJECTED_MESSAGE, } from "@/request-security-edition/errors.js";
export declare const PROVIDER_BUSINESS_ERROR_CODES: readonly ["1006", "1005", "3006", "3001", "3007", "3008", "3009", "3010", "3002", "3102", "2007", "429"];
export type ProviderBusinessErrorCode = (typeof PROVIDER_BUSINESS_ERROR_CODES)[number];
export type ProviderBusinessErrorUiAction = "login" | "refresh-quota" | "switch-model" | RequestVerificationRecoveryAction | "retry-later" | "upgrade";
export declare const PROVIDER_BUSINESS_ERROR_MESSAGE_IDS: Record<ProviderBusinessErrorCode, string>;
export declare const PROVIDER_BUSINESS_ERROR_ACTION_MESSAGE_IDS: Record<ProviderBusinessErrorUiAction, string>;
export declare function isProviderBusinessErrorCode(code: string | undefined): code is ProviderBusinessErrorCode;
export declare function getProviderBusinessErrorMessageId(code: string | undefined): string | undefined;
export declare function getProviderBusinessErrorUiAction(code: string | undefined): ProviderBusinessErrorUiAction | null;
export declare function resolveStartPlanQuotaExhaustedBusinessCode(code: string | undefined, message: string | undefined): "1005" | undefined;
export declare const START_PLAN_BUSY_AUTO_RETRY_EXHAUSTED_MESSAGE = "Start Plan is busy and automatic model stream recovery reached the maximum retry count.";
export type StartPlanConcurrentLimitBannerReason = "initial-busy" | "retry-exhausted-busy";
export declare const GLM_QUOTA_BANNER_BUSINESS_CODES: readonly ["1308", "1309", "1310", "1311", "1313", "1314", "1315", "1316", "1317", "1318", "1319", "1320", "1321"];
export type GlmQuotaBannerBusinessCode = (typeof GLM_QUOTA_BANNER_BUSINESS_CODES)[number];
/**
 * 判断是否为并发上限业务错误（3008/3009/3010）。
 * Start Plan 下命中时走并发限制升级横幅，而非普通错误横幅。
 */
export declare function resolveStartPlanConcurrentLimitBusinessCode(code: string | undefined, message: string | undefined): "3008" | "3009" | "3010" | undefined;
/** 判断业务码是否为并发上限类型。 */
export declare function isConcurrentLimitBusinessCode(code: string | undefined): boolean;
export declare function resolveGlmQuotaBannerBusinessCode(code: string | undefined): GlmQuotaBannerBusinessCode | undefined;
export declare function resolveStartPlanConcurrentLimitBannerReason(message: string | undefined): StartPlanConcurrentLimitBannerReason;
/** 上游 500 类错误：重试前建议刷新配额快照，避免 UI 本地误扣额度。 */
export declare function shouldRefreshQuotaOnProviderBusinessRetry(code: string | undefined): boolean;
/**
 * 闲时票据不可用（上游 3102：票据失效或过期）。
 * 适配层会把该业务码包成 `off-peak-ticket-expired: <上游原文>` 落到 turn 错误里，
 * 外层 code 被压成 PROVIDER_BUSINESS_ERROR 等包装码时靠稳定标记兜底，
 * 否则横幅会把 "off peak ticket is invaliad or expired" 原文直接怼给用户。
 */
export declare function resolveOffPeakTicketExpiredBusinessCode(code: string | undefined, message: string | undefined): "3102" | undefined;
export declare function isSuspiciousEmptyModelResultMessage(message: string | undefined): boolean;
//# sourceMappingURL=providerBusinessError.d.ts.map