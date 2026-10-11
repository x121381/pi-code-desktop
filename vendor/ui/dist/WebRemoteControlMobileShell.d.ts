import { type ReactNode } from "react";
import { type WebRemoteControlMobileNavigationIntent, type WebRemoteControlWorkspaceListResult } from "@zcode/shared";
import type { WebRemoteControlTerminalTransportState } from "@/root/types.js";
import type { WebRemoteControlWorkspaceSwitcherApi } from "@/root/types.js";
type WebRemoteControlMobilePage = "home" | "chat";
interface WebRemoteControlMobileHistoryState {
    zcodeMobilePage?: WebRemoteControlMobilePage;
}
export declare function isWebRemoteControlMobileChatHistoryState(state: unknown): state is WebRemoteControlMobileHistoryState;
export declare function WebRemoteControlMobileShell({ activeTaskId, activeWorkspaceIdentity, activeWorkspacePath, chatContent, chatOverlay, initialNavigationIntent, initialWorkspaceList, isSidePaneOpen, onCloseSidePane, onSelectTask, onStartDraftInWorkspace, renderChatHeader, sidePaneContent, switcher, webRemoteControlTerminalTransportState, }: {
    switcher: WebRemoteControlWorkspaceSwitcherApi;
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    activeTaskId: string | null;
    initialNavigationIntent?: WebRemoteControlMobileNavigationIntent;
    initialWorkspaceList?: WebRemoteControlWorkspaceListResult;
    isSidePaneOpen?: boolean;
    onCloseSidePane?: () => void;
    onSelectTask: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentity?: string) => void;
    onStartDraftInWorkspace?: (targetWorkspacePath: string, targetWorkspaceIdentity?: string) => void;
    renderChatHeader: (options: {
        onBackHome: () => void;
    }) => ReactNode;
    chatContent: ReactNode;
    chatOverlay?: ReactNode;
    sidePaneContent?: ReactNode;
    webRemoteControlTerminalTransportState?: WebRemoteControlTerminalTransportState;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WebRemoteControlMobileShell.d.ts.map