import { Button } from "../ui/button.js";
import { ButtonGroup } from "../ui/button-group.js";
import type { FileStat, OpenInEditorOptions } from "@zcode/shared";
import type { UIMessage } from "ai";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import type { BundledTheme } from "shiki";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { CodePreviewSettings } from "@/lib/codePreviewSettings.js";
import type { Theme } from "@/useTheme.js";
export type MessageProps = HTMLAttributes<HTMLDivElement> & {
    from: UIMessage["role"];
};
export declare const Message: ({ className, from, ...props }: MessageProps) => import("react/jsx-runtime").JSX.Element;
export type MessageContentProps = HTMLAttributes<HTMLDivElement>;
export declare const MessageContent: ({ children, className, ...props }: MessageContentProps) => import("react/jsx-runtime").JSX.Element;
export type MessageActionsProps = ComponentProps<"div">;
export declare const MessageActions: ({ className, children, ...props }: MessageActionsProps) => import("react/jsx-runtime").JSX.Element;
export type MessageActionProps = ComponentProps<typeof Button> & {
    tooltip?: string;
    label?: string;
};
export declare const MessageAction: ({ tooltip, children, label, variant, size, ...props }: MessageActionProps) => import("react/jsx-runtime").JSX.Element;
export type MessageBranchProps = HTMLAttributes<HTMLDivElement> & {
    defaultBranch?: number;
    onBranchChange?: (branchIndex: number) => void;
};
export declare const MessageBranch: ({ defaultBranch, onBranchChange, className, ...props }: MessageBranchProps) => import("react/jsx-runtime").JSX.Element;
export type MessageBranchContentProps = HTMLAttributes<HTMLDivElement>;
export declare const MessageBranchContent: ({ children, ...props }: MessageBranchContentProps) => import("react/jsx-runtime").JSX.Element[];
export type MessageBranchSelectorProps = ComponentProps<typeof ButtonGroup>;
export declare const MessageBranchSelector: ({ className, ...props }: MessageBranchSelectorProps) => import("react/jsx-runtime").JSX.Element | null;
export type MessageBranchPreviousProps = ComponentProps<typeof Button>;
export declare const MessageBranchPrevious: ({ children, ...props }: MessageBranchPreviousProps) => import("react/jsx-runtime").JSX.Element;
export type MessageBranchNextProps = ComponentProps<typeof Button>;
export declare const MessageBranchNext: ({ children, ...props }: MessageBranchNextProps) => import("react/jsx-runtime").JSX.Element;
export type MessageBranchPageProps = HTMLAttributes<HTMLSpanElement>;
export declare const MessageBranchPage: ({ className, ...props }: MessageBranchPageProps) => import("react/jsx-runtime").JSX.Element;
export type MessageResponseProps = {
    /** 办公模式的正式回答固定换行，不覆盖用户保存的代码预览设置。 */
    forceCodeWrap?: boolean;
    className?: string;
    children?: ReactNode;
    dir?: "auto" | "ltr" | "rtl";
    streaming?: boolean;
    streamingAnimationKey?: string;
    workspacePath?: string;
    workspaceHomePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    sessionId?: string;
    readAttachment?: (params: {
        sessionId: string;
        ref: string;
    }) => Promise<{
        bytes: Uint8Array;
        mediaType: string;
    } | {
        url: string;
        mediaType: string;
    }>;
    /**
     * 应用主题（store 耦合剥离）：决定代码块高亮取 light/dark 主题。
     * 由调用方从上层状态传入；默认 "system" 跟随操作系统，供待删旧调用点兜底。
     */
    theme?: Theme;
    /**
     * 代码预览设置（store 耦合剥离）：由调用方传入，需保持引用稳定。
     * 默认 DEFAULT_CODE_PREVIEW_SETTINGS。
     */
    codePreviewSettings?: CodePreviewSettings;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onOpenExternalUrl?: (url: string) => void;
    /** 仅 Assistant 正文开启：把完整 zcode-file-citation 投影为现有文件链接。 */
    renderZCodeFileCitations?: boolean;
};
export interface MessageFileLinkTarget {
    path: string;
    label: string;
    /** 仅用于显式尾随斜杠的目录展示提示；打开第三方应用前必须重新 stat。 */
    pathKind?: NonNullable<OpenInEditorOptions["pathKind"]>;
    relativePath?: string;
    workspacePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
}
type MessageStreamdownMode = "static" | "streaming";
export declare function resolveMessageStreamdownMode(renderStreaming: boolean): MessageStreamdownMode;
export declare function buildMessageStreamdownRenderKey(params: {
    attachmentReaderEpoch?: number;
    codeBlockTheme: BundledTheme;
    fontSizePx: number;
    renderZCodeFileCitations?: boolean;
    sessionId?: string;
    workspacePath?: string;
    workspaceHomePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    wrapLongLines: boolean;
}): string;
export declare function buildMessageFileLinkTarget(input: {
    href: string;
    label: string;
    path: string;
    workspacePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
}): MessageFileLinkTarget;
export declare function openMessageFileLinkInEditor({ editorId, fileLink, openInEditor, remoteTarget, statFile, }: {
    editorId: string;
    fileLink: MessageFileLinkTarget;
    openInEditor: (editorId: string, path: string, options: OpenInEditorOptions) => Promise<{
        success: boolean;
        error?: string;
    }>;
    remoteTarget?: OpenInEditorOptions["remoteTarget"];
    statFile: (params: {
        path: string;
    }) => Promise<Pick<FileStat, "type">>;
}): Promise<{
    success: boolean;
    error?: string;
}>;
export declare const messageResponsePropsAreEqual: (prevProps: Readonly<MessageResponseProps>, nextProps: Readonly<MessageResponseProps>) => boolean;
export declare const MessageResponse: import("react").MemoExoticComponent<({ className, streaming, forceCodeWrap, onOpenCodeViewer, onOpenFileLink, onOpenExternalUrl, renderZCodeFileCitations, workspacePath, workspaceHomePath, workspaceIdentity, workspaceRemoteSessionId, sessionId, readAttachment, theme, codePreviewSettings, children, }: MessageResponseProps) => import("react/jsx-runtime").JSX.Element>;
export type MessageToolbarProps = ComponentProps<"div">;
export declare const MessageToolbar: ({ className, children, ...props }: MessageToolbarProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=message.d.ts.map