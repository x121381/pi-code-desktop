import { type ArtifactPillData, type ArtifactPillSize } from "./WorkflowArtifactPill.js";
export declare function WorkflowArtifactStrip({ artifacts, className, moreTestId, onOpenArtifact, pillTestId, size, testId, truncated, variant, }: {
    variant?: "pill" | "link";
    artifacts: readonly ArtifactPillData[];
    size?: ArtifactPillSize;
    /** 缺席即药丸全部禁用（回调的存在即门控）。 */
    onOpenArtifact?: (artifactId: string) => void;
    /** 发射侧砍过（超上界或被过滤）——`+N` 因此可能少报，用 `…` 而不是数字。 */
    truncated?: boolean;
    testId?: string;
    pillTestId?: string;
    moreTestId?: string;
    className?: string;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkflowArtifactStrip.d.ts.map