import { type ReactNode } from "react";
import type { ZCodeTaskChangeSummary } from "@zcode/shared";
import { type QuickPickCommand } from "@/quickpick/quickPickCommands.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { WorkspaceTabState } from "@/store/tabStore.js";
import type { ChatSearchResultHighlightRequest } from "@/v4/legacyChatViewTypes.js";
import { type CommandCenterSearchHistoryEntry } from "@/command-center/commandCenterSearchHistory.js";
export declare function CommandCenterScopeButton({ active, label, onClick, children, }: {
    active: boolean;
    label: string;
    onClick: () => void;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 对话搜索结果的时间戳。
 * 独立组件便于复用与单测；按 DESIGN.md 语义角色，列表项里的相对时间属于
 * secondary copy，使用 text-ui-sm（不用 text-ui-xs，避免偏小）。
 */
export declare function CommandCenterConversationTimestamp({ className, children, }: {
    className?: string;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 命令中心搜索历史区：分区标题 + 历史 chip + 清除/展开按钮。
 * 从 CommandCenterDialog 内联 JSX 抽取，便于复用与单测。
 *
 * 字号语义（DESIGN.md）：
 * - 分区标题：text-ui-sm（section label / helper text）
 * - 历史 chip 搜索词：text-ui-base（可读内容，与列表主体一致）
 * - chip 内 scope 前缀：text-ui-xs（badge 标记，比主体小一级形成层级）
 */
export declare function CommandCenterSearchHistory({ entries, expanded, onToggleExpanded, onPickEntry, onClear, historyLabel, clearLabel, expandLabel, collapseLabel, }: {
    entries: CommandCenterSearchHistoryEntry[];
    expanded: boolean;
    onToggleExpanded: () => void;
    onPickEntry: (entry: CommandCenterSearchHistoryEntry) => void;
    onClear: () => void;
    historyLabel: string;
    clearLabel: string;
    expandLabel: string;
    collapseLabel: string;
}): import("react/jsx-runtime").JSX.Element;
export declare const CommandCenterDialog: import("react").MemoExoticComponent<({ open, commands, workspaceAbsPath, workspaceIdentity, activeTaskId, activeTaskChangeSummary, workspaceTabs, onOpenChange, onSelectTask, onSearchResultHighlightRequest, onOpenCodeViewer, }: {
    open: boolean;
    commands: QuickPickCommand[];
    workspaceAbsPath: string;
    workspaceIdentity?: string;
    activeTaskId?: string | null;
    activeTaskChangeSummary?: ZCodeTaskChangeSummary | null;
    workspaceTabs: WorkspaceTabState[];
    onOpenChange: (open: boolean) => void;
    onSelectTask: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentity?: string) => void;
    onSearchResultHighlightRequest?: (request: Omit<ChatSearchResultHighlightRequest, "requestId">) => void;
    onOpenCodeViewer: (source: CodeViewerSource) => void;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=CommandCenterDialog.d.ts.map