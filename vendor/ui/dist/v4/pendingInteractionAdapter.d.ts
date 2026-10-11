import type { ZCodePermissionRequest, ZCodeElicitationRequest } from "@zcode/shared";
import type { PendingInteraction, PermissionRequestPayload, UserInputRequestPayload } from "@zcode/shared/zcode-protocol-v4";
/** v4 permission payload → 旧 PermissionDialog 可消费的 ZCodePermissionRequest。 */
export declare function pendingPermissionToLegacyRequest(sessionId: string, interaction: PendingInteraction & {
    payload: PermissionRequestPayload;
}): ZCodePermissionRequest;
export interface V4UserInputViewModel {
    interactionId: string;
    prompt: string;
    freeText: boolean;
    sensitive?: boolean;
    options: ReadonlyArray<{
        optionId: string;
        label: string;
    }>;
}
export declare function pendingUserInputToViewModel(interaction: PendingInteraction & {
    payload: UserInputRequestPayload;
}): V4UserInputViewModel;
export declare function pendingUserInputToElicitationRequest(sessionId: string, interaction: PendingInteraction & {
    payload: UserInputRequestPayload;
}): ZCodeElicitationRequest | null;
//# sourceMappingURL=pendingInteractionAdapter.d.ts.map