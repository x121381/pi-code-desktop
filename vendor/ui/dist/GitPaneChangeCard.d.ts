import type { GitDiffResult } from "@zcode/shared";
import type { GitPaneFileChange } from "@/hooks/useGitRepository.js";
import type { CodePreviewSettings } from "@/store/index.js";
import type { ResolvedTheme } from "@/useTheme.js";
export declare function GitPaneChangeCard({ change, contextMenuLabels, diffState, isDiffLoading, isExpanded, canRevealInFileManager, codePreviewSettings, resolvedTheme, onCopyAbsolutePath, onCopyRelativePath, onOpenChange, onRevealInFileManager, onRevealInFileTree, }: {
    change: GitPaneFileChange;
    contextMenuLabels: {
        copyAbsolutePath: string;
        copyRelativePath: string;
        revealInFileManager: string;
        revealInFileTree: string;
    };
    diffState: GitDiffResult | null;
    isDiffLoading: boolean;
    isExpanded: boolean;
    canRevealInFileManager: boolean;
    codePreviewSettings: CodePreviewSettings;
    resolvedTheme: ResolvedTheme;
    onCopyAbsolutePath: (change: GitPaneFileChange) => void;
    onCopyRelativePath: (change: GitPaneFileChange) => void;
    onOpenChange: (change: GitPaneFileChange, nextOpen: boolean) => void;
    onRevealInFileManager: (change: GitPaneFileChange) => void;
    onRevealInFileTree?: (change: GitPaneFileChange) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GitPaneChangeCard.d.ts.map