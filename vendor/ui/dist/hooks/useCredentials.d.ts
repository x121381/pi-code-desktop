/** 凭据管理的基础 hook */
export declare function useCredentials(): {
    load: (key: string) => Promise<string | null>;
    save: (key: string, value: string) => Promise<void>;
    delete: (key: string) => Promise<void>;
};
/** active provider access_token 专用便捷 hook */
export declare function useAuthToken(): {
    getToken: () => Promise<string | null>;
    setToken: (token: string) => Promise<void>;
    clearToken: () => Promise<void>;
};
//# sourceMappingURL=useCredentials.d.ts.map