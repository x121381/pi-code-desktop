import { type ReactNode } from "react";
import { type RemoteTarget, type RemoteWorkspaceSessionEntry } from "@zcode/shared";
import { buttonVariants } from "@/components/ui/button.js";
import type { VariantProps } from "class-variance-authority";
interface RemoteConnectionDialogProps {
    onConnect: (options: RemoteTarget, requestId?: string) => Promise<string>;
    onSelectProject: (sessionId: string, path: string, localWorkspacePath?: string) => Promise<void>;
    onCancelSession: (sessionId: string) => Promise<void>;
    localWorkspacePath?: string;
    trigger?: ReactNode;
    triggerVariant?: VariantProps<typeof buttonVariants>["variant"];
    triggerSize?: VariantProps<typeof buttonVariants>["size"];
    triggerClassName?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    hideTriggerWhenClosed?: boolean;
    isWindowsDesktop?: boolean;
    remoteWorkspaceSessions?: RemoteWorkspaceSessionEntry[];
    onFlowActiveChange?: (active: boolean) => void;
    onFlowRequestIdChange?: (requestId: string | null) => void;
    preferredKind?: RemoteTarget["kind"];
    preferredWslDistro?: string;
}
export declare function RemoteConnectionDialog({ onConnect, onSelectProject, onCancelSession, localWorkspacePath, trigger, triggerVariant, triggerSize, triggerClassName, open: controlledOpen, onOpenChange, hideTriggerWhenClosed, isWindowsDesktop, remoteWorkspaceSessions, onFlowActiveChange, onFlowRequestIdChange, preferredKind, preferredWslDistro, }: RemoteConnectionDialogProps): import("react/jsx-runtime").JSX.Element;
export declare const SSHDialog: typeof RemoteConnectionDialog;
export {};
//# sourceMappingURL=SSHDialog.d.ts.map