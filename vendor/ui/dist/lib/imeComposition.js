export function isImeComposingKeyEvent(event) {
    return Boolean(event.compositionActive || event.isComposing || event.nativeEvent?.isComposing);
}
//# sourceMappingURL=imeComposition.js.map