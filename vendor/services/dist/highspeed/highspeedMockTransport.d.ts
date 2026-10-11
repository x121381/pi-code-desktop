import type { HighspeedMockScenario } from "@zcode/shared";
import type { HighspeedServiceTransport } from "./highspeedCardService.js";
export declare function createHighspeedMockTransport(options?: {
    scenario?: HighspeedMockScenario;
    now?: () => number;
    delay?: (milliseconds: number) => Promise<void>;
}): HighspeedServiceTransport;
//# sourceMappingURL=highspeedMockTransport.d.ts.map