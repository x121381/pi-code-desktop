import type { HTMLAttributes } from "react";
import type { BundledTheme } from "shiki";
import type { FileContents, FileDiffOptions } from "@pierre/diffs";
type DiffViewerPatchInput = {
    patch: string;
    oldFile?: never;
    newFile?: never;
};
type DiffViewerMultiFileInput = {
    patch?: never;
    oldFile: FileContents;
    newFile: FileContents;
};
export type DiffViewerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & (DiffViewerPatchInput | DiffViewerMultiFileInput) & {
    options?: FileDiffOptions<undefined>;
    disableWorkerPool?: boolean;
    diffClassName?: string;
    fontSizePx?: number;
    lightTheme?: BundledTheme;
    darkTheme?: BundledTheme;
    themeType?: "light" | "dark";
    selectedLines?: DiffViewerSelectedLineRange | null;
};
export interface DiffViewerSelectedLineRange {
    start: number;
    end: number;
    side: "additions" | "deletions";
}
declare function DiffViewerComponent(props: DiffViewerProps): import("react/jsx-runtime").JSX.Element;
export declare const DiffViewer: import("react").MemoExoticComponent<typeof DiffViewerComponent>;
export {};
//# sourceMappingURL=diff-viewer.d.ts.map