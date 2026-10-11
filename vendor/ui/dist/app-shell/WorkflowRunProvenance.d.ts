import type { WorkflowLaunchMeta } from "@zcode/shared/zcode-protocol-v4";
/**
 * 中枢启动：「由你从工作流中枢启动 · 时刻」与作用域徽标，其下是说明与实参键值表。
 * 「配置」修订：「由你调整设置 · 时刻」，没有作用域徽标，其下每项改动一行「{from} → {to}」。
 */
export declare const WorkflowRunProvenance: import("react").MemoExoticComponent<({ meta, providerName, startedAt, }: {
    meta: WorkflowLaunchMeta;
    /** providerId → provider 名（与摘要行的模型段同一个查找）；缺席退回裸 modelId。 */
    providerName?: (providerId: string) => string | undefined;
    /** 启动轮 / 设置轮的 startedAt；缺席即不写时刻。 */
    startedAt?: number;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=WorkflowRunProvenance.d.ts.map