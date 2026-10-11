import { type MutableRefObject } from "react";
import type { LexicalChatInputHandle } from "@/LexicalChatInput.js";
export declare function ChatPromptActionMenu({ actionMenuTitle, attachmentAction, disabled, disabledReason, inputApiRef, workspacePath, workspaceIdentity, sessionId, container, showPlugins, excludedSlashCommandNames, }: {
    actionMenuTitle: string;
    attachmentAction?: {
        label: string;
        onSelect: () => void;
        testId?: string;
        menuItemTestId?: string;
    };
    disabled?: boolean;
    disabledReason?: string;
    inputApiRef: MutableRefObject<LexicalChatInputHandle | null>;
    workspacePath: string;
    workspaceIdentity?: string;
    sessionId: string | null;
    container: HTMLElement | null;
    showPlugins: boolean;
    excludedSlashCommandNames?: readonly string[];
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatPromptActionMenu.d.ts.map