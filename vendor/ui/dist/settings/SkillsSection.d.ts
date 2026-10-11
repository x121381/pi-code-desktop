import type { RemoteTarget } from "@zcode/shared";
import type { CreateTaskRequest } from "@/app-shell/types.js";
interface SkillsSectionProps {
    workspacePath?: string | null;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    remoteTarget?: RemoteTarget;
    isWebRemoteControl?: boolean;
    scopeFilter: "user" | "workspace";
    searchQuery: string;
    onVisibleCountChange?: (count: number) => void;
    onCreateTask?: (request?: CreateTaskRequest) => void;
    onDetailOpenChange?: (open: boolean) => void;
    onOpenPluginStore?: () => void;
    showMarketplaceBreadcrumb?: boolean;
    reportDetailBreadcrumb?: boolean;
}
export declare function SkillsSection({ workspacePath, workspaceIdentity, remoteSessionId, remoteTarget, isWebRemoteControl, scopeFilter, searchQuery, onVisibleCountChange, onCreateTask, onDetailOpenChange, onOpenPluginStore, showMarketplaceBreadcrumb, reportDetailBreadcrumb, }: SkillsSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SkillsSection.d.ts.map