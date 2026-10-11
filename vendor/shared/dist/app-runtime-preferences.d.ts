import { z } from "zod";
export declare const APP_RUNTIME_PREFERENCES_CHANGED_BROADCAST_CHANNEL = "settings:app-runtime-preferences";
export declare const ASK_USER_QUESTION_E2E_CLOCK_SCALE_ENV = "ZCODE_E2E_ASK_USER_QUESTION_CLOCK_SCALE";
export declare const appRuntimePreferencesChangedBroadcastPayloadSchema: z.ZodObject<{
    askUserQuestionAutoResolutionEnabled: z.ZodBoolean;
    modelIoFullRetentionEnabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>;
export type AppRuntimePreferencesChangedBroadcastPayload = z.infer<typeof appRuntimePreferencesChangedBroadcastPayloadSchema>;
//# sourceMappingURL=app-runtime-preferences.d.ts.map