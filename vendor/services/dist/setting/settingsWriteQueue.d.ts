export declare function getSettingsWriteQueueTimeoutMs(): number;
export declare function buildSettingsTempFile(settingsFile: string): string;
export declare function withSettingsWriteQueueTimeout(runUpdate: (enterCommitPhase: () => void) => Promise<void>, expireCurrentWrite: () => void): Promise<void>;
//# sourceMappingURL=settingsWriteQueue.d.ts.map