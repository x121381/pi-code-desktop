import type { Hook, HookConfig } from "@zcode/shared";
import type { WorkspaceTabState } from "@/store/tabStore.js";
interface HookFormProps {
    hook?: Hook;
    workspaceAvailable?: boolean;
    defaultStorageLevel?: "user" | "project";
    onSave: (config: HookConfig) => void;
    onCancel: () => void;
    onDelete?: (hook: Hook) => void;
    isEditing?: boolean;
    workspaceTabs?: WorkspaceTabState[];
    selectedScopeKey?: string;
    onScopeKeyChange?: (scopeKey: string) => void;
}
export declare function HookForm({ hook, workspaceAvailable, defaultStorageLevel, onSave, onCancel, onDelete, isEditing, workspaceTabs, selectedScopeKey, onScopeKeyChange, }: HookFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=HookForm.d.ts.map