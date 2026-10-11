import type { McpSource, ZCodeMcpServer } from "@zcode/shared";
import type { WorkspaceTabState } from "@/store/tabStore.js";
import { type FormState, type McpEditorMode } from "./mcpSettingsShared.js";
export declare function McpServerForm({ initial, editingId, editorMode, onEditorModeChange, onSave, onCancel, onDelete, scopeKey, workspaceTabs, onScopeKeyChange, }: {
    initial?: ZCodeMcpServer;
    editingId?: string;
    editorMode: McpEditorMode;
    source?: McpSource;
    scopeKey: string;
    workspaceTabs: WorkspaceTabState[];
    onScopeKeyChange: (scopeKey: string) => void;
    onEditorModeChange: (mode: McpEditorMode) => void;
    onSave: (form: FormState, prevServer?: ZCodeMcpServer) => void;
    onCancel: () => void;
    onDelete?: (server: ZCodeMcpServer) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=McpServerForm.d.ts.map