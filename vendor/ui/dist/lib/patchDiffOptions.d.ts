import type { FileDiffOptions } from "@pierre/diffs";
import type { BundledTheme } from "shiki";
import type { ResolvedTheme } from "@/useTheme.js";
interface PatchDiffSettings {
    lightTheme: BundledTheme;
    darkTheme: BundledTheme;
    showLineNumbers: boolean;
    wrapLongLines: boolean;
}
type PatchDiffSeparatorStyle = "line-info" | "simple";
export declare function createPatchDiffOptions(codePreviewSettings: PatchDiffSettings, resolvedTheme: ResolvedTheme, options?: {
    separatorStyle?: PatchDiffSeparatorStyle;
}): FileDiffOptions<undefined>;
export {};
//# sourceMappingURL=patchDiffOptions.d.ts.map