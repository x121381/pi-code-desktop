import type { HighspeedCardUsage, HighspeedPrepareTurnParams, HighspeedPrepareTurnResult, HighspeedServiceSnapshot } from "@zcode/shared";
export interface IHighspeedCardService {
    prepareTurn(params: HighspeedPrepareTurnParams): Promise<HighspeedPrepareTurnResult>;
    getSnapshot(): Promise<HighspeedServiceSnapshot>;
    healthy(cardId: string): Promise<HighspeedCardUsage>;
}
export declare const IHighspeedCardService: import("../descriptors.js").ServiceDescriptor<IHighspeedCardService>;
//# sourceMappingURL=highspeedCard.d.ts.map