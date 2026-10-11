/**
 * Coding Plan 额度相关的纯类型定义。
 *
 * 从 usage-stats.ts 拆出：MCP 额度接入后该文件超过 oxlint max-lines(400) 门禁，
 * 而额度是可以独立描述的一组类型（不依赖统计聚合结构），拆出后两边都在门禁内。
 * 这里只依赖自身，usage-stats.ts 单向导入并 re-export，不构成循环依赖。
 */
/**
 * `aggregate.type` 的合成值。
 *
 * 不复用 TOKENS_LIMIT / TIME_LIMIT：`isSameLimitCategory` 会把 TIME_LIMIT 判为工具额度同类，
 * 让 MCP 汇总额度被现有的 findCodingPlanQuotaLimit 查询误命中。
 */
export const MCP_USAGE_QUOTA_LIMIT_TYPE = "MCP_USAGE_LIMIT";
//# sourceMappingURL=usage-quota.js.map