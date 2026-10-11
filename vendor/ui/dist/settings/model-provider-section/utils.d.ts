import type { ReactNode } from "react";
import { type BuiltinModelProviderId, type OAuthProviderId } from "@zcode/shared";
import { type ModelProviderNavItem } from "./constants.js";
export declare function createPresetProviderNodeKey(id: BuiltinModelProviderId): string;
export declare function createCodingPlanProviderNodeKey(id: BuiltinModelProviderId): string;
export declare function createCustomProviderNodeKey(id: string): string;
export declare function resolveOAuthProviderIdByPreset(presetId: BuiltinModelProviderId): OAuthProviderId | null;
export declare function resolveModelProviderNavLogo(item: ModelProviderNavItem): {
    type: "builtin";
    key: string;
} | null | undefined;
export declare function renderModelProviderNavIcon(item: ModelProviderNavItem): ReactNode;
export declare function fuzzyMatch(text: string, query: string): boolean;
export declare function handleEndpointSuggestionPopoverOpenAutoFocus({ keepInputFocus, preventDefault, focusInput, }: {
    keepInputFocus: boolean;
    preventDefault: () => void;
    focusInput: () => void;
}): boolean;
export declare function resolveEndpointSuggestionOpenRequest({ nowMs, suppressOpenUntilMs, }: {
    nowMs: number;
    suppressOpenUntilMs: number;
}): {
    shouldOpen: boolean;
};
//# sourceMappingURL=utils.d.ts.map