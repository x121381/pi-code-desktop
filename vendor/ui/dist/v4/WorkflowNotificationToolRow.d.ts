import type { WorkflowNotificationMeta, WorkflowRunHole } from "@zcode/shared/zcode-protocol-v4";
import type { Theme } from "@/useTheme.js";
export interface WorkflowNotificationToolRowProps {
    notification: WorkflowNotificationMeta;
    /** run 名 = originMeta.title（CLI 权威给出，不本地化）。 */
    runName: string;
    /** testid 后缀 + ToolLayout persist key，取 unit.key。 */
    testIdKey: string;
    /** CodeBlock 的应用主题（json result 走它）。 */
    theme: Theme;
    /** 预绑定的打开 run 详情回调；不可得时展开体内不渲染「打开运行详情」链接。 */
    onOpenRun?: () => void;
    /**
     * 预绑定的打开产物 tab 回调（宿主从 join 注入，同 `onOpenRun`）。缺席时 chips 仍然渲染，
     * 只是不可点——「交付了什么」是事实，「能不能打开」是能力。
     */
    onOpenArtifact?: (artifactId: string) => void;
    /** 升级行的在场性联查：undefined = run 不在活投影；Set 含 qid = Waiting；不含 = Answered。 */
    pendingQids?: ReadonlySet<string>;
    /** 测试/宿主强制展开（透传 ToolLayout.forceOpen）；产品默认折叠。 */
    forceOpen?: boolean;
    /**
     * 留白行的在场性联查（docs/dynamic-workflow/transcript-and-notifications.md「The hole row's live state」）：
     * run 投影里的 `holes`；undefined = run 不在活投影（中性词）。
     */
    holes?: readonly WorkflowRunHole[];
}
export declare function WorkflowNotificationToolRow(props: WorkflowNotificationToolRowProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowNotificationToolRow.d.ts.map