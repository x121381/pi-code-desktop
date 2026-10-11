import type { Locale } from "@zcode/shared";
import type { IntlInstance } from "@/i18n/IntlProvider.js";
/** Desktop 与 Share 共用的工作时长文案，避免同一轮在两个 surface 显示不同单位。 */
export declare function formatConversationWorkDuration(durationMs: number | undefined, intl: IntlInstance, locale: Locale): string | null;
//# sourceMappingURL=conversationWorkDuration.d.ts.map