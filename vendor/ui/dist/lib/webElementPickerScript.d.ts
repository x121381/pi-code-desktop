import type { WebElementContextPayload } from "@/lib/webElementContext.js";
export type WebElementPickerScriptResult = {
    status: "cancelled";
} | {
    status: "selected";
    element: Omit<WebElementContextPayload, "workspacePath">;
};
interface WebElementPickerScriptOptions {
    maxTextChars: number;
    maxHtmlChars: number;
    maxAttributeChars: number;
    labels: WebElementPickerScriptLabels;
}
export interface WebElementPickerScriptLabels {
    background: string;
    color: string;
    font: string;
}
type WebElementPickerScriptBuildOptions = Partial<Omit<WebElementPickerScriptOptions, "labels">> & {
    labels?: Partial<WebElementPickerScriptLabels>;
};
export declare function buildWebElementPickerScript(options?: WebElementPickerScriptBuildOptions): string;
export declare function buildCancelWebElementPickerScript(): string;
export {};
//# sourceMappingURL=webElementPickerScript.d.ts.map