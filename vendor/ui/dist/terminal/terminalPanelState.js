import { createUuid } from "@zcode/shared";
export function createTerminalSession(params) {
    return {
        id: createUuid(),
        workspaceKey: params.workspaceKey,
        services: params.services,
        cwd: params.cwd,
        index: params.index,
        shellLabel: null,
    };
}
export function createWorkspaceTerminalState(params) {
    const session = createTerminalSession({
        workspaceKey: params.workspaceKey,
        services: params.services,
        cwd: params.cwd,
        index: 1,
    });
    return {
        session,
        workspace: {
            sessionIds: [session.id],
            activeSessionId: session.id,
        },
    };
}
export function getNextTerminalSessionIndex(state, workspaceKey) {
    const workspace = state.workspaces[workspaceKey];
    const usedIndices = new Set(workspace?.sessionIds
        .map((sessionId) => state.sessions[sessionId]?.index)
        .filter((index) => typeof index === "number") ?? []);
    // 把 nextIndex 作为只增不减的派生状态保存，会让关闭编号 2 后再新建错误地得到 3。
    // 编号事实已经存在于 session descriptor 中，创建时从现存 session 推导最小空位，避免两份状态漂移。
    for (let index = 1;; index += 1) {
        if (!usedIndices.has(index)) {
            return index;
        }
    }
}
export function formatTerminalTabTitle(projectName, index) {
    return index === 1 ? projectName : `${projectName} ${index}`;
}
export function getTerminalSessionCloseAction(state, sessionId) {
    const session = state.sessions[sessionId];
    const workspace = session ? state.workspaces[session.workspaceKey] : undefined;
    if (!session || !workspace?.sessionIds.includes(sessionId)) {
        return "none";
    }
    return workspace.sessionIds.length === 1 ? "close-panel" : "close-session";
}
export function closeTerminalSession(state, sessionId) {
    if (getTerminalSessionCloseAction(state, sessionId) !== "close-session") {
        return state;
    }
    const session = state.sessions[sessionId];
    const workspace = session ? state.workspaces[session.workspaceKey] : undefined;
    if (!session || !workspace) {
        return state;
    }
    const closingIndex = workspace.sessionIds.indexOf(sessionId);
    const nextSessionIds = workspace.sessionIds.filter((id) => id !== sessionId);
    const fallbackSessionId = nextSessionIds[Math.max(0, closingIndex - 1)] ?? nextSessionIds[0];
    if (!fallbackSessionId) {
        return state;
    }
    const { [sessionId]: _closedSession, ...nextSessions } = state.sessions;
    return {
        sessions: nextSessions,
        workspaces: {
            ...state.workspaces,
            [session.workspaceKey]: {
                sessionIds: nextSessionIds,
                activeSessionId: workspace.activeSessionId === sessionId ? fallbackSessionId : workspace.activeSessionId,
            },
        },
    };
}
export function exitTerminalSession(state, sessionId, activeWorkspaceKey) {
    const session = state.sessions[sessionId];
    const workspace = session ? state.workspaces[session.workspaceKey] : undefined;
    if (!session || !workspace?.sessionIds.includes(sessionId)) {
        return { state, action: "none" };
    }
    if (workspace.sessionIds.length > 1) {
        return {
            state: closeTerminalSession(state, sessionId),
            action: "close-session",
        };
    }
    // PTY 自身已经退出时，最后一个 tab 不能像手动关闭那样只收起面板并保活。
    // 这里同时删除 session/workspace 记录；重新打开该 workspace 时再由 ensure 懒创建新 PTY。
    const { [sessionId]: _exitedSession, ...nextSessions } = state.sessions;
    const { [session.workspaceKey]: _exitedWorkspace, ...nextWorkspaces } = state.workspaces;
    return {
        state: {
            sessions: nextSessions,
            workspaces: nextWorkspaces,
        },
        action: session.workspaceKey === activeWorkspaceKey ? "close-panel" : "close-session",
    };
}
export function ensureWorkspaceTerminalState(state, params) {
    const existingWorkspace = state.workspaces[params.workspaceKey];
    if (existingWorkspace?.sessionIds.some((sessionId) => state.sessions[sessionId])) {
        return state;
    }
    const { session, workspace } = createWorkspaceTerminalState(params);
    return {
        sessions: {
            ...state.sessions,
            [session.id]: session,
        },
        workspaces: {
            ...state.workspaces,
            [params.workspaceKey]: workspace,
        },
    };
}
//# sourceMappingURL=terminalPanelState.js.map