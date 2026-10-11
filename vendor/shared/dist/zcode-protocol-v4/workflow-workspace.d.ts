import { z } from "zod";
/** 工作区 transcript 的展示上界。数字即契约。 */
export declare const WORKFLOW_WORKSPACE_LIMITS: {
    /** 一次清单最多多少行；超界由网关截尾并置 `truncated`。 */
    readonly maxNodes: 2000;
    /** `op` 名的长度（`git-changed-files` 是最长的那个）。 */
    readonly maxOpLength: 32;
    /** 实参个数（引擎侧截断后 ≤ 8；未截断的原值按 facade 签名 ≤ 3）。 */
    readonly maxArgs: 16;
    /** 失败信息的展示长度；超长由宿主切尾。 */
    readonly maxErrorMessageLength: 2000;
    /** 正文一次最多读回多少字节（截断而不是拒绝——这是审计面，不是脚本的取数面）。 */
    readonly resultMaxBytes: number;
};
export declare const workflowRunWorkspaceNodeKindSchema: z.ZodEnum<{
    "world-read": "world-read";
    "world-run": "world-run";
}>;
export type WorkflowRunWorkspaceNodeKind = z.infer<typeof workflowRunWorkspaceNodeKindSchema>;
/** journal 行的状态（`NodeRecordStatus` 的线上镜像）。 */
export declare const workflowRunWorkspaceNodeStatusSchema: z.ZodEnum<{
    running: "running";
    completed: "completed";
    failed: "failed";
}>;
export type WorkflowRunWorkspaceNodeStatus = z.infer<typeof workflowRunWorkspaceNodeStatusSchema>;
/** 结构化失败：journal `error_json` 的 code + message（其余字段不出协议）。 */
export declare const workflowRunWorkspaceNodeErrorSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
}, z.core.$strict>;
export type WorkflowRunWorkspaceNodeError = z.infer<typeof workflowRunWorkspaceNodeErrorSchema>;
/**
 * 清单上一行的摘要：不解正文就能报的几个数。哪个在场取决于 op——数组正文（glob / grep /
 * changedFiles）有 `resultCount`，`world.run` 有 `exitCode` 与两路输出的字节数，字符串正文
 * 只有 `resultBytes`。
 */
export declare const workflowRunWorkspaceNodeSummarySchema: z.ZodObject<{
    resultBytes: z.ZodNumber;
    resultCount: z.ZodOptional<z.ZodNumber>;
    exitCode: z.ZodOptional<z.ZodNumber>;
    stdoutBytes: z.ZodOptional<z.ZodNumber>;
    stderrBytes: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type WorkflowRunWorkspaceNodeSummary = z.infer<typeof workflowRunWorkspaceNodeSummarySchema>;
/**
 * 工作区 transcript 的一行。`op` / `args` 来自 `input_json`，升级前的历史行两者缺席
 * （UI 退回静态图上的步标签）；`inputTruncated` 表示 args 是逐项字符串预览而不是原值。
 */
export declare const workflowRunWorkspaceNodeSchema: z.ZodObject<{
    siteId: z.ZodString;
    ordinal: z.ZodNumber;
    kind: z.ZodEnum<{
        "world-read": "world-read";
        "world-run": "world-run";
    }>;
    op: z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    inputTruncated: z.ZodOptional<z.ZodLiteral<true>>;
    status: z.ZodEnum<{
        running: "running";
        completed: "completed";
        failed: "failed";
    }>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, z.core.$strict>>;
    summary: z.ZodOptional<z.ZodObject<{
        resultBytes: z.ZodNumber;
        resultCount: z.ZodOptional<z.ZodNumber>;
        exitCode: z.ZodOptional<z.ZodNumber>;
        stdoutBytes: z.ZodOptional<z.ZodNumber>;
        stderrBytes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strict>;
export type WorkflowRunWorkspaceNode = z.infer<typeof workflowRunWorkspaceNodeSchema>;
export declare const v4ConversationWorkflowRunWorkspaceParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    runId: z.ZodString;
}, z.core.$strict>;
export type V4ConversationWorkflowRunWorkspaceParams = z.infer<typeof v4ConversationWorkflowRunWorkspaceParamsSchema>;
export declare const v4ConversationWorkflowRunWorkspaceResultSchema: z.ZodObject<{
    nodes: z.ZodArray<z.ZodObject<{
        siteId: z.ZodString;
        ordinal: z.ZodNumber;
        kind: z.ZodEnum<{
            "world-read": "world-read";
            "world-run": "world-run";
        }>;
        op: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
        inputTruncated: z.ZodOptional<z.ZodLiteral<true>>;
        status: z.ZodEnum<{
            running: "running";
            completed: "completed";
            failed: "failed";
        }>;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
        }, z.core.$strict>>;
        summary: z.ZodOptional<z.ZodObject<{
            resultBytes: z.ZodNumber;
            resultCount: z.ZodOptional<z.ZodNumber>;
            exitCode: z.ZodOptional<z.ZodNumber>;
            stdoutBytes: z.ZodOptional<z.ZodNumber>;
            stderrBytes: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
    }, z.core.$strict>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type V4ConversationWorkflowRunWorkspaceResult = z.infer<typeof v4ConversationWorkflowRunWorkspaceResultSchema>;
export declare const v4ConversationWorkflowRunNodeResultParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    runId: z.ZodString;
    siteId: z.ZodString;
    ordinal: z.ZodNumber;
    maxBytes: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type V4ConversationWorkflowRunNodeResultParams = z.infer<typeof v4ConversationWorkflowRunNodeResultParamsSchema>;
export declare const v4ConversationWorkflowRunNodeResultResultSchema: z.ZodObject<{
    status: z.ZodEnum<{
        running: "running";
        completed: "completed";
        failed: "failed";
    }>;
    result: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, z.core.$strict>>;
    truncated: z.ZodBoolean;
    totalBytes: z.ZodNumber;
}, z.core.$strict>;
export type V4ConversationWorkflowRunNodeResultResult = z.infer<typeof v4ConversationWorkflowRunNodeResultResultSchema>;
//# sourceMappingURL=workflow-workspace.d.ts.map