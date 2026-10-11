type WriteOperation = {
    kind: "set";
    permission: string;
    state: "allow" | "deny" | "ask";
} | {
    kind: "reset";
};
type WriteState = {
    status: "idle";
} | {
    status: "pending" | "failed" | "succeeded";
    operation: WriteOperation;
};
/** main 站点权限 store 是唯一授权状态源；hook 只持有读取投影和用户操作的进度。 */
export declare function useBrowserSitePermissions(origin: string, enabled: boolean): {
    states: Record<string, "allow" | "deny"> | null;
    error: boolean;
    refresh: () => Promise<void>;
    supported: boolean;
    write: WriteState;
    setPermission: (permission: string, setting: "ask" | "allow" | "block") => Promise<void>;
    reset: () => Promise<void>;
    retryWrite: () => Promise<void>;
};
export {};
//# sourceMappingURL=useBrowserSitePermissions.d.ts.map