export declare function subscribeMobileTextInputViewport(listener: (matches: boolean) => void): () => void;
export declare function subscribeMobileCompactViewport(listener: (matches: boolean) => void): () => void;
export declare function useIsMobileTextInputViewport(): boolean;
export declare function useIsMobileCompactViewport(): boolean;
export declare function resolveChatEnterSubmits({ isMobileTextInputViewport, preferEnterNewline, }: {
    isMobileTextInputViewport: boolean;
    preferEnterNewline: boolean;
}): boolean;
export declare function resolveChatEnterShortcut({ enterSubmits, }: {
    enterSubmits: boolean;
}): "Enter" | undefined;
export declare function shouldAvoidIosInputFocusZoom({ isMobileTextInputViewport, isWebRemoteControl, }: {
    isMobileTextInputViewport: boolean;
    isWebRemoteControl: boolean;
}): boolean;
export declare function resolveMobileInputTextSizeClassName({ avoidIosInputFocusZoom, }: {
    avoidIosInputFocusZoom: boolean;
}): "text-ui-base leading-5" | "text-mobile-input-safe leading-6";
//# sourceMappingURL=mobileTextInput.d.ts.map