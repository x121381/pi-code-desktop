/**
 * 规范化 Built-in/Personal 共同拥有的可排序成员。
 *
 * 未排序 Built-in 必须留在用户顺序之前，未排序 Personal 必须留在之后；否则远端新增
 * Built-in 成员后，下一次 Personal 写入会把它错误地挪到整个列表末尾。
 */
export declare function resolveOwnedOrder<T extends string>(builtinIds: readonly T[], personalIds: readonly T[], requestedOrder: readonly T[]): readonly T[];
//# sourceMappingURL=owned-order.d.ts.map