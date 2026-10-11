export function resolveComposerAutoFocus({ autoFocusEnabled, disabled, isMobileViewport, }) {
    if (!autoFocusEnabled || isMobileViewport)
        return "skip";
    if (disabled)
        return "defer";
    return "focus-now";
}
//# sourceMappingURL=composerAutoFocus.js.map