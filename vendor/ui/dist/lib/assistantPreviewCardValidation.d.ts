import { type AssistantPreviewCard, type AssistantPreviewCardFileStatService } from "@/lib/assistantPreviewCards.js";
export declare function getAssistantPreviewCardsValidationSignature(cards: readonly AssistantPreviewCard[]): string;
export declare function resolveAssistantPreviewCardsWithoutFileStat(cards: readonly AssistantPreviewCard[]): AssistantPreviewCard[] | null;
export declare function resolveValidatedAssistantPreviewCards(cards: readonly AssistantPreviewCard[], fileService: AssistantPreviewCardFileStatService): Promise<AssistantPreviewCard[]>;
//# sourceMappingURL=assistantPreviewCardValidation.d.ts.map