import { type ZCodePermissionOption, type ZCodePermissionRequest, type ZCodeProvider } from "@zcode/shared";
export declare function PermissionDialog({ request, onRespond, workspacePath, workspaceIdentity, remoteSessionId, workflowSessionModel, provider, isWebRemoteControl, responding, responseError, }: {
    request: ZCodePermissionRequest;
    responding?: boolean;
    responseError?: string;
    /**
     * `content` 只在工作流确认窗的放行应答上出现：用户在窗里改过的设置（docs/dynamic-workflow/launch.md
     * 「Adjusting the settings in the window」）。没改过即不传。
     */
    onRespond: (requestId: string, option: ZCodePermissionOption, feedback?: string, content?: Record<string, unknown>) => void;
    workspacePath: string;
    /** 工作流确认窗的模型清单作用域与会话模型（宿主给）。 */
    workspaceIdentity?: string;
    remoteSessionId?: string;
    workflowSessionModel?: {
        providerId: string;
        modelId: string;
    };
    provider?: ZCodeProvider;
    isWebRemoteControl?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PermissionDialog.d.ts.map