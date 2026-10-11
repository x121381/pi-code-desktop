import type { CloudDialogHero as CloudDialogHeroDefinition, CloudHeroResourceMessage } from "@/components/cloud-content-dialog/cloudContentDialogTypes.js";
export declare const CLOUD_HERO_MESSAGE_CHANNEL: "zcode-cloud-hero-v1";
type CloudHeroMessageEvent = Pick<MessageEvent, "data" | "source">;
export declare function isTrustedCloudHeroMessage(event: CloudHeroMessageEvent, frameWindow: Window | null, instanceId: string): event is CloudHeroMessageEvent & {
    data: CloudHeroResourceMessage;
};
export declare function CloudInteractiveBundleHero({ hero, locale, title, onAction, presentation, hovered, onReadyChange, }: {
    hero: Extract<CloudDialogHeroDefinition, {
        type: "interactive_bundle";
    }>;
    locale: string;
    title: string;
    onAction?: (actionId: string) => void;
    presentation?: boolean;
    hovered?: boolean;
    onReadyChange?: (ready: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function CloudDialogHero({ hero, locale, title, onAction, }: {
    hero: CloudDialogHeroDefinition;
    locale: string;
    title: string;
    onAction?: (actionId: string) => void;
}): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=CloudDialogHero.d.ts.map