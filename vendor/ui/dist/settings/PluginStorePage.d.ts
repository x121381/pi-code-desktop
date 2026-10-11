import type { CreateTaskRequest } from "@/app-shell/types.js";
interface PluginStorePageProps {
    isWebRemoteControl?: boolean;
    workspacePath?: string | null;
    workspaceIdentity?: string;
    onCreateTask?: (request?: CreateTaskRequest) => void;
    onManageInstalled: () => void;
}
export declare function PluginStorePage({ isWebRemoteControl, workspacePath, workspaceIdentity, onCreateTask, onManageInstalled, }: PluginStorePageProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PluginStorePage.d.ts.map