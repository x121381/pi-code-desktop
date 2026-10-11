import type { OAuthCachedSessionRestoreResult, UserInfo } from "@zcode/shared";
import type { AlertDialogRequest } from "@/store/alertDialogStore.js";
export declare function applyCachedOAuthSessionRestoreResult(params: {
    result: OAuthCachedSessionRestoreResult;
    setUser: (user: UserInfo | null) => void;
    requestAlert: (request: AlertDialogRequest) => Promise<boolean>;
    onReauthenticationRequired: () => void;
    copy: AlertDialogRequest;
}): Promise<boolean>;
//# sourceMappingURL=oauthCachedSessionRestore.d.ts.map