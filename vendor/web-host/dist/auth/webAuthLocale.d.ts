type WebAuthLocale = "zh-CN" | "en-US";
interface WebAuthPageCopy {
    brand: string;
    loginTitle: string;
    loginDescription: string;
    loginAction: string;
    callbackTitle: string;
    callbackDescription: string;
    callbackErrorTitle: string;
    callbackErrorDescription: string;
    retryAction: string;
    waitingTitle: string;
    waitingDescription: string;
    signedInAs: string;
    logoutAction: string;
}
export declare function getWebAuthCopy(locale?: WebAuthLocale): WebAuthPageCopy;
export {};
