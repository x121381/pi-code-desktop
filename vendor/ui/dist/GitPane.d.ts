import type { GitChangeSourceId } from "@zcode/shared";
import { type GitPaneRepositoryState } from "@/hooks/useGitRepository.js";
export declare function GitPane({ workspacePath, gitState, isDesktop, selectedSourceId, fileChangeFindActiveIndex, fileChangeFindNavigationRequestId, fileChangeFindQuery, onFileChangeFindMatchCountChange, onSelectSource, onClose: _onClose, onRefresh, onRevealFileInTree, workspaceIdentity, workspaceRemoteSessionId, }: {
    workspacePath: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    gitState: GitPaneRepositoryState;
    isDesktop?: boolean;
    selectedSourceId: GitChangeSourceId;
    fileChangeFindActiveIndex: number;
    fileChangeFindNavigationRequestId: number;
    fileChangeFindQuery: string;
    onFileChangeFindMatchCountChange: (count: number) => void;
    onSelectSource: (sourceId: GitChangeSourceId) => void;
    onClose: () => void;
    onRefresh: () => void;
    onRevealFileInTree?: (path: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GitPane.d.ts.map