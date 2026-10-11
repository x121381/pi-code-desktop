import type { ZCodeAgentServiceEvent } from "#src/zcode-agent/zcodeAgent.js";
export interface BackgroundSessionEventCoalescer {
    accept(event: ZCodeAgentServiceEvent): void;
    flush(): void;
    dispose(): void;
}
export declare function createBackgroundSessionEventCoalescer(params: {
    emit: (event: ZCodeAgentServiceEvent) => void;
    flushDelayMs?: number;
    maxItems?: number;
}): BackgroundSessionEventCoalescer;
//# sourceMappingURL=zcodeSessionEventCoalescer.d.ts.map