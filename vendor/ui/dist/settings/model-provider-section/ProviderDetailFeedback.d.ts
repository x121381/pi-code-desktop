import { type ReactNode } from "react";
export type ProviderDetailFeedbackState = "pending" | "success" | "failure";
export interface ProviderDetailFeedbackInput {
    key: string;
    message: string;
    state: ProviderDetailFeedbackState;
    /** 连接测试成功使用语义绿；保存/删除沿用中性反馈，不按文案或 key 推断操作。 */
    successEmphasis?: boolean;
    durationMs?: number;
    actionLabel?: string;
    onAction?: () => void;
    dismissible?: boolean;
    dismissLabel?: string;
}
interface ProviderDetailFeedbackContextValue {
    showFeedback: (input: ProviderDetailFeedbackInput) => void;
    dismissFeedback: (key: string) => void;
}
export declare function useProviderDetailFeedback(): ProviderDetailFeedbackContextValue;
export declare function ProviderDetailFeedbackBoundary({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ProviderDetailFeedback.d.ts.map