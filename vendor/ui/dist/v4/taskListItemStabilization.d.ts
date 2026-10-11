import type { ZCodeTaskMeta } from "@zcode/shared";
export declare function buildTaskListItemIdentityKey(meta: ZCodeTaskMeta): string;
/**
 * 结构等价：忽略 key 插入顺序，把 `undefined` 值视同缺省（与 JSON 序列化口径一致）。
 *
 * 这里刻意不用 `JSON.stringify` 比较：上游 Controller / tasks-index join 大量使用条件展开
 * （`...(x ? { k: v } : {})`）构造对象，同内容不同 key 顺序在字符串上恒不相等，稳定化会
 * 静默退化成「每帧全新引用」——「整列表闪一下」无声回归，而且不报错、无日志、无指标。
 * 逐字段比较让等价判断不依赖构造顺序这一隐式假设，顺带在首个差异处短路。
 */
export declare function areStabilizedValuesEquivalent(left: unknown, right: unknown): boolean;
/** 逐字段等价（嵌套字段结构比较；task meta 是小对象，代价可忽略）。 */
export declare function areTaskListItemsEquivalent(left: ZCodeTaskMeta, right: ZCodeTaskMeta): boolean;
/** 引用稳定化：等价条目复用旧对象；顺序与内容全等时复用整个旧数组。 */
export declare function stabilizeTaskListItems<T extends ZCodeTaskMeta>(previous: T[], next: T[]): T[];
//# sourceMappingURL=taskListItemStabilization.d.ts.map