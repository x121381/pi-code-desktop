import type { WorkflowSettingsAmendMeta } from "@zcode/shared/zcode-protocol-v4";
export declare function WorkflowSettingsChangeRow({ amend, at, providerName, }: {
    amend: WorkflowSettingsAmendMeta;
    /** 设置轮的时刻；缺席即不写。 */
    at?: number;
    /** providerId → provider 名（与卡上的模型段同一个查找）；缺席退回裸 modelId。 */
    providerName?: (providerId: string) => string | undefined;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowSettingsChangeRow.d.ts.map