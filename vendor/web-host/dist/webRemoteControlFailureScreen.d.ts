import type { WebRemoteControlFailure } from "@zcode/shared";
type WebRemoteControlScreenLocale = "zh-CN" | "en-US";
interface WebRemoteControlScreenCopy {
    tone: "danger" | "warning" | "neutral";
    badge: string;
    title: string;
    description: string;
    detailLabel: string;
    nextStepsTitle: string;
    nextSteps: string[];
    action: string;
}
export declare function resolveWebRemoteControlScreenLocale(language: string): WebRemoteControlScreenLocale;
export declare function resolveWebRemoteControlScreenCopy(failure: WebRemoteControlFailure, locale: WebRemoteControlScreenLocale): WebRemoteControlScreenCopy;
interface WebRemoteControlFailureScreenProps {
    failure: WebRemoteControlFailure;
    locale: WebRemoteControlScreenLocale;
    onReload(): void;
}
export declare function WebRemoteControlFailureScreen({ failure, locale, onReload, }: WebRemoteControlFailureScreenProps): import("react/jsx-runtime").JSX.Element;
export {};
