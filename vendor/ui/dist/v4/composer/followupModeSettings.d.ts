import type { AppSettings } from "@zcode/shared";
import type { InputRouting, SessionConfigState } from "@zcode/shared/zcode-protocol-v4";
export declare function resolveAppFollowupMode(settings: AppSettings | null | undefined): SessionConfigState["followupMode"] | null;
export declare function resolveOppositeFollowupDelivery(mode: SessionConfigState["followupMode"]): "startNow" | "queue";
export declare function shouldEnableModifiedEnterSubmit({ inputRoutingMode, isMobileTextInputViewport, isWebRemoteControl, }: {
    inputRoutingMode: InputRouting["mode"];
    isMobileTextInputViewport: boolean;
    isWebRemoteControl: boolean;
}): boolean;
export declare function shouldReverseFollowupDeliveryForPointer({ enabled, metaKey, ctrlKey, isApplePlatform, }: {
    enabled: boolean;
    metaKey?: boolean;
    ctrlKey?: boolean;
    isApplePlatform?: boolean;
}): boolean;
export declare function isPrimaryFollowupModifierPressed({ isApplePlatform, metaKey, ctrlKey, }: {
    isApplePlatform: boolean;
    metaKey?: boolean;
    ctrlKey?: boolean;
}): boolean;
export interface FollowupModifierTooltip {
    delivery: "startNow" | "queue";
    shortcut: string;
    titleId: "chat.followup.sendNow" | "chat.followup.addToQueue";
}
export declare function resolveFollowupModifierTooltip({ enabled, canSend, modifierPressed, followupMode, isApplePlatform, }: {
    enabled: boolean;
    canSend: boolean;
    modifierPressed: boolean;
    followupMode: SessionConfigState["followupMode"] | undefined;
    isApplePlatform: boolean;
}): FollowupModifierTooltip | null;
//# sourceMappingURL=followupModeSettings.d.ts.map