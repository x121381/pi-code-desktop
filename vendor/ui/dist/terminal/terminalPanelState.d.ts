import type { IServiceAccessor } from "@zcode/services";
export interface TerminalSessionDescriptor {
    id: string;
    workspaceKey: string;
    services: IServiceAccessor;
    cwd?: string;
    index: number;
    shellLabel: string | null;
}
export interface TerminalWorkspaceState {
    sessionIds: string[];
    activeSessionId: string;
}
export interface TerminalPanelState {
    sessions: Record<string, TerminalSessionDescriptor>;
    workspaces: Record<string, TerminalWorkspaceState>;
}
export declare function createTerminalSession(params: {
    workspaceKey: string;
    services: IServiceAccessor;
    cwd?: string;
    index: number;
}): TerminalSessionDescriptor;
export declare function createWorkspaceTerminalState(params: {
    workspaceKey: string;
    services: IServiceAccessor;
    cwd?: string;
}): {
    session: TerminalSessionDescriptor;
    workspace: TerminalWorkspaceState;
};
export declare function getNextTerminalSessionIndex(state: TerminalPanelState, workspaceKey: string): number;
export declare function formatTerminalTabTitle(projectName: string, index: number): string;
export type TerminalSessionCloseAction = "none" | "close-panel" | "close-session";
export interface TerminalSessionExitResult {
    state: TerminalPanelState;
    action: TerminalSessionCloseAction;
}
export declare function getTerminalSessionCloseAction(state: TerminalPanelState, sessionId: string): TerminalSessionCloseAction;
export declare function closeTerminalSession(state: TerminalPanelState, sessionId: string): TerminalPanelState;
export declare function exitTerminalSession(state: TerminalPanelState, sessionId: string, activeWorkspaceKey: string): TerminalSessionExitResult;
export declare function ensureWorkspaceTerminalState(state: TerminalPanelState, params: {
    workspaceKey: string;
    services: IServiceAccessor;
    cwd?: string;
}): TerminalPanelState;
//# sourceMappingURL=terminalPanelState.d.ts.map