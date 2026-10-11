import type { UserInfo } from "@zcode/shared";
interface WebLoggedInWaitingPageProps {
    user: UserInfo;
    onLogout?: () => Promise<void> | void;
}
export declare function WebLoggedInWaitingPage({ onLogout, user }: WebLoggedInWaitingPageProps): import("react/jsx-runtime").JSX.Element;
export {};
