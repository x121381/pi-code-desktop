export function resolveV4ComposerConfigPickerState(current, picker, open) {
    if (open) {
        return picker;
    }
    return current === picker ? null : current;
}
//# sourceMappingURL=configPickerState.js.map