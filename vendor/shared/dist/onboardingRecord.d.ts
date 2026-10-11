import { z } from "zod";
/**
 * Onboarding 完成记录（三步向导：职业 / 模式 / 偏好）。
 *
 * 设计约束：
 * - 独立本地 JSON（~/.zcode/v2/onboarding-record.json），不混入 AppSettings；
 * - 以 deviceMid 为设备锚点，entries 支持多个 userId（多人登录）与 null（apikey/未登录）；
 * - uploadState 预留后续上传服务器：pending → uploaded；
 * - 跳过是显式答案：某页被跳过时该字段记 null，与"明确选择了值"区分。
 */
/** occupation 用非空字符串而非枚举：职业列表会演进，旧记录不能因枚举收窄而校验失败。 */
export declare const onboardingOccupationSchema: z.ZodNullable<z.ZodString>;
export declare const onboardingInterfaceModeSchema: z.ZodNullable<z.ZodEnum<{
    office: "office";
    coding: "coding";
}>>;
export declare const onboardingRecordEntrySchema: z.ZodObject<{
    userId: z.ZodNullable<z.ZodString>;
    occupation: z.ZodNullable<z.ZodString>;
    interfaceMode: z.ZodNullable<z.ZodEnum<{
        office: "office";
        coding: "coding";
    }>>;
    memoryEnabled: z.ZodNullable<z.ZodBoolean>;
    proactiveSuggestionsEnabled: z.ZodNullable<z.ZodBoolean>;
    completedAt: z.ZodString;
    uploadState: z.ZodLiteral<"pending">;
}, z.core.$strip>;
export declare const onboardingDecisionSchema: z.ZodObject<{
    userId: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        dismissed: "dismissed";
        existing_local_user: "existing_local_user";
    }>;
    reason: z.ZodEnum<{
        user_closed: "user_closed";
        existing_local_task: "existing_local_task";
    }>;
    decidedAt: z.ZodString;
}, z.core.$strip>;
/** v1 无需启动迁移；读取时补空 decisions，后续业务写入时自然落为 v2。 */
export declare const onboardingRecordFileSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodObject<{
    version: z.ZodLiteral<1>;
    deviceMid: z.ZodString;
    entries: z.ZodArray<z.ZodObject<{
        userId: z.ZodNullable<z.ZodString>;
        occupation: z.ZodNullable<z.ZodString>;
        interfaceMode: z.ZodNullable<z.ZodEnum<{
            office: "office";
            coding: "coding";
        }>>;
        memoryEnabled: z.ZodNullable<z.ZodBoolean>;
        proactiveSuggestionsEnabled: z.ZodNullable<z.ZodBoolean>;
        completedAt: z.ZodString;
        uploadState: z.ZodLiteral<"pending">;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    version: z.ZodLiteral<2>;
    deviceMid: z.ZodString;
    entries: z.ZodArray<z.ZodObject<{
        userId: z.ZodNullable<z.ZodString>;
        occupation: z.ZodNullable<z.ZodString>;
        interfaceMode: z.ZodNullable<z.ZodEnum<{
            office: "office";
            coding: "coding";
        }>>;
        memoryEnabled: z.ZodNullable<z.ZodBoolean>;
        proactiveSuggestionsEnabled: z.ZodNullable<z.ZodBoolean>;
        completedAt: z.ZodString;
        uploadState: z.ZodLiteral<"pending">;
    }, z.core.$strip>>;
    decisions: z.ZodArray<z.ZodObject<{
        userId: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            dismissed: "dismissed";
            existing_local_user: "existing_local_user";
        }>;
        reason: z.ZodEnum<{
            user_closed: "user_closed";
            existing_local_task: "existing_local_task";
        }>;
        decidedAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>]>, z.ZodTransform<{
    version: 2;
    deviceMid: string;
    entries: {
        userId: string | null;
        occupation: string | null;
        interfaceMode: "office" | "coding" | null;
        memoryEnabled: boolean | null;
        proactiveSuggestionsEnabled: boolean | null;
        completedAt: string;
        uploadState: "pending";
    }[];
    decisions: {
        userId: string | null;
        status: "dismissed" | "existing_local_user";
        reason: "user_closed" | "existing_local_task";
        decidedAt: string;
    }[];
}, {
    version: 1;
    deviceMid: string;
    entries: {
        userId: string | null;
        occupation: string | null;
        interfaceMode: "office" | "coding" | null;
        memoryEnabled: boolean | null;
        proactiveSuggestionsEnabled: boolean | null;
        completedAt: string;
        uploadState: "pending";
    }[];
} | {
    version: 2;
    deviceMid: string;
    entries: {
        userId: string | null;
        occupation: string | null;
        interfaceMode: "office" | "coding" | null;
        memoryEnabled: boolean | null;
        proactiveSuggestionsEnabled: boolean | null;
        completedAt: string;
        uploadState: "pending";
    }[];
    decisions: {
        userId: string | null;
        status: "dismissed" | "existing_local_user";
        reason: "user_closed" | "existing_local_task";
        decidedAt: string;
    }[];
}>>;
export type OnboardingRecordEntry = z.infer<typeof onboardingRecordEntrySchema>;
export type OnboardingDecision = z.infer<typeof onboardingDecisionSchema>;
/** appendRecord 的入参：userId 由服务端（host）补全，调用方不传。 */
export type OnboardingRecordEntryInput = Omit<OnboardingRecordEntry, "userId" | "uploadState">;
export type OnboardingRecordFile = z.infer<typeof onboardingRecordFileSchema>;
//# sourceMappingURL=onboardingRecord.d.ts.map