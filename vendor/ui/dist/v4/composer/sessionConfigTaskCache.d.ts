import type { ZCodeConfigOption } from "@zcode/shared";
import type { SessionConfigState } from "@zcode/shared/zcode-protocol-v4";
/**
 * 把 v4 session 权威配置叠到 workspace 完整目录，供 task → draft 继承使用。
 * 目录项和候选列表保持原引用语义，仅替换 model/mode/thought 的 currentValue。
 */
export declare function projectSessionConfigToTaskConfigOptions(options: readonly ZCodeConfigOption[], config: Pick<SessionConfigState, "provider" | "model" | "mode" | "thought">): ZCodeConfigOption[];
//# sourceMappingURL=sessionConfigTaskCache.d.ts.map