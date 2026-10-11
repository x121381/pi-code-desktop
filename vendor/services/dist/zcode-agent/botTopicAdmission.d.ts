/** Host 在途发送屏障；accepted input 和 commandId 幂等仍由 CLI 管理。 */
export declare function createBotTopicAdmission(): {
    capture: (key: string) => number;
    invalidate(key: string): Promise<void>;
    run<T>(key: string, version: number, send: () => Promise<T>): Promise<T>;
};
//# sourceMappingURL=botTopicAdmission.d.ts.map