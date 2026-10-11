import type { Readable } from "node:stream";
export declare const EXIT_STDERR_DRAIN_MS = 250;
/** stderr 的寿命独立于协议；child exit 时管道中仍可能有最后一行诊断。 */
export declare class AgentStderrCollector {
    private readonly reader;
    private readonly drained;
    private resolveDrained;
    private done;
    private deadlineAt;
    private timer?;
    constructor(input: Readable, onLine?: (line: string) => void);
    waitForDrain(timeoutMs?: number): Promise<void>;
    private readonly finish;
}
//# sourceMappingURL=agentStderrCollector.d.ts.map