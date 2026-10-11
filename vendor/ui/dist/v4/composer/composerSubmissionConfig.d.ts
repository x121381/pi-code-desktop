import { type ModelSelection } from "@zcode/shared";
import { type SubmissionMode } from "@zcode/shared/zcode-protocol-v4";
import type { ModelSelectionView } from "@zcode/services";
export interface ComposerSubmissionConfig {
    modelSelection: ModelSelection;
    mode: SubmissionMode;
    planEnabled: boolean;
}
/** 在点击提交的瞬间，把 Composer 意图冻结成本次 Submission 的执行配置。 */
export declare function createComposerSubmissionConfig(composer: {
    mode?: string;
    planEnabled?: boolean;
    modelSelection?: ModelSelection;
} | null | undefined, view: ModelSelectionView | null): ComposerSubmissionConfig | null;
//# sourceMappingURL=composerSubmissionConfig.d.ts.map