/**
 * ChatEmptyState — 对话为空时的空态展示组件
 *
 * 从 ChatView.tsx 拆出的 workspace 路径工具函数和空态下拉菜单组件。
 */
import type { ReactNode } from "react";
import { type RemoteTarget, type RemoteWorkspaceSessionEntry, type WorkspacePurpose } from "@zcode/shared";
export { getScratchWorkspaceLocationHint, getScratchWorkspaceNameErrorKind, } from "@/ChatEmptyScratchWorkspaceDialog.js";
export declare function getWorkspaceTriggerTitle(path: string, homeLabel: string): string;
export interface ChatEmptyWorkspaceMenuTab {
    workspacePath: string;
    label: string;
    remoteSessionId?: string;
    remoteTarget?: RemoteTarget;
    workspaceIdentity?: string;
    workspacePurpose?: WorkspacePurpose;
}
export declare function isWorkspaceMenuTabSelected(workspaceTab: ChatEmptyWorkspaceMenuTab, current: {
    workspacePath: string;
    workspaceIdentity?: string;
}): boolean;
export declare function filterVisibleWorkspaceMenuTabs({ workspaceTabs, homeWorkspaceLabel, searchQuery, }: {
    workspaceTabs: ReadonlyArray<ChatEmptyWorkspaceMenuTab>;
    homeWorkspaceLabel: string;
    searchQuery: string;
}): ChatEmptyWorkspaceMenuTab[];
export declare function ChatEmptyWorkspacePreviewMenu({ workspacePath, workspaceIdentity, isWindowsDesktop, compactForRemoteControl, workspaceTabs, allowConversationWorkspaceSelection, allowConversationWorkspaceDetach, onSelectWorkspace, onSelectConversationWorkspace, onOpenFolder, allowOpenWorkspace, allowRemoteWorkspace, remoteWorkspaceSessions, onConnectRemote, onSelectRemoteProject, onCancelRemoteProject, containerClassName, triggerClassName, triggerIndicator, }: {
    workspacePath: string;
    workspaceIdentity?: string;
    isWindowsDesktop?: boolean;
    compactForRemoteControl?: boolean;
    workspaceTabs: ReadonlyArray<ChatEmptyWorkspaceMenuTab>;
    allowConversationWorkspaceSelection?: boolean;
    /** 是否显示项目 chip 的快捷脱离按钮；默认跟随非项目工作区选择能力。 */
    allowConversationWorkspaceDetach?: boolean;
    onSelectWorkspace: (workspaceTab: ChatEmptyWorkspaceMenuTab) => void;
    onSelectConversationWorkspace: () => void | Promise<void>;
    onOpenFolder: () => void;
    allowOpenWorkspace?: boolean;
    allowRemoteWorkspace?: boolean;
    remoteWorkspaceSessions?: RemoteWorkspaceSessionEntry[];
    onConnectRemote: (options: RemoteTarget, requestId?: string) => Promise<string>;
    onSelectRemoteProject: (sessionId: string, path: string, localWorkspacePath?: string) => Promise<void>;
    onCancelRemoteProject: (sessionId: string) => Promise<void>;
    /** 调用方局部调整 workspace chip 外层视觉，不改变普通会话默认样式。 */
    containerClassName?: string;
    /** 调用方局部调整 workspace trigger 视觉，不改变普通会话默认样式。 */
    triggerClassName?: string;
    /** 调用方局部替换尾部 indicator；普通会话继续使用默认 Lucide chevron。 */
    triggerIndicator?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatEmptyState.d.ts.map