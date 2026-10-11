import type { DatabaseSync } from "node:sqlite";
/**
 * 冻结 0002 的一次转换：运行 Reader 只看新列，旧三列原样保留。
 * 有旧来源允许重建未发布目标值；无法确定身份留 SQL NULL，默认语义写 JSON null。
 * 必须在库级 migration 事务内调用，不得恢复逐次读取导入。
 */
export declare function importLegacyAutomationSelections(db: DatabaseSync): void;
//# sourceMappingURL=provider-selection-v2.d.ts.map