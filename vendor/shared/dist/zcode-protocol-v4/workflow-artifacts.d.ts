import { z } from "zod";
/**
 * 用户面产物的成员种类，= facade `artifact.*` 的六个成员。
 *
 * 两族：内容成员（`file` / `markdown`）有字节与版本历史；预置看板
 * （`chart` / `table` / `metrics` / `board`）没有字节，它的每一个点都是一条打了标签的
 * `report` journal 行（看板是 journal 的投影）。
 *
 * 闭集枚举。加值是**破坏性**的偏斜（旧读端整帧拒收），与 `workflowRuns[].status` 同一档。
 */
export declare const workflowRunArtifactKindSchema: z.ZodEnum<{
    file: "file";
    markdown: "markdown";
    chart: "chart";
    table: "table";
    metrics: "metrics";
    board: "board";
}>;
export type WorkflowRunArtifactKind = z.infer<typeof workflowRunArtifactKindSchema>;
/** 产物字段的展示上界。数字即契约——engine 侧的同名上限在 `ARTIFACT_CAPS`。 */
export declare const WORKFLOW_ARTIFACT_LIMITS: {
    readonly maxIdLength: 64;
    readonly maxTitleLength: 120;
    readonly maxDescriptionLength: 500;
    /** 每 id ≤ 16 版（`ARTIFACT_CAPS.maxVersionsPerArtifact`）。 */
    readonly maxVersions: 16;
    /** `workflowRunArtifactData` 一页的条目上界；`limit` 的钳制在网关侧。 */
    readonly maxItemsPerPage: 500;
    /** 一页的缺省条数（调用方不传 limit 时网关用它）。 */
    readonly defaultItemsPerPage: 200;
    /**
     * `workflowRunArtifactData` 一页的字节上界（按存储里的序列化字节计），由网关传给存储层。
     * 取协议单帧上限（16 MiB）的四分之一：条数上界单独管不住字节——500 条 × 32 KiB 就顶到了
     * 单帧上限，于是一页可能根本发不出去。一页至少带一条，所以单条的上限（`REPORT_CAPS`）
     * 必须远小于单帧上限。
     */
    readonly maxPageBytes: number;
    /** `workflowRunArtifactData` 一次最多点名几个字段路径（一张看板的 spec 用不到这么多）。 */
    readonly maxFieldsPerRequest: 32;
    /** 一个字段路径的最大长度。 */
    readonly maxFieldPathLength: 256;
    /**
     * 一个字段值的序列化字节上界。超过的值回成一段截短的字符串（前 1,000 个字符加「…」）：
     * 图表只用数值，表格与看板的格子本来就只显示短文本。
     */
    readonly maxFieldValueBytes: 4096;
};
/**
 * 按点路径从一条 report item 里取值："timing.after"、"rounds.0.ms"（docs/execution-engine.md
 * 「Reading the journal」）。
 *
 * 这是**协议上的契约**，不只是渲染器的工具函数：看板取数时 CLI 在 SQLite 里按同一套规则把
 * 字段取出来（adapters 的 dwf-journal-fields.ts），渲染器拿到的值必须与它自己从整条 item 里
 * 取出来的逐字相同。规则：按 `.` 切段；当前值是数组时，段按 `Number(段)` 当下标（非负整数且
 * 在界内才算）；是对象时按键取；走不通（null、标量、越界、缺键）得 `undefined`。
 */
export declare function readWorkflowArtifactField(item: unknown, path: string): unknown;
/**
 * 一个产物版本的**元数据**（journal `dwf_node.result_json` 上 `ArtifactVersionRecord` 的
 * zod 镜像）。字节不在这里——`uri` 指向 tool-artifact store，取字节走
 * `workflowRunArtifactRead`。
 *
 * `publishedAt` **必填**：driver 在每条记录上恒写 `Date.now()`（引擎
 * 自己没有时钟，所以纯包侧的 TS 类型仍是 optional）。这里必填是让「版本没有时刻」在协议
 * 边界上就红掉，而不是让 UI 的版本步进器拿到一个 undefined 去排序。
 */
export declare const workflowRunArtifactVersionSchema: z.ZodObject<{
    version: z.ZodNumber;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    contentType: z.ZodOptional<z.ZodString>;
    bytes: z.ZodOptional<z.ZodNumber>;
    uri: z.ZodOptional<z.ZodString>;
    sourcePath: z.ZodOptional<z.ZodString>;
    spec: z.ZodOptional<z.ZodUnknown>;
    publishedAt: z.ZodNumber;
    primary: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export type WorkflowRunArtifactVersion = z.infer<typeof workflowRunArtifactVersionSchema>;
/**
 * 一个产物的**全部**版本 + 喂给它的标签 report 计数。`workflowRunArtifacts` 查询的元素，
 * 也是冷恢复与中枢详情的 durable 读法。
 *
 * 顶层的 `title` / `description` / `contentType` / `sourcePath` / `spec` 取**最新版**的值：
 * 只关心「现在是什么」的读者不必自己翻 `versions`。与 contracts 的
 * `DynamicWorkflowRunArtifact` 同形（那边是 TS 镜像，这边是线上校验）。
 */
export declare const workflowRunArtifactSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<{
        file: "file";
        markdown: "markdown";
        chart: "chart";
        table: "table";
        metrics: "metrics";
        board: "board";
    }>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    contentType: z.ZodOptional<z.ZodString>;
    sourcePath: z.ZodOptional<z.ZodString>;
    spec: z.ZodOptional<z.ZodUnknown>;
    version: z.ZodNumber;
    versions: z.ZodArray<z.ZodObject<{
        version: z.ZodNumber;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        contentType: z.ZodOptional<z.ZodString>;
        bytes: z.ZodOptional<z.ZodNumber>;
        uri: z.ZodOptional<z.ZodString>;
        sourcePath: z.ZodOptional<z.ZodString>;
        spec: z.ZodOptional<z.ZodUnknown>;
        publishedAt: z.ZodNumber;
        primary: z.ZodOptional<z.ZodLiteral<true>>;
    }, z.core.$strict>>;
    itemCount: z.ZodNumber;
    primary: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export type WorkflowRunArtifact = z.infer<typeof workflowRunArtifactSchema>;
/**
 * `workflowRuns[].artifacts` 的元素：**只带最新版的元数据**。
 *
 * 刻意不带 `versions` / `spec` / `sourcePath` / `uri`，更不带字节或条目：这是一个高频状态键，
 * 而它的读者只需要知道「有哪些产物、现在是第几版、变了没有」。真要看内容，两条 query
 * （`workflowRunArtifacts` 取全量元数据、`workflowRunArtifactData` 取看板条目、
 * `workflowRunArtifactRead` 取字节）按需拉——权威始终在 journal。
 *
 * `itemCount` 在这里的职责是**刷新信号**：看板 hook 见它变化就带 `afterSequence` 增量取数。
 * 把标签 report 的原值放进这个高频状态键，一个 run 的条目有多少字节，每一帧就要搬多少字节。
 */
export declare const workflowRunArtifactSummarySchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<{
        file: "file";
        markdown: "markdown";
        chart: "chart";
        table: "table";
        metrics: "metrics";
        board: "board";
    }>;
    title: z.ZodOptional<z.ZodString>;
    version: z.ZodNumber;
    contentType: z.ZodOptional<z.ZodString>;
    bytes: z.ZodOptional<z.ZodNumber>;
    itemCount: z.ZodOptional<z.ZodNumber>;
    primary: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export type WorkflowRunArtifactSummary = z.infer<typeof workflowRunArtifactSummarySchema>;
export declare const v4ConversationWorkflowRunArtifactsParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    runId: z.ZodString;
}, z.core.$strict>;
export type V4ConversationWorkflowRunArtifactsParams = z.infer<typeof v4ConversationWorkflowRunArtifactsParamsSchema>;
export declare const v4ConversationWorkflowRunArtifactsResultSchema: z.ZodObject<{
    artifacts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            file: "file";
            markdown: "markdown";
            chart: "chart";
            table: "table";
            metrics: "metrics";
            board: "board";
        }>;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        contentType: z.ZodOptional<z.ZodString>;
        sourcePath: z.ZodOptional<z.ZodString>;
        spec: z.ZodOptional<z.ZodUnknown>;
        version: z.ZodNumber;
        versions: z.ZodArray<z.ZodObject<{
            version: z.ZodNumber;
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            contentType: z.ZodOptional<z.ZodString>;
            bytes: z.ZodOptional<z.ZodNumber>;
            uri: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodOptional<z.ZodString>;
            spec: z.ZodOptional<z.ZodUnknown>;
            publishedAt: z.ZodNumber;
            primary: z.ZodOptional<z.ZodLiteral<true>>;
        }, z.core.$strict>>;
        itemCount: z.ZodNumber;
        primary: z.ZodOptional<z.ZodLiteral<true>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type V4ConversationWorkflowRunArtifactsResult = z.infer<typeof v4ConversationWorkflowRunArtifactsResultSchema>;
export declare const v4ConversationWorkflowRunArtifactDataParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    runId: z.ZodString;
    artifactId: z.ZodString;
    afterSequence: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export type V4ConversationWorkflowRunArtifactDataParams = z.infer<typeof v4ConversationWorkflowRunArtifactDataParamsSchema>;
export declare const v4ConversationWorkflowRunArtifactDataResultSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        sequence: z.ZodNumber;
        siteId: z.ZodString;
        ordinal: z.ZodNumber;
        item: z.ZodUnknown;
        fields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>>;
    hasMore: z.ZodBoolean;
}, z.core.$strict>;
export type V4ConversationWorkflowRunArtifactDataResult = z.infer<typeof v4ConversationWorkflowRunArtifactDataResultSchema>;
export declare const v4ConversationWorkflowRunArtifactReadParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    runId: z.ZodString;
    artifactId: z.ZodString;
    version: z.ZodNumber;
    offset: z.ZodNumber;
    limit: z.ZodNumber;
}, z.core.$strict>;
export type V4ConversationWorkflowRunArtifactReadParams = z.infer<typeof v4ConversationWorkflowRunArtifactReadParamsSchema>;
export declare const v4ConversationWorkflowRunArtifactReadResultSchema: z.ZodObject<{
    dataBase64: z.ZodString;
    mediaType: z.ZodString;
    totalBytes: z.ZodNumber;
    nextOffset: z.ZodNullable<z.ZodNumber>;
}, z.core.$strict>;
export type V4ConversationWorkflowRunArtifactReadResult = z.infer<typeof v4ConversationWorkflowRunArtifactReadResultSchema>;
//# sourceMappingURL=workflow-artifacts.d.ts.map