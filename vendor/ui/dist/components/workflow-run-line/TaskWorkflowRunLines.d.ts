import type { SessionWorkflowActivity } from "@zcode/shared/zcode-protocol-v4";
export interface TaskWorkflowRunLinesIntl {
    formatMessage: (desc: {
        id: string;
    }, values?: Record<string, string>) => string;
}
interface TaskWorkflowRunLinesProps {
    activity: SessionWorkflowActivity | undefined;
    /** 会话是否正被打开：为真时确认它所有已结束的 run（结束的行随即折叠）。 */
    isActive: boolean;
    intl: TaskWorkflowRunLinesIntl;
    /** 点击打开 run pane 所需的会话地址；缺席（手机首页）时运行行不是按钮。 */
    session?: {
        workspacePath: string;
        workspaceIdentity?: string;
        sessionId: string;
    };
    /** compact = 手机远控行（24px、更小字号）。 */
    density?: "default" | "compact";
    className?: string;
}
export declare function TaskWorkflowRunLines({ activity, isActive, intl, session, density, className, }: TaskWorkflowRunLinesProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=TaskWorkflowRunLines.d.ts.map