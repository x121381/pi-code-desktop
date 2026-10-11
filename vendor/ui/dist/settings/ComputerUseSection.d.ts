import type { RemoteTarget } from "@zcode/shared";
interface ComputerUseSectionProps {
    isDesktop?: boolean;
    isMacDesktop?: boolean;
    isWindowsDesktop?: boolean;
    workspacePath?: string | null;
    workspaceIdentity?: string;
    remoteSessionId?: string | null;
    remoteTarget?: RemoteTarget | null;
    localWorkspacePath?: string | null;
}
export declare function ComputerUseSection({ isDesktop, isMacDesktop, isWindowsDesktop, workspacePath, workspaceIdentity, remoteSessionId, remoteTarget, localWorkspacePath, }: ComputerUseSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ComputerUseSection.d.ts.map