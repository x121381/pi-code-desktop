import { type CommandAgentSource, type CommandConfig, type UserCommand } from "@zcode/shared";
import type { WorkspaceTabState } from "@/store/tabStore.js";
interface CommandFormProps {
    initial?: UserCommand;
    agentSource?: CommandAgentSource;
    scopeKey: string;
    workspaceTabs: WorkspaceTabState[];
    onScopeKeyChange: (scopeKey: string) => void;
    onSave: (config: CommandConfig, scopeKey: string) => Promise<void>;
    onCancel: () => void;
    onDelete?: (command: UserCommand) => void;
    saving: boolean;
}
export declare function CommandForm({ initial, scopeKey, workspaceTabs, onScopeKeyChange, onSave, onCancel, onDelete, saving, }: CommandFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CommandForm.d.ts.map