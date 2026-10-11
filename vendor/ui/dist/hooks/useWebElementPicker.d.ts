import { type WebElementPickerScriptLabels } from "@/lib/webElementPickerScript.js";
interface UseWebElementPickerOptions {
    /**
     * 传输无关的脚本执行出口：把选择脚本送到目标网页并回传结果。
     * UnifiedBrowserView 走 main IPC（executeJavaScript）。
     */
    executeJs: (script: string) => Promise<unknown>;
    workspacePath: string;
    workspaceIdentity?: string;
    labels?: Partial<WebElementPickerScriptLabels>;
}
export declare function useWebElementPicker({ executeJs, workspacePath, workspaceIdentity, labels, }: UseWebElementPickerOptions): {
    cancelPicking: () => Promise<void>;
    isPicking: boolean;
    startPicking: () => Promise<void>;
    togglePicking: () => Promise<void>;
};
export {};
//# sourceMappingURL=useWebElementPicker.d.ts.map