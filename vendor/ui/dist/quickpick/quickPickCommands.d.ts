export type QuickPickCommandIcon = "book" | "browser" | "community" | "diff" | "feedback" | "folder" | "login" | "logout" | "message" | "mcp" | "settings" | "sidebarClose" | "sidebarOpen" | "skills" | "themeDark" | "themeLight" | "terminal";
export type QuickPickCommandSectionId = "suggested" | "chat" | "navigation" | "panels" | "configure" | "app";
export declare const QUICK_PICK_SECTION_ORDER: QuickPickCommandSectionId[];
export interface QuickPickCommand {
    id: string;
    sectionId: QuickPickCommandSectionId;
    titleId: string;
    icon: QuickPickCommandIcon;
    shortcut?: string;
    keywords: string[];
    disabled?: boolean;
    run: () => void | Promise<void>;
}
interface QuickPickCommandHandlers {
    createTask: () => void;
    openWorkspace: () => void;
    openSettings: () => void;
    openSkillsSettings: () => void;
    openMcpSettings: () => void;
    switchTheme: () => void;
    openFeedback: () => void | Promise<void>;
    openCommunity: () => void | Promise<void>;
    openProductDocs: () => void | Promise<void>;
    login?: () => void | Promise<void>;
    logout?: () => void | Promise<void>;
    toggleSidebar: () => void;
    toggleTerminal: () => void;
    togglePreview: () => void;
    openTerminalTab: () => void;
    openBrowserTab: () => void;
    openReviewTab: () => void;
}
interface CreateQuickPickCommandsOptions {
    allowOpenWorkspace: boolean;
    canOpenCommunity: boolean;
    isSidebarVisible: boolean;
    isLoggedIn: boolean;
    supportsEmbeddedBrowser?: boolean;
    supportsTerminal?: boolean;
    supportsReview?: boolean;
    themeTarget: "dark" | "light";
    shortcuts: {
        newTask: string;
        openWorkspace: string;
        toggleSidebar: string;
        toggleTerminal: string;
    };
    handlers: QuickPickCommandHandlers;
}
export declare function createQuickPickCommands({ allowOpenWorkspace, canOpenCommunity, isSidebarVisible, isLoggedIn, supportsEmbeddedBrowser, supportsTerminal, supportsReview, themeTarget, shortcuts, handlers, }: CreateQuickPickCommandsOptions): QuickPickCommand[];
export {};
//# sourceMappingURL=quickPickCommands.d.ts.map