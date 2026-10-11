import type { ZCodeStreamEvent } from "@zcode/shared";
interface ContinuousStreamCoalescer {
    accept(event: ZCodeStreamEvent): void;
    flush(): void;
    dispose(): void;
}
export declare function createContinuousStreamCoalescer(params: {
    emit: (event: ZCodeStreamEvent) => void;
    flushDelayMs?: number;
    maxChars?: number;
    maxEvents?: number;
}): ContinuousStreamCoalescer;
export {};
//# sourceMappingURL=continuousStreamCoalescer.d.ts.map