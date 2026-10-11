import type { InputId, QueryId, TraceId, ZCodeStreamEvent } from "./zcode-task-types-core.js";
export declare function zcodeTaskNetworkDebugStatusFromPayload(params: {
    taskId: string;
    traceId: TraceId;
    inputId?: InputId;
    queryId?: QueryId;
    eventId?: string;
    payload: Record<string, unknown>;
}): Extract<ZCodeStreamEvent, {
    type: "task_network_debug_status";
}> | null;
//# sourceMappingURL=zcode-network-debug-status.d.ts.map