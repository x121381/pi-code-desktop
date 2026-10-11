import type { WorkspaceTabState } from "@/store/tabStore.js";
interface CommandsSectionProps {
    workspacePath?: string | null;
    workspaceIdentity?: string;
    scopeFilter: "user" | "workspace";
    parentScopeKey: string;
    workspaceTabs: WorkspaceTabState[];
    searchQuery: string;
    onVisibleCountChange?: (count: number) => void;
    onEditorOpenChange?: (open: boolean) => void;
    onFormScopeKeyChange?: (scopeKey: string | null) => void;
}
export declare function CommandsSection({ workspacePath, workspaceIdentity, scopeFilter, parentScopeKey, workspaceTabs, searchQuery, onVisibleCountChange, onEditorOpenChange, onFormScopeKeyChange, }: CommandsSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CommandsSection.d.ts.map