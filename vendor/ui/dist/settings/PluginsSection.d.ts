import type { CreateTaskRequest } from "@/app-shell/types.js";
type PluginTabTarget = "plugins" | "mcps" | "skills" | "commands";
interface PluginsSectionProps {
    isDesktop?: boolean;
    isMacDesktop?: boolean;
    isWindowsDesktop?: boolean;
    isWebRemoteControl?: boolean;
    initialTab?: PluginTabTarget;
    initialScopeKey?: string;
    mode?: "plugin" | "mcp" | "skill" | "command";
    workspacePath?: string | null;
    workspaceIdentity?: string;
    onCreateTask?: (request?: CreateTaskRequest) => void;
    onOpenPluginStore: (returnScopeKey?: string, intent?: "add-marketplace") => void;
    showMarketplaceBreadcrumb?: boolean;
}
export declare function PluginsSection({ isDesktop, isMacDesktop, isWindowsDesktop, isWebRemoteControl, initialTab, initialScopeKey, mode, workspacePath, workspaceIdentity, onCreateTask, onOpenPluginStore, showMarketplaceBreadcrumb, }: PluginsSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PluginsSection.d.ts.map