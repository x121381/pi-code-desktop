export function isRendererProductionBuild() {
    const rendererLoggingDisabled = globalThis.__ZCODE_RENDERER_DISABLE_LOGGING__ === true;
    return (rendererLoggingDisabled ||
        (globalThis.__ZCODE_VITE_ENV__ ?? {}).PROD === true);
}
//# sourceMappingURL=rendererLoggingEnv.js.map