import type { ModelSelectionView } from "@zcode/services";
import { type ZCodeOffPeakTask, type ModelSelection } from "@zcode/shared";
import { toast } from "@/components/ui/toast.js";
export declare function buildOffPeakSubmissionModelSelection(providerId: string, modelId: string, displayedReasoningLevel: string | undefined): ModelSelection;
export interface OffPeakEditSubmit {
    title: string;
    prompt: string;
    permissionMode: string;
    modelSelection: ModelSelection;
    workspacePath: string;
    workspaceIdentity?: string;
}
interface OffPeakEditViewProps {
    editing: ZCodeOffPeakTask | null;
    /** 创建态预填（New task 页模板卡跳转）；编辑态忽略。 */
    initialDraft?: {
        title?: string;
        prompt?: string;
    } | null;
    modelSelectionView: ModelSelectionView;
    defaultWorkspacePath: string;
    defaultWorkspaceIdentity?: string;
    saving: boolean;
    /** selected Coding Plan 或服务端 availability 不允许创建时禁用提交；编辑不受影响。 */
    createBlocked?: boolean;
    createBlockedTooltip?: string;
    onBack: () => void;
    onSubmit: (input: OffPeakEditSubmit) => Promise<boolean>;
    onOpenSession?: (params: {
        sessionId: string;
        workspacePath: string;
        workspaceIdentity?: string;
    }) => void;
    onDelete?: (task: ZCodeOffPeakTask) => void;
    onDeleteHistory?: (task: ZCodeOffPeakTask) => void;
    onPause?: (task: ZCodeOffPeakTask) => void;
    onContinue?: (task: ZCodeOffPeakTask) => void;
    showToast?: typeof toast;
}
export declare function OffPeakEditView({ editing, initialDraft, modelSelectionView, defaultWorkspacePath, defaultWorkspaceIdentity, saving, createBlocked, createBlockedTooltip, onBack, onSubmit, onOpenSession, onDelete, onDeleteHistory, onPause, onContinue, showToast, }: OffPeakEditViewProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=OffPeakEditView.d.ts.map