import type { BuiltinModelProviderId, IPlatformService } from "@zcode/shared";
import type { IOAuthService } from "@zcode/services";
export declare function startPresetSubscriptionLogin(params: {
    presetId: BuiltinModelProviderId;
    oauthService: IOAuthService;
    platform: IPlatformService;
    clearPending: () => void;
}): Promise<void>;
export declare function reportPresetSubscriptionSuccess(params: {
    platform: IPlatformService;
    presetId: BuiltinModelProviderId;
}): Promise<void>;
//# sourceMappingURL=oauthActions.d.ts.map