import { type BrowserBackendDescriptor, type BrowserClientMode, type BrowserCommand, type ZCodeBrowserAmbientContext } from "@zcode/shared";
export interface BrowserAmbientContextExecutor {
    list(input: {
        requestId: string;
        sessionId: string;
        turnId?: string;
        workspaceKey: string;
        workspacePath: string;
        workspaceIdentity?: string;
        remoteSessionId?: string;
        clientMode: BrowserClientMode;
        sessionContext: "live" | "cached";
    }): Promise<BrowserBackendDescriptor[]>;
    execute(input: {
        requestId: string;
        browserId?: string;
        browserGeneration?: number;
        sessionId: string;
        turnId?: string;
        workspaceKey: string;
        workspacePath: string;
        workspaceIdentity?: string;
        remoteSessionId?: string;
        clientMode: BrowserClientMode;
        sessionContext: "live" | "cached";
        command: BrowserCommand;
    }): Promise<{
        ok: boolean;
        [key: string]: unknown;
    }>;
}
interface BrowserAmbientContextTarget {
    sessionId: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    clientMode?: BrowserClientMode;
}
/**
 * 只读收集 provider ambient state。失败时返回 undefined，不能让浏览器 UI 状态阻断真实 prompt。
 */
export declare function collectBrowserAmbientContext(executor: BrowserAmbientContextExecutor | undefined, target: BrowserAmbientContextTarget): Promise<ZCodeBrowserAmbientContext | undefined>;
export {};
//# sourceMappingURL=zcodeAgentBrowserAmbientContext.d.ts.map