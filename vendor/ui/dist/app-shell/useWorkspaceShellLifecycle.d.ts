import { type Dispatch, type SetStateAction } from "react";
import type { IServiceAccessor } from "@zcode/services";
import type { TaskChatMessage as TestChatMessage } from "@/lib/taskChatMessageTypes.js";
import type { BrowserNavigationRequest } from "@/hooks/useAppPanels.js";
export declare function useWorkspaceShellLifecycle({ workspaceAbsPath, workspaceIdentity, services, setBrowserNavigationRequest, setTestMessages, }: {
    workspaceAbsPath: string;
    workspaceIdentity?: string;
    services: IServiceAccessor;
    setBrowserNavigationRequest: Dispatch<SetStateAction<BrowserNavigationRequest | null>>;
    setTestMessages: Dispatch<SetStateAction<TestChatMessage[] | null>>;
}): void;
//# sourceMappingURL=useWorkspaceShellLifecycle.d.ts.map