import { type OAuthProviderMeta } from "@zcode/shared";
interface WelcomeScreenProps {
    onComplete: (reason: LoginCompleteReason) => void | Promise<void>;
}
export type LoginCompleteReason = "oauth" | "apiKey" | "skip";
export declare function WelcomeScreen({ onComplete }: WelcomeScreenProps): import("react/jsx-runtime").JSX.Element;
interface LoginPanelProps {
    active: boolean;
    onComplete: (reason: LoginCompleteReason) => void | Promise<void>;
}
interface ActiveLoginEntryAttempt {
    id: number;
    providerId: OAuthProviderMeta["id"];
}
export declare function shouldCompleteProviderLoginAttempt(params: {
    attempt: ActiveLoginEntryAttempt | null;
    successProvider: OAuthProviderMeta["id"] | null;
}): boolean;
export declare function shouldCompleteLoginFromExistingUser(params: {
    hasUser: boolean;
    attempt: ActiveLoginEntryAttempt | null;
}): boolean;
export declare function LoginPanel({ active, onComplete }: LoginPanelProps): import("react/jsx-runtime").JSX.Element;
export declare function resolveVisibleLoginProviders(providers: OAuthProviderMeta[]): OAuthProviderMeta[];
export declare function resolveLoginRetryProvider({ pendingProvider, lastAttemptProvider, providers, }: {
    pendingProvider: OAuthProviderMeta["id"] | null;
    lastAttemptProvider: OAuthProviderMeta["id"] | null;
    providers: OAuthProviderMeta[];
}): OAuthProviderMeta["id"] | null;
export {};
//# sourceMappingURL=WelcomeScreen.d.ts.map