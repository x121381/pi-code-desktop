import type { ZCodePermissionRequest } from "@zcode/shared";
/**
 * SaveWorkflow 的保存确认块。
 *
 * 这个 gate **没有 display 载荷**（spec 明确 v1 不加 `save_workflow` display kind）：入参就是
 * 全部内容，所以块里的每一项都读自归一化入参。脚本折叠沿用运行确认窗的同一习语与同一组文案
 * ——同一段脚本在两个窗里必须同名。
 *
 * 刻意**不**接 Refine：Refine 的语义是「拒绝这次运行并告诉模型怎么改工作流」，
 * 而保存是一次写盘，改法是模型换一组元数据重新调用，不需要第三个选项。
 */
export declare function SaveWorkflowPermissionBlock({ request }: {
    request: ZCodePermissionRequest;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SaveWorkflowPermissionBlock.d.ts.map