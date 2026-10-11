import type { ZCodeProtocolClient } from "./zcodeProtocolClient.js";
/** Host 更新不代表远端 CLI 已更新；旧 CLI 会剥掉 Plan 字段，必须在发送前确认执行端。 */
export declare function ensureIndependentPlanSupport(client: Pick<ZCodeProtocolClient, "request">): Promise<void>;
//# sourceMappingURL=independentPlanSupport.d.ts.map