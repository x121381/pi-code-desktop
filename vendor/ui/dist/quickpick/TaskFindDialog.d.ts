export type TaskFindDialogProps = {
    open: boolean;
    focusRequestId: number;
    placement?: "window" | "chat";
    isMacDesktop?: boolean;
    isWindowsDesktop?: boolean;
    isLinuxDesktop?: boolean;
    conversationMatchCount: number;
    conversationMatchIndex: number;
    fileChangeMatchCount: number;
    fileChangeMatchIndex: number;
    onOpenChange: (open: boolean) => void;
    onConversationFindChange: (query: string, activeIndex: number) => void;
    onConversationFindNavigate: (query: string, activeIndex: number) => void;
    onFileChangeFindChange: (query: string, activeIndex: number) => void;
    onFileChangeFindNavigate: (query: string, activeIndex: number) => void;
    onOpenFileChanges: () => void;
};
export declare function TaskFindDialog({ open, focusRequestId, placement, isMacDesktop, isWindowsDesktop, isLinuxDesktop, conversationMatchCount, conversationMatchIndex, fileChangeMatchCount, fileChangeMatchIndex, onOpenChange, onConversationFindChange, onConversationFindNavigate, onFileChangeFindChange, onFileChangeFindNavigate, onOpenFileChanges, }: TaskFindDialogProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=TaskFindDialog.d.ts.map