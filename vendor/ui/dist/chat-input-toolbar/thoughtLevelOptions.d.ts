import type { ZCodeConfigOption, ZCodeProvider } from "@zcode/shared";
import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
export type ThoughtLevelEntry = NonNullable<ZCodeConfigOption["options"]>[number];
/**
 * 档位值 → 词条 id；表里没有的值返回 undefined（调用方原样显示 provider 自己的档位名）。
 * 工具条之外也有人要说这个词（工作流的子代理模型），两处必须查同一张表。
 */
export declare function thoughtLevelLabelId(value: string): string | undefined;
export declare function isNoThoughtLevel(entry: ThoughtLevelEntry): boolean;
export declare function getNextThoughtLevelValue(option: Pick<ZCodeConfigOption, "type" | "currentValue" | "options">): string | null;
export declare function getThoughtLevelLabel(intl: ReturnType<typeof useZCodeIntl>["intl"], provider: ZCodeProvider | undefined, option: ZCodeConfigOption, entry: ThoughtLevelEntry): string;
//# sourceMappingURL=thoughtLevelOptions.d.ts.map