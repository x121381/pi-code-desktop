export interface SessionPluginIconProjection {
    sessionId: string;
    iconByPluginId: ReadonlyMap<string, string>;
}
export declare const PluginReferenceIconProvider: import("react").Provider<SessionPluginIconProjection | null>;
export declare function usePluginReferenceIconProjection(): SessionPluginIconProjection | null;
//# sourceMappingURL=pluginReferenceIconContext.d.ts.map