export function isRendererProductionBuild() {
    const rendererLoggingDisabled = globalThis.__ZCODE_RENDERER_DISABLE_LOGGING__ === true;
    return (rendererLoggingDisabled ||
        (import.meta.env ?? {}).PROD === true);
}
//# sourceMappingURL=rendererLoggingEnv.js.map