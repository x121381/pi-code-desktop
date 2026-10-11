import type { BackgroundWorkSummary } from "@zcode/shared/zcode-protocol-v4";
export interface ConversationBackgroundWorksProps {
    works: readonly BackgroundWorkSummary[];
    /** M4 cancelBackgroundWork：取消某后台工作（仅 running 可取消）。 */
    onCancel: (workId: string) => void;
}
/**
 * M4 后台工作面板：渲染 projection.backgroundWorks + running 项 cancel 入口。
 * memo：works 不变时不随 pane 其他状态重渲染（回调由父层 useCallback 稳定）。
 */
declare function ConversationBackgroundWorksImpl({ works, onCancel, }: ConversationBackgroundWorksProps): import("react/jsx-runtime").JSX.Element | null;
export declare const ConversationBackgroundWorks: import("react").MemoExoticComponent<typeof ConversationBackgroundWorksImpl>;
export {};
//# sourceMappingURL=ConversationBackgroundWorks.d.ts.map