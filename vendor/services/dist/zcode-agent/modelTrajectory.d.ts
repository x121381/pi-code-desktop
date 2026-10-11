import type { ZCodeModelTrajectory } from "#src/session/zcodeTaskService.js";
/**
 * 解析 ~/.zcode/cli/{debug,rollout} 下的 model-io JSONL，按 sessionId 还原某个 task 的模型调用轨迹。
 *
 * 设计说明：
 * - model-io 由 adapters/model/runner-debug.ts 落盘；一个 session 一个
 *   `model-io-<sanitizedSessionId>.jsonl`。
 * - ZCode Agent 把 taskId 当作 sessionId（见 zcodeTaskServiceAdapter），所以这里只读取
 *   该 session 的单文件，并按 `record.sessionId === taskId` 精确匹配。
 */
export declare function readModelTrajectory(taskId: string, limit?: number): Promise<ZCodeModelTrajectory>;
//# sourceMappingURL=modelTrajectory.d.ts.map