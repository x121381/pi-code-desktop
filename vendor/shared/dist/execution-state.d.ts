import { z } from "zod";
/** auto 保留为内部权限；plan 仅在旧格式读取边界接受。 */
export declare const executionPermissionModeSchema: z.ZodEnum<{
    build: "build";
    edit: "edit";
    yolo: "yolo";
    guarded: "guarded";
    auto: "auto";
}>;
export declare const executionStateSchema: z.ZodObject<{
    mode: z.ZodEnum<{
        build: "build";
        edit: "edit";
        yolo: "yolo";
        guarded: "guarded";
        auto: "auto";
    }>;
    planEnabled: z.ZodBoolean;
}, z.core.$strip>;
export type ExecutionState = z.infer<typeof executionStateSchema>;
/** 在接纳边界固定旧请求语义，不能在队列消费时按当前配置重新解释。 */
export declare function resolveExecutionState(input: {
    mode?: string;
    planEnabled?: boolean;
}, current?: ExecutionState): ExecutionState;
//# sourceMappingURL=execution-state.d.ts.map