import { type CuaComposerEntryView } from "@/lib/cuaComposerEntryState.js";
export interface UseCuaComposerEntryParams {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string | null;
    /** 手机 Web 远控壳；远控保护约束下不渲染本机 CUA 入口。 */
    isWebRemoteControl?: boolean;
    /** 当前 composer 的 v4 snapshot.control.canStop，作为运行态的低延迟权威。 */
    currentSessionBusy?: boolean;
}
export interface CuaComposerEntryController {
    view: CuaComposerEntryView;
    /** 点击按钮；仅在 view.clickAction === "open-settings" 时产生副作用。 */
    onActivate: () => void;
}
export declare function useCuaComposerEntry({ workspacePath, workspaceIdentity, remoteSessionId, isWebRemoteControl, currentSessionBusy, }: UseCuaComposerEntryParams): CuaComposerEntryController;
//# sourceMappingURL=useCuaComposerEntry.d.ts.map