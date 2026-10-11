import { z } from "zod";
import type { Locale } from "./protocol.js";
import { type ConversationRow } from "./zcode-protocol-v4/rows.js";
/**
 * 解析分享页 pathname，返回未解码的 code 段与该路径对应的语言。
 * 只认 `/share/<code>` 与 `/cn/share/<code>` 两种形状；调用方负责 code 的解码与安全校验。
 */
export declare function parseConversationSharePathname(pathname: string): {
    rawCode: string;
    locale: Locale;
} | null;
/**
 * 把分享链接改写到目标语言站点。
 *
 * 只在 pathname 精确匹配已知分享形状时改写，且只替换语言前缀、不碰 code 段
 * （避免 decode/encode 往返改变 code）。其它任何形状原样返回 —— 服务端将来若改用
 * 别的 URL 形状或独立域名，这里会安静地不作为，而不是改错。
 */
export declare function localizeConversationShareUrl(shareUrl: string, locale: Locale): string;
export declare const conversationShareAccessModeSchema: z.ZodEnum<{
    private: "private";
    public_readonly: "public_readonly";
    public_importable: "public_importable";
}>;
export type ConversationShareAccessMode = z.infer<typeof conversationShareAccessModeSchema>;
/**
 * 本端产出与理解的分享载荷版本。
 *
 * 只有 rows 的语义发生「不可跳过的」破坏性变化时才 bump（新增 row kind / enum 值不算——
 * 那些由 decodeConversationShareRows 逐行降级消化）。bump 一次就等于让所有存量客户端和
 * 所有已部署的落地页镜像同时看不了新分享，所以 bump 前必须先看存量版本占比。
 */
export declare const CONVERSATION_SHARE_SCHEMA_VERSION = 1;
/** 版本高于本端认知时不猜语义：调用方必须转成「请升级」而不是通用契约错误。 */
export declare function isConversationShareSchemaVersionSupported(version: number): boolean;
/**
 * 逐行解码公开投影 rows，认不出的行跳过并计数。
 *
 * 传输层刻意不理解 row 语义（wire 上 rows 是 unknown[]）：整份分享不能因为其中一行用了
 * 新 kind、新 enum 值或新 timelineMarker type 就打不开。一个机制覆盖这三种情况，因此
 * 也不需要给任何 enum 配 .catch(fallback)——猜错枚举语义比丢一行危险得多。
 *
 * 渲染链本来就容错（buildConversationTurnRenderUnits 把认不出的 kind 归入 assistantWork，
 * ConversationShareReadonlyTimeline 的 switch 认不出就不渲染），所以这里只需要不抛。
 * 计数交给调用方转成「部分内容需要更新 ZCode 查看」的软提示，不能静默。
 */
export declare function decodeConversationShareRows(rows: readonly unknown[]): {
    rows: ConversationRow[];
    unsupportedCount: number;
    unsupportedKinds: string[];
};
export declare const conversationShareSha256Schema: z.ZodString;
/**
 * 出站 descriptor（upload / confirm）：严格，用来抓自己的 bug。
 *
 * 出站严格、入站宽容是这份契约的通用纪律：我们发出去的东西多一个字段是我们的错，
 * 服务端回来的东西多一个字段是它的自由。
 */
export declare const conversationShareArtifactDescriptorSchema: z.ZodObject<{
    artifact_id: z.ZodString;
    logical_artifact_key: z.ZodString;
    producer_product_turn_id: z.ZodString;
    artifact_version: z.ZodNumber;
    state: z.ZodLiteral<"current">;
    ref: z.ZodString;
    artifact_type: z.ZodEnum<{
        text: "text";
        html: "html";
        image: "image";
        pdf: "pdf";
        pptx: "pptx";
        docx: "docx";
        xlsx: "xlsx";
        md: "md";
    }>;
    display_name: z.ZodString;
    original_path: z.ZodOptional<z.ZodString>;
    extension: z.ZodString;
    mime_type: z.ZodString;
    size_bytes: z.ZodNumber;
    sha256: z.ZodString;
}, z.core.$strict>;
export type ConversationShareArtifactDescriptor = z.infer<typeof conversationShareArtifactDescriptorSchema>;
/** 入站 descriptor（preview / continuation 回显）：允许服务端加字段。 */
export declare const conversationShareInboundArtifactDescriptorSchema: z.ZodObject<{
    artifact_id: z.ZodString;
    logical_artifact_key: z.ZodString;
    producer_product_turn_id: z.ZodString;
    artifact_version: z.ZodNumber;
    state: z.ZodLiteral<"current">;
    ref: z.ZodString;
    artifact_type: z.ZodEnum<{
        text: "text";
        html: "html";
        image: "image";
        pdf: "pdf";
        pptx: "pptx";
        docx: "docx";
        xlsx: "xlsx";
        md: "md";
    }>;
    display_name: z.ZodString;
    original_path: z.ZodOptional<z.ZodString>;
    extension: z.ZodString;
    mime_type: z.ZodString;
    size_bytes: z.ZodNumber;
    sha256: z.ZodString;
}, z.core.$strip>;
/**
 * 线上响应形状：非 strict，且 type / access mode 的取值向前兼容。
 *
 * access_modes 与 allowed_artifacts 同理：后端上线一种新访问模式，不能把老客户端的
 * 能力发现（即整个发布入口）打死。未知取值在 narrow 时丢弃——客户端选不出它不认识的模式。
 */
export declare const conversationShareCapabilitiesWireSchema: z.ZodObject<{
    schema_version: z.ZodNumber;
    access_modes: z.ZodArray<z.ZodString>;
    allowed_artifacts: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        extensions: z.ZodArray<z.ZodString>;
        mime_types: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
    ttl_ms: z.ZodNumber;
    max_rows: z.ZodNumber;
    max_payload_bytes: z.ZodNumber;
    max_artifact_count: z.ZodNumber;
    max_artifact_bytes: z.ZodNumber;
    max_total_artifact_bytes: z.ZodNumber;
}, z.core.$strip>;
export type ConversationShareCapabilitiesWire = z.infer<typeof conversationShareCapabilitiesWireSchema>;
/** narrow 之后的内部形状：取值已收窄到本端认识的枚举，可以继续严格。 */
export declare const conversationShareCapabilitiesDataSchema: z.ZodObject<{
    schema_version: z.ZodNumber;
    access_modes: z.ZodArray<z.ZodEnum<{
        private: "private";
        public_readonly: "public_readonly";
        public_importable: "public_importable";
    }>>;
    allowed_artifacts: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            text: "text";
            html: "html";
            image: "image";
            pdf: "pdf";
            pptx: "pptx";
            docx: "docx";
            xlsx: "xlsx";
            md: "md";
        }>;
        extensions: z.ZodArray<z.ZodString>;
        mime_types: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>;
    ttl_ms: z.ZodNumber;
    max_rows: z.ZodNumber;
    max_payload_bytes: z.ZodNumber;
    max_artifact_count: z.ZodNumber;
    max_artifact_bytes: z.ZodNumber;
    max_total_artifact_bytes: z.ZodNumber;
}, z.core.$strict>;
export type ConversationShareCapabilities = z.infer<typeof conversationShareCapabilitiesDataSchema>;
/**
 * 丢弃客户端不认识的结果物类型与访问模式，并把被丢弃的取值回报给调用方做日志。
 *
 * 注意丢弃只对「客户端确实产不出/选不出的取值」无损。一旦本地能把某个可上传扩展名抽成
 * 预览候选（见 conversation-preview-artifacts 的 PREVIEW_FILE_TYPES），却没有把对应类型加进
 * conversationArtifactTypeSchema，这里就会把服务端明明允许的类型削掉，然后拿被削过的白名单
 * 反过来告诉用户「该类型不支持」——md 曾经就是这样被误判的。video/audio 是只用于内部预览
 * warning 的明确例外，不应加入可上传 artifact 枚举。
 */
export declare function narrowConversationShareCapabilities(wire: ConversationShareCapabilitiesWire): {
    capabilities: ConversationShareCapabilities;
    unsupportedArtifactTypes: string[];
    unsupportedAccessModes: string[];
};
export declare const conversationShareConfirmDataSchema: z.ZodObject<{
    share_code: z.ZodString;
    share_url: z.ZodString;
    access_mode: z.ZodEnum<{
        private: "private";
        public_readonly: "public_readonly";
        public_importable: "public_importable";
    }>;
    expires_at: z.ZodNumber;
}, z.core.$strip>;
export type ConversationShareRecord = z.infer<typeof conversationShareConfirmDataSchema>;
export declare const conversationSharePreparationRequestSchema: z.ZodObject<{
    client_request_id: z.ZodString;
    title: z.ZodString;
    schema_version: z.ZodLiteral<1>;
    access_mode: z.ZodEnum<{
        private: "private";
        public_readonly: "public_readonly";
        public_importable: "public_importable";
    }>;
    payload_sha256: z.ZodString;
    artifact_count: z.ZodNumber;
}, z.core.$strict>;
export type ConversationSharePreparationRequest = z.infer<typeof conversationSharePreparationRequestSchema>;
export declare const conversationSharePreparationDataSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    status: z.ZodLiteral<"preparing">;
    preparation_id: z.ZodString;
    access_mode: z.ZodEnum<{
        private: "private";
        public_readonly: "public_readonly";
        public_importable: "public_importable";
    }>;
    expires_at: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    status: z.ZodLiteral<"confirmed">;
    share: z.ZodObject<{
        share_code: z.ZodString;
        share_url: z.ZodString;
        access_mode: z.ZodEnum<{
            private: "private";
            public_readonly: "public_readonly";
            public_importable: "public_importable";
        }>;
        expires_at: z.ZodNumber;
    }, z.core.$strip>;
    preparation_id: z.ZodString;
    access_mode: z.ZodEnum<{
        private: "private";
        public_readonly: "public_readonly";
        public_importable: "public_importable";
    }>;
    expires_at: z.ZodNumber;
}, z.core.$strip>], "status">;
export type ConversationSharePreparation = z.infer<typeof conversationSharePreparationDataSchema>;
export declare const conversationShareArtifactUploadDataSchema: z.ZodObject<{
    artifact_id: z.ZodString;
    size_bytes: z.ZodNumber;
    sha256: z.ZodString;
    status: z.ZodLiteral<"uploaded">;
    safety_status: z.ZodString;
}, z.core.$strip>;
export type ConversationShareArtifactUpload = z.infer<typeof conversationShareArtifactUploadDataSchema>;
/** 入站 integrity：非 strict，服务端将来多带一个摘要字段不该打死响应。 */
export declare const conversationShareIntegritySchema: z.ZodObject<{
    projection_sha256: z.ZodString;
    artifact_set_sha256: z.ZodString;
}, z.core.$strip>;
export type ConversationShareIntegrity = z.infer<typeof conversationShareIntegritySchema>;
export declare const conversationShareConfirmRequestSchema: z.ZodObject<{
    selected_product_turn_ids: z.ZodArray<z.ZodString>;
    projection: z.ZodObject<{
        rows: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"turnHeader">;
            origin: z.ZodEnum<{
                userInput: "userInput";
                backgroundResult: "backgroundResult";
                goalContinuation: "goalContinuation";
                editRerun: "editRerun";
                workflowLaunch: "workflowLaunch";
            }>;
            executionKind: z.ZodOptional<z.ZodEnum<{
                agent: "agent";
                controlOnly: "controlOnly";
            }>>;
            sourceCommandId: z.ZodOptional<z.ZodString>;
            historyRoundCount: z.ZodOptional<z.ZodNumber>;
            state: z.ZodEnum<{
                running: "running";
                failed: "failed";
                completedSuccess: "completedSuccess";
                completedInterrupted: "completedInterrupted";
            }>;
            startedAt: z.ZodNumber;
            endedAt: z.ZodOptional<z.ZodNumber>;
            activeMs: z.ZodOptional<z.ZodNumber>;
            outputTokens: z.ZodOptional<z.ZodNumber>;
            modelDurationMs: z.ZodOptional<z.ZodNumber>;
            toolDurationMs: z.ZodOptional<z.ZodNumber>;
            otherDurationMs: z.ZodOptional<z.ZodNumber>;
            workSegments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                segmentId: z.ZodString;
                triggerEntityId: z.ZodOptional<z.ZodString>;
                startedAt: z.ZodNumber;
                endedAt: z.ZodOptional<z.ZodNumber>;
                activeMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>>;
            originMeta: z.ZodOptional<z.ZodObject<{
                backgroundSource: z.ZodEnum<{
                    bash: "bash";
                    subagent: "subagent";
                    workflow: "workflow";
                }>;
                workId: z.ZodString;
                title: z.ZodString;
                workflowNotification: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"terminal">;
                    status: z.ZodEnum<{
                        completed: "completed";
                        stopped: "stopped";
                        errored: "errored";
                    }>;
                    stopReason: z.ZodOptional<z.ZodEnum<{
                        interrupted: "interrupted";
                        model: "model";
                        user: "user";
                        provider: "provider";
                        superseded: "superseded";
                    }>>;
                    summary: z.ZodString;
                    result: z.ZodOptional<z.ZodString>;
                    resultForm: z.ZodOptional<z.ZodEnum<{
                        prose: "prose";
                        json: "json";
                    }>>;
                    resultTruncated: z.ZodOptional<z.ZodLiteral<true>>;
                    error: z.ZodOptional<z.ZodString>;
                    reports: z.ZodOptional<z.ZodObject<{
                        count: z.ZodNumber;
                        shown: z.ZodNumber;
                        preview: z.ZodArray<z.ZodString>;
                    }, z.core.$strip>>;
                    artifacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
                        primary: z.ZodOptional<z.ZodLiteral<true>>;
                        description: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>>;
                    artifactsTruncated: z.ZodOptional<z.ZodLiteral<true>>;
                    durationMs: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"escalation">;
                    qid: z.ZodString;
                    actor: z.ZodString;
                    question: z.ZodString;
                    context: z.ZodOptional<z.ZodString>;
                    askedAt: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"hole">;
                    siteId: z.ZodString;
                    ordinal: z.ZodNumber;
                    name: z.ZodString;
                    type: z.ZodString;
                    prompt: z.ZodOptional<z.ZodString>;
                    draftPath: z.ZodOptional<z.ZodString>;
                    line: z.ZodOptional<z.ZodNumber>;
                    before: z.ZodOptional<z.ZodString>;
                    after: z.ZodOptional<z.ZodString>;
                    reachedAt: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"stall">;
                    sinceMs: z.ZodNumber;
                    reason: z.ZodOptional<z.ZodString>;
                    cap: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>], "kind">>;
            }, z.core.$strip>>;
            workflowLaunch: z.ZodOptional<z.ZodObject<{
                runId: z.ZodString;
                toolCallId: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                scope: z.ZodOptional<z.ZodEnum<{
                    project: "project";
                    global: "global";
                }>>;
                path: z.ZodOptional<z.ZodString>;
                args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                description: z.ZodOptional<z.ZodString>;
                display: z.ZodCatch<z.ZodOptional<z.ZodObject<{
                    kind: z.ZodLiteral<"create_workflow">;
                    ok: z.ZodBoolean;
                    errorCount: z.ZodNumber;
                    diagnostics: z.ZodArray<z.ZodObject<{
                        line: z.ZodNumber;
                        column: z.ZodNumber;
                        code: z.ZodNumber;
                        message: z.ZodString;
                    }, z.core.$strict>>;
                    causalityGraph: z.ZodOptional<z.ZodObject<{
                        steps: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            kind: z.ZodEnum<{
                                ask: "ask";
                                "world-read": "world-read";
                                hole: "hole";
                            }>;
                            label: z.ZodString;
                            labelPattern: z.ZodOptional<z.ZodObject<{
                                head: z.ZodOptional<z.ZodString>;
                                tail: z.ZodOptional<z.ZodString>;
                            }, z.core.$strict>>;
                            line: z.ZodOptional<z.ZodNumber>;
                            column: z.ZodOptional<z.ZodNumber>;
                            lane: z.ZodString;
                            lanes: z.ZodOptional<z.ZodArray<z.ZodString>>;
                            source: z.ZodOptional<z.ZodString>;
                            phase: z.ZodOptional<z.ZodString>;
                            repeat: z.ZodOptional<z.ZodEnum<{
                                stack: "stack";
                                serial: "serial";
                            }>>;
                            fill: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        lanes: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            name: z.ZodOptional<z.ZodString>;
                            namePattern: z.ZodOptional<z.ZodObject<{
                                head: z.ZodOptional<z.ZodString>;
                                tail: z.ZodOptional<z.ZodString>;
                            }, z.core.$strict>>;
                            line: z.ZodOptional<z.ZodNumber>;
                            column: z.ZodOptional<z.ZodNumber>;
                        }, z.core.$strict>>;
                        participants: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            phase: z.ZodString;
                            lane: z.ZodString;
                            steps: z.ZodArray<z.ZodString>;
                            member: z.ZodOptional<z.ZodObject<{
                                index: z.ZodNumber;
                                of: z.ZodNumber;
                            }, z.core.$strict>>;
                            many: z.ZodOptional<z.ZodLiteral<true>>;
                        }, z.core.$strict>>;
                        handoffs: z.ZodArray<z.ZodObject<{
                            from: z.ZodString;
                            to: z.ZodString;
                            back: z.ZodOptional<z.ZodLiteral<true>>;
                            types: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        }, z.core.$strict>>;
                        phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            name: z.ZodOptional<z.ZodString>;
                            line: z.ZodOptional<z.ZodNumber>;
                            column: z.ZodOptional<z.ZodNumber>;
                            alongside: z.ZodOptional<z.ZodArray<z.ZodString>>;
                            fill: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>>;
                        phaseEdges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            from: z.ZodString;
                            to: z.ZodString;
                            back: z.ZodOptional<z.ZodLiteral<true>>;
                        }, z.core.$strict>>>;
                        phaseStreams: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            from: z.ZodString;
                            to: z.ZodString;
                        }, z.core.$strict>>>;
                        holes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            siteId: z.ZodString;
                            name: z.ZodString;
                            type: z.ZodString;
                            phase: z.ZodOptional<z.ZodString>;
                            tail: z.ZodOptional<z.ZodBoolean>;
                        }, z.core.$strict>>>;
                        exits: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        sink: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        truncated: z.ZodOptional<z.ZodBoolean>;
                    }, z.core.$strict>>;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                    fill: z.ZodOptional<z.ZodObject<{
                        siteId: z.ZodString;
                        name: z.ZodString;
                        draftPath: z.ZodOptional<z.ZodString>;
                        line: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>>;
                script: z.ZodOptional<z.ZodString>;
                amend: z.ZodOptional<z.ZodObject<{
                    predecessorRunId: z.ZodOptional<z.ZodString>;
                    subagentModel: z.ZodOptional<z.ZodObject<{
                        from: z.ZodOptional<z.ZodString>;
                        to: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    maxConcurrency: z.ZodOptional<z.ZodObject<{
                        from: z.ZodOptional<z.ZodNumber>;
                        to: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strip>>;
                    ceiling: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            fileChanges: z.ZodOptional<z.ZodObject<{
                additions: z.ZodNumber;
                deletions: z.ZodNumber;
                files: z.ZodNumber;
                state: z.ZodOptional<z.ZodEnum<{
                    active: "active";
                    reverted: "reverted";
                }>>;
            }, z.core.$strip>>;
            rowId: z.ZodNumber;
            turnId: z.ZodString;
            entityId: z.ZodOptional<z.ZodString>;
            productTurnId: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodLiteral<"visible">>;
            createdAt: z.ZodNumber;
            createdAtSeq: z.ZodNumber;
            actions: z.ZodOptional<z.ZodObject<{
                canFork: z.ZodOptional<z.ZodLiteral<true>>;
                canEdit: z.ZodOptional<z.ZodLiteral<true>>;
                canRetry: z.ZodOptional<z.ZodLiteral<true>>;
                canRewindFiles: z.ZodOptional<z.ZodLiteral<true>>;
                editDisposition: z.ZodOptional<z.ZodEnum<{
                    fork: "fork";
                    rewind: "rewind";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"userInput">;
            inputOrigin: z.ZodOptional<z.ZodEnum<{
                desktop: "desktop";
                mobile: "mobile";
            }>>;
            botGroupSource: z.ZodOptional<z.ZodObject<{
                botIdentity: z.ZodOptional<z.ZodObject<{
                    name: z.ZodString;
                    openId: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                appId: z.ZodOptional<z.ZodString>;
                contentParts: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                    type: z.ZodLiteral<"text">;
                    text: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    type: z.ZodLiteral<"channelMention">;
                    refId: z.ZodString;
                    name: z.ZodString;
                    channel: z.ZodEnum<{
                        feishu: "feishu";
                        lark: "lark";
                    }>;
                    targetId: z.ZodString;
                    idType: z.ZodLiteral<"open_id">;
                    entityType: z.ZodEnum<{
                        unknown: "unknown";
                        user: "user";
                        bot: "bot";
                    }>;
                }, z.core.$strict>]>>>;
                authorizationId: z.ZodOptional<z.ZodString>;
                botId: z.ZodString;
                provider: z.ZodEnum<{
                    feishu: "feishu";
                    lark: "lark";
                }>;
                chatId: z.ZodString;
                threadId: z.ZodOptional<z.ZodString>;
                rootMessageId: z.ZodOptional<z.ZodString>;
                senderId: z.ZodString;
                senderName: z.ZodString;
                mentionedBot: z.ZodOptional<z.ZodBoolean>;
                messageId: z.ZodString;
                messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    contentParts: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                        type: z.ZodLiteral<"text">;
                        text: z.ZodString;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"channelMention">;
                        refId: z.ZodString;
                        name: z.ZodString;
                        channel: z.ZodEnum<{
                            feishu: "feishu";
                            lark: "lark";
                        }>;
                        targetId: z.ZodString;
                        idType: z.ZodLiteral<"open_id">;
                        entityType: z.ZodEnum<{
                            unknown: "unknown";
                            user: "user";
                            bot: "bot";
                        }>;
                    }, z.core.$strict>]>>>;
                    messageId: z.ZodString;
                    senderId: z.ZodString;
                    senderName: z.ZodString;
                    mentionedBot: z.ZodOptional<z.ZodBoolean>;
                    text: z.ZodString;
                    conversationQuotes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        text: z.ZodString;
                        path: z.ZodOptional<z.ZodString>;
                        senderName: z.ZodOptional<z.ZodString>;
                        senderId: z.ZodOptional<z.ZodString>;
                        messageId: z.ZodOptional<z.ZodString>;
                        sentAt: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>>;
                    attachmentIndexes: z.ZodArray<z.ZodNumber>;
                }, z.core.$strict>>>;
                topicContext: z.ZodOptional<z.ZodObject<{
                    messages: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        chatId: z.ZodString;
                        threadId: z.ZodString;
                        senderId: z.ZodString;
                        senderName: z.ZodOptional<z.ZodString>;
                        parentId: z.ZodOptional<z.ZodString>;
                        attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            name: z.ZodString;
                            kind: z.ZodString;
                        }, z.core.$strict>>>;
                        senderType: z.ZodEnum<{
                            app: "app";
                            user: "user";
                        }>;
                        text: z.ZodString;
                        createdAt: z.ZodNumber;
                        kind: z.ZodString;
                        controlCard: z.ZodOptional<z.ZodBoolean>;
                        deleted: z.ZodOptional<z.ZodBoolean>;
                    }, z.core.$strict>>;
                    checkpoint: z.ZodString;
                    hasGap: z.ZodBoolean;
                }, z.core.$strict>>;
                topicHistory: z.ZodOptional<z.ZodObject<{
                    checkpoint: z.ZodString;
                    hasGap: z.ZodBoolean;
                    messageCount: z.ZodNumber;
                    resourceMessages: z.ZodArray<z.ZodObject<{
                        messageId: z.ZodString;
                        count: z.ZodNumber;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            conversationQuotes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                text: z.ZodString;
                path: z.ZodOptional<z.ZodString>;
                senderName: z.ZodOptional<z.ZodString>;
                senderId: z.ZodOptional<z.ZodString>;
                messageId: z.ZodOptional<z.ZodString>;
                sentAt: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
            text: z.ZodString;
            epilogueStart: z.ZodOptional<z.ZodNumber>;
            origin: z.ZodEnum<{
                synthetic: "synthetic";
                backgroundResult: "backgroundResult";
                goalContinuation: "goalContinuation";
                workflowLaunch: "workflowLaunch";
                realUser: "realUser";
                mailbox: "mailbox";
            }>;
            originMeta: z.ZodOptional<z.ZodObject<{
                backgroundSource: z.ZodOptional<z.ZodEnum<{
                    bash: "bash";
                    subagent: "subagent";
                    workflow: "workflow";
                }>>;
                workId: z.ZodOptional<z.ZodString>;
                senderSessionId: z.ZodOptional<z.ZodString>;
                senderLabel: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            workflowLaunch: z.ZodOptional<z.ZodObject<{
                runId: z.ZodString;
                toolCallId: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                scope: z.ZodOptional<z.ZodEnum<{
                    project: "project";
                    global: "global";
                }>>;
                path: z.ZodOptional<z.ZodString>;
                args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                description: z.ZodOptional<z.ZodString>;
                display: z.ZodCatch<z.ZodOptional<z.ZodObject<{
                    kind: z.ZodLiteral<"create_workflow">;
                    ok: z.ZodBoolean;
                    errorCount: z.ZodNumber;
                    diagnostics: z.ZodArray<z.ZodObject<{
                        line: z.ZodNumber;
                        column: z.ZodNumber;
                        code: z.ZodNumber;
                        message: z.ZodString;
                    }, z.core.$strict>>;
                    causalityGraph: z.ZodOptional<z.ZodObject<{
                        steps: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            kind: z.ZodEnum<{
                                ask: "ask";
                                "world-read": "world-read";
                                hole: "hole";
                            }>;
                            label: z.ZodString;
                            labelPattern: z.ZodOptional<z.ZodObject<{
                                head: z.ZodOptional<z.ZodString>;
                                tail: z.ZodOptional<z.ZodString>;
                            }, z.core.$strict>>;
                            line: z.ZodOptional<z.ZodNumber>;
                            column: z.ZodOptional<z.ZodNumber>;
                            lane: z.ZodString;
                            lanes: z.ZodOptional<z.ZodArray<z.ZodString>>;
                            source: z.ZodOptional<z.ZodString>;
                            phase: z.ZodOptional<z.ZodString>;
                            repeat: z.ZodOptional<z.ZodEnum<{
                                stack: "stack";
                                serial: "serial";
                            }>>;
                            fill: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        lanes: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            name: z.ZodOptional<z.ZodString>;
                            namePattern: z.ZodOptional<z.ZodObject<{
                                head: z.ZodOptional<z.ZodString>;
                                tail: z.ZodOptional<z.ZodString>;
                            }, z.core.$strict>>;
                            line: z.ZodOptional<z.ZodNumber>;
                            column: z.ZodOptional<z.ZodNumber>;
                        }, z.core.$strict>>;
                        participants: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            phase: z.ZodString;
                            lane: z.ZodString;
                            steps: z.ZodArray<z.ZodString>;
                            member: z.ZodOptional<z.ZodObject<{
                                index: z.ZodNumber;
                                of: z.ZodNumber;
                            }, z.core.$strict>>;
                            many: z.ZodOptional<z.ZodLiteral<true>>;
                        }, z.core.$strict>>;
                        handoffs: z.ZodArray<z.ZodObject<{
                            from: z.ZodString;
                            to: z.ZodString;
                            back: z.ZodOptional<z.ZodLiteral<true>>;
                            types: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        }, z.core.$strict>>;
                        phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            name: z.ZodOptional<z.ZodString>;
                            line: z.ZodOptional<z.ZodNumber>;
                            column: z.ZodOptional<z.ZodNumber>;
                            alongside: z.ZodOptional<z.ZodArray<z.ZodString>>;
                            fill: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>>;
                        phaseEdges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            from: z.ZodString;
                            to: z.ZodString;
                            back: z.ZodOptional<z.ZodLiteral<true>>;
                        }, z.core.$strict>>>;
                        phaseStreams: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            from: z.ZodString;
                            to: z.ZodString;
                        }, z.core.$strict>>>;
                        holes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            siteId: z.ZodString;
                            name: z.ZodString;
                            type: z.ZodString;
                            phase: z.ZodOptional<z.ZodString>;
                            tail: z.ZodOptional<z.ZodBoolean>;
                        }, z.core.$strict>>>;
                        exits: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        sink: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        truncated: z.ZodOptional<z.ZodBoolean>;
                    }, z.core.$strict>>;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                    fill: z.ZodOptional<z.ZodObject<{
                        siteId: z.ZodString;
                        name: z.ZodString;
                        draftPath: z.ZodOptional<z.ZodString>;
                        line: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>>;
                script: z.ZodOptional<z.ZodString>;
                amend: z.ZodOptional<z.ZodObject<{
                    predecessorRunId: z.ZodOptional<z.ZodString>;
                    subagentModel: z.ZodOptional<z.ZodObject<{
                        from: z.ZodOptional<z.ZodString>;
                        to: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    maxConcurrency: z.ZodOptional<z.ZodObject<{
                        from: z.ZodOptional<z.ZodNumber>;
                        to: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strip>>;
                    ceiling: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            guided: z.ZodOptional<z.ZodLiteral<true>>;
            sourceCommandId: z.ZodOptional<z.ZodString>;
            rootSourceCommandId: z.ZodOptional<z.ZodString>;
            clientId: z.ZodOptional<z.ZodString>;
            highspeed: z.ZodOptional<z.ZodObject<{
                schemaVersion: z.ZodLiteral<1>;
                cardId: z.ZodString;
                taskId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                issuedAt: z.ZodNumber;
                expiresAt: z.ZodNumber;
                regularTps: z.ZodOptional<z.ZodNumber>;
                outputTokens: z.ZodOptional<z.ZodNumber>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                highspeedTps: z.ZodOptional<z.ZodNumber>;
                savedDurationMs: z.ZodOptional<z.ZodNumber>;
                modelDurationMs: z.ZodOptional<z.ZodNumber>;
                toolDurationMs: z.ZodOptional<z.ZodNumber>;
                otherDurationMs: z.ZodOptional<z.ZodNumber>;
                fallbackAt: z.ZodOptional<z.ZodNumber>;
                fallbackReason: z.ZodOptional<z.ZodEnum<{
                    highspeed_card_expired: "highspeed_card_expired";
                    highspeed_request_failed: "highspeed_request_failed";
                }>>;
            }, z.core.$strict>>;
            attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                ref: z.ZodString;
                fileName: z.ZodString;
                mime: z.ZodString;
                bytes: z.ZodNumber;
                sourceKind: z.ZodOptional<z.ZodEnum<{
                    "clipboard-text": "clipboard-text";
                    "topic-history": "topic-history";
                }>>;
                messageCount: z.ZodOptional<z.ZodNumber>;
                previewRef: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>>;
            source: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"pluginUi">;
                pluginId: z.ZodString;
                toolCallId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"genUi">;
                path: z.ZodString;
                title: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>], "kind">>;
            rowId: z.ZodNumber;
            turnId: z.ZodString;
            entityId: z.ZodOptional<z.ZodString>;
            productTurnId: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodLiteral<"visible">>;
            createdAt: z.ZodNumber;
            createdAtSeq: z.ZodNumber;
            actions: z.ZodOptional<z.ZodObject<{
                canFork: z.ZodOptional<z.ZodLiteral<true>>;
                canEdit: z.ZodOptional<z.ZodLiteral<true>>;
                canRetry: z.ZodOptional<z.ZodLiteral<true>>;
                canRewindFiles: z.ZodOptional<z.ZodLiteral<true>>;
                editDisposition: z.ZodOptional<z.ZodEnum<{
                    fork: "fork";
                    rewind: "rewind";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"assistantText">;
            assistantResponseId: z.ZodOptional<z.ZodString>;
            text: z.ZodString;
            state: z.ZodEnum<{
                streaming: "streaming";
                interrupted: "interrupted";
                failed: "failed";
                complete: "complete";
            }>;
            model: z.ZodOptional<z.ZodString>;
            feedback: z.ZodOptional<z.ZodEnum<{
                like: "like";
                dislike: "dislike";
            }>>;
            rowId: z.ZodNumber;
            turnId: z.ZodString;
            entityId: z.ZodOptional<z.ZodString>;
            productTurnId: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodLiteral<"visible">>;
            createdAt: z.ZodNumber;
            createdAtSeq: z.ZodNumber;
            actions: z.ZodOptional<z.ZodObject<{
                canFork: z.ZodOptional<z.ZodLiteral<true>>;
                canEdit: z.ZodOptional<z.ZodLiteral<true>>;
                canRetry: z.ZodOptional<z.ZodLiteral<true>>;
                canRewindFiles: z.ZodOptional<z.ZodLiteral<true>>;
                editDisposition: z.ZodOptional<z.ZodEnum<{
                    fork: "fork";
                    rewind: "rewind";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"reasoning">;
            assistantResponseId: z.ZodOptional<z.ZodString>;
            text: z.ZodString;
            state: z.ZodEnum<{
                streaming: "streaming";
                interrupted: "interrupted";
                complete: "complete";
            }>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            rowId: z.ZodNumber;
            turnId: z.ZodString;
            entityId: z.ZodOptional<z.ZodString>;
            productTurnId: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodLiteral<"visible">>;
            createdAt: z.ZodNumber;
            createdAtSeq: z.ZodNumber;
            actions: z.ZodOptional<z.ZodObject<{
                canFork: z.ZodOptional<z.ZodLiteral<true>>;
                canEdit: z.ZodOptional<z.ZodLiteral<true>>;
                canRetry: z.ZodOptional<z.ZodLiteral<true>>;
                canRewindFiles: z.ZodOptional<z.ZodLiteral<true>>;
                editDisposition: z.ZodOptional<z.ZodEnum<{
                    fork: "fork";
                    rewind: "rewind";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"toolCall">;
            assistantResponseId: z.ZodOptional<z.ZodString>;
            toolCallId: z.ZodString;
            toolName: z.ZodString;
            status: z.ZodEnum<{
                running: "running";
                success: "success";
                error: "error";
                cancelled: "cancelled";
                inputStreaming: "inputStreaming";
                pendingApproval: "pendingApproval";
            }>;
            inputText: z.ZodString;
            input: z.ZodOptional<z.ZodUnknown>;
            cuaApp: z.ZodOptional<z.ZodObject<{
                pid: z.ZodNumber;
                name: z.ZodString;
                bundleId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            output: z.ZodOptional<z.ZodObject<{
                text: z.ZodString;
                display: z.ZodCatch<z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"bash_output">;
                    output: z.ZodString;
                    truncated: z.ZodBoolean;
                    outputPath: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"file_diff">;
                    filePath: z.ZodString;
                    additions: z.ZodNumber;
                    deletions: z.ZodNumber;
                    structuredPatch: z.ZodArray<z.ZodObject<{
                        oldStart: z.ZodNumber;
                        oldLines: z.ZodNumber;
                        newStart: z.ZodNumber;
                        newLines: z.ZodNumber;
                        lines: z.ZodArray<z.ZodString>;
                    }, z.core.$strip>>;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"local_agent_message">;
                    status: z.ZodEnum<{
                        failed: "failed";
                        success: "success";
                    }>;
                    error: z.ZodOptional<z.ZodString>;
                    message: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"task_stop">;
                    taskId: z.ZodString;
                    taskType: z.ZodString;
                    command: z.ZodOptional<z.ZodString>;
                    message: z.ZodString;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"task_output">;
                    retrievalStatus: z.ZodEnum<{
                        success: "success";
                        timeout: "timeout";
                        not_ready: "not_ready";
                    }>;
                    taskStatus: z.ZodOptional<z.ZodString>;
                    output: z.ZodOptional<z.ZodString>;
                    truncated: z.ZodOptional<z.ZodLiteral<true>>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"respond_to_coordinator">;
                    status: z.ZodEnum<{
                        failed: "failed";
                        success: "success";
                    }>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"cua">;
                    schemaVersion: z.ZodLiteral<1>;
                    toolName: z.ZodString;
                    status: z.ZodEnum<{
                        failed: "failed";
                        success: "success";
                    }>;
                    input: z.ZodOptional<z.ZodString>;
                    structuredContent: z.ZodOptional<z.ZodString>;
                    text: z.ZodOptional<z.ZodString>;
                    errorCode: z.ZodOptional<z.ZodString>;
                    suggestedAction: z.ZodOptional<z.ZodString>;
                    permissionStatus: z.ZodOptional<z.ZodObject<{
                        schemaVersion: z.ZodLiteral<1>;
                        platform: z.ZodLiteral<"darwin">;
                        grantOwner: z.ZodString;
                        accessibility: z.ZodEnum<{
                            granted: "granted";
                            stale: "stale";
                            denied: "denied";
                        }>;
                        screenRecording: z.ZodEnum<{
                            unknown: "unknown";
                            granted: "granted";
                            denied: "denied";
                        }>;
                    }, z.core.$strict>>;
                    targetApp: z.ZodOptional<z.ZodObject<{
                        schemaVersion: z.ZodLiteral<1>;
                        displayName: z.ZodOptional<z.ZodString>;
                        iconLocators: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                            kind: z.ZodLiteral<"darwin-bundle-id">;
                            value: z.ZodString;
                        }, z.core.$strict>, z.ZodObject<{
                            kind: z.ZodLiteral<"windows-executable-path">;
                            value: z.ZodString;
                        }, z.core.$strict>, z.ZodObject<{
                            kind: z.ZodLiteral<"windows-aumid">;
                            value: z.ZodString;
                        }, z.core.$strict>], "kind">>;
                    }, z.core.$strict>>;
                    media: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        mimeType: z.ZodString;
                        data: z.ZodOptional<z.ZodString>;
                        artifactUri: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>>;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"mcp_tool">;
                    serverName: z.ZodString;
                    toolName: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    unavailable: z.ZodOptional<z.ZodObject<{
                        code: z.ZodEnum<{
                            quota_exceeded: "quota_exceeded";
                            coding_plan_required: "coding_plan_required";
                        }>;
                    }, z.core.$strict>>;
                    ui: z.ZodOptional<z.ZodObject<{
                        pluginId: z.ZodString;
                        resourceUri: z.ZodString;
                        preferredDisplayMode: z.ZodOptional<z.ZodEnum<{
                            inline: "inline";
                            fullscreen: "fullscreen";
                            pip: "pip";
                        }>>;
                        prefersBorder: z.ZodOptional<z.ZodBoolean>;
                        csp: z.ZodOptional<z.ZodObject<{
                            connectDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
                            resourceDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
                            frameDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
                            baseUriDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        }, z.core.$strict>>;
                        structuredContent: z.ZodOptional<z.ZodString>;
                        widgetMeta: z.ZodOptional<z.ZodString>;
                        content: z.ZodOptional<z.ZodString>;
                        truncated: z.ZodOptional<z.ZodBoolean>;
                        truncatedBytes: z.ZodOptional<z.ZodNumber>;
                        isError: z.ZodOptional<z.ZodLiteral<true>>;
                        showInline: z.ZodOptional<z.ZodLiteral<true>>;
                        surface: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"create_workflow">;
                    ok: z.ZodBoolean;
                    errorCount: z.ZodNumber;
                    diagnostics: z.ZodArray<z.ZodObject<{
                        line: z.ZodNumber;
                        column: z.ZodNumber;
                        code: z.ZodNumber;
                        message: z.ZodString;
                    }, z.core.$strict>>;
                    causalityGraph: z.ZodOptional<z.ZodObject<{
                        steps: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            kind: z.ZodEnum<{
                                ask: "ask";
                                "world-read": "world-read";
                                hole: "hole";
                            }>;
                            label: z.ZodString;
                            labelPattern: z.ZodOptional<z.ZodObject<{
                                head: z.ZodOptional<z.ZodString>;
                                tail: z.ZodOptional<z.ZodString>;
                            }, z.core.$strict>>;
                            line: z.ZodOptional<z.ZodNumber>;
                            column: z.ZodOptional<z.ZodNumber>;
                            lane: z.ZodString;
                            lanes: z.ZodOptional<z.ZodArray<z.ZodString>>;
                            source: z.ZodOptional<z.ZodString>;
                            phase: z.ZodOptional<z.ZodString>;
                            repeat: z.ZodOptional<z.ZodEnum<{
                                stack: "stack";
                                serial: "serial";
                            }>>;
                            fill: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        lanes: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            name: z.ZodOptional<z.ZodString>;
                            namePattern: z.ZodOptional<z.ZodObject<{
                                head: z.ZodOptional<z.ZodString>;
                                tail: z.ZodOptional<z.ZodString>;
                            }, z.core.$strict>>;
                            line: z.ZodOptional<z.ZodNumber>;
                            column: z.ZodOptional<z.ZodNumber>;
                        }, z.core.$strict>>;
                        participants: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            phase: z.ZodString;
                            lane: z.ZodString;
                            steps: z.ZodArray<z.ZodString>;
                            member: z.ZodOptional<z.ZodObject<{
                                index: z.ZodNumber;
                                of: z.ZodNumber;
                            }, z.core.$strict>>;
                            many: z.ZodOptional<z.ZodLiteral<true>>;
                        }, z.core.$strict>>;
                        handoffs: z.ZodArray<z.ZodObject<{
                            from: z.ZodString;
                            to: z.ZodString;
                            back: z.ZodOptional<z.ZodLiteral<true>>;
                            types: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        }, z.core.$strict>>;
                        phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            name: z.ZodOptional<z.ZodString>;
                            line: z.ZodOptional<z.ZodNumber>;
                            column: z.ZodOptional<z.ZodNumber>;
                            alongside: z.ZodOptional<z.ZodArray<z.ZodString>>;
                            fill: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>>;
                        phaseEdges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            from: z.ZodString;
                            to: z.ZodString;
                            back: z.ZodOptional<z.ZodLiteral<true>>;
                        }, z.core.$strict>>>;
                        phaseStreams: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            from: z.ZodString;
                            to: z.ZodString;
                        }, z.core.$strict>>>;
                        holes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            siteId: z.ZodString;
                            name: z.ZodString;
                            type: z.ZodString;
                            phase: z.ZodOptional<z.ZodString>;
                            tail: z.ZodOptional<z.ZodBoolean>;
                        }, z.core.$strict>>>;
                        exits: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        sink: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        truncated: z.ZodOptional<z.ZodBoolean>;
                    }, z.core.$strict>>;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                    fill: z.ZodOptional<z.ZodObject<{
                        siteId: z.ZodString;
                        name: z.ZodString;
                        draftPath: z.ZodOptional<z.ZodString>;
                        line: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"get_workflow_run">;
                    runId: z.ZodString;
                    label: z.ZodString;
                    status: z.ZodEnum<{
                        pending: "pending";
                        running: "running";
                        completed: "completed";
                        stopped: "stopped";
                        errored: "errored";
                    }>;
                    stopReason: z.ZodOptional<z.ZodEnum<{
                        interrupted: "interrupted";
                        model: "model";
                        user: "user";
                        provider: "provider";
                        superseded: "superseded";
                    }>>;
                    possiblyInterrupted: z.ZodOptional<z.ZodBoolean>;
                    summary: z.ZodOptional<z.ZodString>;
                    generatedAt: z.ZodOptional<z.ZodNumber>;
                    usage: z.ZodObject<{
                        spentTokens: z.ZodNumber;
                        nodesObserved: z.ZodNumber;
                        nodesRunning: z.ZodNumber;
                        nodesCompleted: z.ZodNumber;
                        nodesFailed: z.ZodNumber;
                    }, z.core.$strict>;
                    phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        name: z.ZodString;
                        state: z.ZodEnum<{
                            done: "done";
                            current: "current";
                            ahead: "ahead";
                            unfinished: "unfinished";
                        }>;
                        rounds: z.ZodNumber;
                        nodesSettled: z.ZodNumber;
                        nodesRunning: z.ZodNumber;
                        enteredAt: z.ZodOptional<z.ZodNumber>;
                        exitedAt: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>>;
                    subagents: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        siteId: z.ZodString;
                        ordinal: z.ZodNumber;
                        name: z.ZodOptional<z.ZodString>;
                        state: z.ZodEnum<{
                            failed: "failed";
                            done: "done";
                            unfinished: "unfinished";
                            idle: "idle";
                            executing: "executing";
                            waiting: "waiting";
                            parked: "parked";
                        }>;
                        phaseName: z.ZodOptional<z.ZodString>;
                        instructionsHead: z.ZodOptional<z.ZodString>;
                        startedAt: z.ZodOptional<z.ZodNumber>;
                        turn: z.ZodOptional<z.ZodNumber>;
                        toolCalls: z.ZodOptional<z.ZodNumber>;
                        lastTool: z.ZodOptional<z.ZodObject<{
                            name: z.ZodString;
                            target: z.ZodOptional<z.ZodString>;
                            at: z.ZodOptional<z.ZodNumber>;
                        }, z.core.$strict>>;
                        waitCause: z.ZodOptional<z.ZodEnum<{
                            slot: "slot";
                            backoff: "backoff";
                        }>>;
                        retryAfterMs: z.ZodOptional<z.ZodNumber>;
                        waitSince: z.ZodOptional<z.ZodNumber>;
                        parkedOn: z.ZodOptional<z.ZodString>;
                        stepsSettled: z.ZodNumber;
                        stepsFailed: z.ZodNumber;
                        tokens: z.ZodNumber;
                        lastProgressAt: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>>;
                    health: z.ZodOptional<z.ZodObject<{
                        lastProgressAt: z.ZodOptional<z.ZodNumber>;
                        stalledSince: z.ZodOptional<z.ZodNumber>;
                        concurrency: z.ZodOptional<z.ZodObject<{
                            effective: z.ZodNumber;
                            cap: z.ZodNumber;
                            reason: z.ZodOptional<z.ZodString>;
                            since: z.ZodOptional<z.ZodNumber>;
                        }, z.core.$strict>>;
                        consecutiveFailures: z.ZodNumber;
                        cachedSteps: z.ZodNumber;
                        leftoverRunning: z.ZodOptional<z.ZodNumber>;
                        pendingQuestionsKnown: z.ZodBoolean;
                    }, z.core.$strict>>;
                    actors: z.ZodArray<z.ZodObject<{
                        siteId: z.ZodString;
                        ordinal: z.ZodNumber;
                        name: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    logTail: z.ZodArray<z.ZodObject<{
                        sequence: z.ZodNumber;
                        message: z.ZodString;
                        at: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                    result: z.ZodOptional<z.ZodString>;
                    error: z.ZodOptional<z.ZodObject<{
                        code: z.ZodString;
                        message: z.ZodString;
                    }, z.core.$strict>>;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"list_workflow_runs">;
                    runs: z.ZodArray<z.ZodObject<{
                        runId: z.ZodString;
                        label: z.ZodString;
                        labelSource: z.ZodEnum<{
                            script: "script";
                            name: "name";
                        }>;
                        status: z.ZodEnum<{
                            pending: "pending";
                            running: "running";
                            completed: "completed";
                            stopped: "stopped";
                            errored: "errored";
                        }>;
                        stopReason: z.ZodOptional<z.ZodEnum<{
                            interrupted: "interrupted";
                            model: "model";
                            user: "user";
                            provider: "provider";
                            superseded: "superseded";
                        }>>;
                        ownedByThisSession: z.ZodBoolean;
                        possiblyInterrupted: z.ZodOptional<z.ZodBoolean>;
                        createdAt: z.ZodNumber;
                        updatedAt: z.ZodNumber;
                        spentTokens: z.ZodNumber;
                    }, z.core.$strict>>;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"eval_workflow_snippet">;
                    ok: z.ZodBoolean;
                    diagnostics: z.ZodArray<z.ZodObject<{
                        line: z.ZodNumber;
                        column: z.ZodNumber;
                        code: z.ZodNumber;
                        message: z.ZodString;
                    }, z.core.$strict>>;
                    logs: z.ZodArray<z.ZodString>;
                    response: z.ZodString;
                    durationMs: z.ZodNumber;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"saved_workflow_list">;
                    workflows: z.ZodArray<z.ZodObject<{
                        name: z.ZodString;
                        description: z.ZodOptional<z.ZodString>;
                        whenToUse: z.ZodOptional<z.ZodString>;
                        scope: z.ZodString;
                        path: z.ZodString;
                        argNames: z.ZodArray<z.ZodString>;
                    }, z.core.$strict>>;
                    invalid: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        path: z.ZodString;
                        reason: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>>;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"list_models">;
                    current: z.ZodOptional<z.ZodString>;
                    models: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        providerId: z.ZodString;
                        modelId: z.ZodString;
                        providerLabel: z.ZodOptional<z.ZodString>;
                        reasoningLevels: z.ZodArray<z.ZodString>;
                        defaultReasoningLevel: z.ZodOptional<z.ZodString>;
                        contextWindow: z.ZodOptional<z.ZodNumber>;
                        disabledReason: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"resume_workflow_run">;
                    runId: z.ZodString;
                }, z.core.$strict>], "kind">>>;
                truncated: z.ZodOptional<z.ZodObject<{
                    totalBytes: z.ZodNumber;
                    ref: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            display: z.ZodCatch<z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"node_repl_images">;
                images: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    base64: z.ZodString;
                    mimeType: z.ZodString;
                }, z.core.$strict>>>;
                app: z.ZodOptional<z.ZodObject<{
                    appKey: z.ZodString;
                    displayName: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                truncated: z.ZodOptional<z.ZodBoolean>;
                source: z.ZodOptional<z.ZodLiteral<"browser_turn_end">>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"task_output">;
                retrievalStatus: z.ZodEnum<{
                    success: "success";
                    timeout: "timeout";
                    not_ready: "not_ready";
                }>;
                taskStatus: z.ZodOptional<z.ZodString>;
                output: z.ZodOptional<z.ZodString>;
                truncated: z.ZodOptional<z.ZodLiteral<true>>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"respond_to_coordinator">;
                status: z.ZodEnum<{
                    failed: "failed";
                    success: "success";
                }>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"mcp_tool">;
                serverName: z.ZodString;
                toolName: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                unavailable: z.ZodOptional<z.ZodObject<{
                    code: z.ZodEnum<{
                        quota_exceeded: "quota_exceeded";
                        coding_plan_required: "coding_plan_required";
                    }>;
                }, z.core.$strict>>;
                ui: z.ZodOptional<z.ZodObject<{
                    pluginId: z.ZodString;
                    resourceUri: z.ZodString;
                    preferredDisplayMode: z.ZodOptional<z.ZodEnum<{
                        inline: "inline";
                        fullscreen: "fullscreen";
                        pip: "pip";
                    }>>;
                    prefersBorder: z.ZodOptional<z.ZodBoolean>;
                    csp: z.ZodOptional<z.ZodObject<{
                        connectDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        resourceDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        frameDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        baseUriDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    }, z.core.$strict>>;
                    structuredContent: z.ZodOptional<z.ZodString>;
                    widgetMeta: z.ZodOptional<z.ZodString>;
                    content: z.ZodOptional<z.ZodString>;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                    truncatedBytes: z.ZodOptional<z.ZodNumber>;
                    isError: z.ZodOptional<z.ZodLiteral<true>>;
                    showInline: z.ZodOptional<z.ZodLiteral<true>>;
                    surface: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"create_workflow">;
                ok: z.ZodBoolean;
                errorCount: z.ZodNumber;
                diagnostics: z.ZodArray<z.ZodObject<{
                    line: z.ZodNumber;
                    column: z.ZodNumber;
                    code: z.ZodNumber;
                    message: z.ZodString;
                }, z.core.$strict>>;
                causalityGraph: z.ZodOptional<z.ZodObject<{
                    steps: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        kind: z.ZodEnum<{
                            ask: "ask";
                            "world-read": "world-read";
                            hole: "hole";
                        }>;
                        label: z.ZodString;
                        labelPattern: z.ZodOptional<z.ZodObject<{
                            head: z.ZodOptional<z.ZodString>;
                            tail: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        line: z.ZodOptional<z.ZodNumber>;
                        column: z.ZodOptional<z.ZodNumber>;
                        lane: z.ZodString;
                        lanes: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        source: z.ZodOptional<z.ZodString>;
                        phase: z.ZodOptional<z.ZodString>;
                        repeat: z.ZodOptional<z.ZodEnum<{
                            stack: "stack";
                            serial: "serial";
                        }>>;
                        fill: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    lanes: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        name: z.ZodOptional<z.ZodString>;
                        namePattern: z.ZodOptional<z.ZodObject<{
                            head: z.ZodOptional<z.ZodString>;
                            tail: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        line: z.ZodOptional<z.ZodNumber>;
                        column: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                    participants: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        phase: z.ZodString;
                        lane: z.ZodString;
                        steps: z.ZodArray<z.ZodString>;
                        member: z.ZodOptional<z.ZodObject<{
                            index: z.ZodNumber;
                            of: z.ZodNumber;
                        }, z.core.$strict>>;
                        many: z.ZodOptional<z.ZodLiteral<true>>;
                    }, z.core.$strict>>;
                    handoffs: z.ZodArray<z.ZodObject<{
                        from: z.ZodString;
                        to: z.ZodString;
                        back: z.ZodOptional<z.ZodLiteral<true>>;
                        types: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    }, z.core.$strict>>;
                    phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        name: z.ZodOptional<z.ZodString>;
                        line: z.ZodOptional<z.ZodNumber>;
                        column: z.ZodOptional<z.ZodNumber>;
                        alongside: z.ZodOptional<z.ZodArray<z.ZodString>>;
                        fill: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>>;
                    phaseEdges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        from: z.ZodString;
                        to: z.ZodString;
                        back: z.ZodOptional<z.ZodLiteral<true>>;
                    }, z.core.$strict>>>;
                    phaseStreams: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        from: z.ZodString;
                        to: z.ZodString;
                    }, z.core.$strict>>>;
                    holes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        siteId: z.ZodString;
                        name: z.ZodString;
                        type: z.ZodString;
                        phase: z.ZodOptional<z.ZodString>;
                        tail: z.ZodOptional<z.ZodBoolean>;
                    }, z.core.$strict>>>;
                    exits: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    sink: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    truncated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>>;
                truncated: z.ZodOptional<z.ZodBoolean>;
                fill: z.ZodOptional<z.ZodObject<{
                    siteId: z.ZodString;
                    name: z.ZodString;
                    draftPath: z.ZodOptional<z.ZodString>;
                    line: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"get_workflow_run">;
                runId: z.ZodString;
                label: z.ZodString;
                status: z.ZodEnum<{
                    pending: "pending";
                    running: "running";
                    completed: "completed";
                    stopped: "stopped";
                    errored: "errored";
                }>;
                stopReason: z.ZodOptional<z.ZodEnum<{
                    interrupted: "interrupted";
                    model: "model";
                    user: "user";
                    provider: "provider";
                    superseded: "superseded";
                }>>;
                possiblyInterrupted: z.ZodOptional<z.ZodBoolean>;
                summary: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodOptional<z.ZodNumber>;
                usage: z.ZodObject<{
                    spentTokens: z.ZodNumber;
                    nodesObserved: z.ZodNumber;
                    nodesRunning: z.ZodNumber;
                    nodesCompleted: z.ZodNumber;
                    nodesFailed: z.ZodNumber;
                }, z.core.$strict>;
                phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    state: z.ZodEnum<{
                        done: "done";
                        current: "current";
                        ahead: "ahead";
                        unfinished: "unfinished";
                    }>;
                    rounds: z.ZodNumber;
                    nodesSettled: z.ZodNumber;
                    nodesRunning: z.ZodNumber;
                    enteredAt: z.ZodOptional<z.ZodNumber>;
                    exitedAt: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>>;
                subagents: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    siteId: z.ZodString;
                    ordinal: z.ZodNumber;
                    name: z.ZodOptional<z.ZodString>;
                    state: z.ZodEnum<{
                        failed: "failed";
                        done: "done";
                        unfinished: "unfinished";
                        idle: "idle";
                        executing: "executing";
                        waiting: "waiting";
                        parked: "parked";
                    }>;
                    phaseName: z.ZodOptional<z.ZodString>;
                    instructionsHead: z.ZodOptional<z.ZodString>;
                    startedAt: z.ZodOptional<z.ZodNumber>;
                    turn: z.ZodOptional<z.ZodNumber>;
                    toolCalls: z.ZodOptional<z.ZodNumber>;
                    lastTool: z.ZodOptional<z.ZodObject<{
                        name: z.ZodString;
                        target: z.ZodOptional<z.ZodString>;
                        at: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                    waitCause: z.ZodOptional<z.ZodEnum<{
                        slot: "slot";
                        backoff: "backoff";
                    }>>;
                    retryAfterMs: z.ZodOptional<z.ZodNumber>;
                    waitSince: z.ZodOptional<z.ZodNumber>;
                    parkedOn: z.ZodOptional<z.ZodString>;
                    stepsSettled: z.ZodNumber;
                    stepsFailed: z.ZodNumber;
                    tokens: z.ZodNumber;
                    lastProgressAt: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>>;
                health: z.ZodOptional<z.ZodObject<{
                    lastProgressAt: z.ZodOptional<z.ZodNumber>;
                    stalledSince: z.ZodOptional<z.ZodNumber>;
                    concurrency: z.ZodOptional<z.ZodObject<{
                        effective: z.ZodNumber;
                        cap: z.ZodNumber;
                        reason: z.ZodOptional<z.ZodString>;
                        since: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                    consecutiveFailures: z.ZodNumber;
                    cachedSteps: z.ZodNumber;
                    leftoverRunning: z.ZodOptional<z.ZodNumber>;
                    pendingQuestionsKnown: z.ZodBoolean;
                }, z.core.$strict>>;
                actors: z.ZodArray<z.ZodObject<{
                    siteId: z.ZodString;
                    ordinal: z.ZodNumber;
                    name: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                logTail: z.ZodArray<z.ZodObject<{
                    sequence: z.ZodNumber;
                    message: z.ZodString;
                    at: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                result: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                }, z.core.$strict>>;
                truncated: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"list_workflow_runs">;
                runs: z.ZodArray<z.ZodObject<{
                    runId: z.ZodString;
                    label: z.ZodString;
                    labelSource: z.ZodEnum<{
                        script: "script";
                        name: "name";
                    }>;
                    status: z.ZodEnum<{
                        pending: "pending";
                        running: "running";
                        completed: "completed";
                        stopped: "stopped";
                        errored: "errored";
                    }>;
                    stopReason: z.ZodOptional<z.ZodEnum<{
                        interrupted: "interrupted";
                        model: "model";
                        user: "user";
                        provider: "provider";
                        superseded: "superseded";
                    }>>;
                    ownedByThisSession: z.ZodBoolean;
                    possiblyInterrupted: z.ZodOptional<z.ZodBoolean>;
                    createdAt: z.ZodNumber;
                    updatedAt: z.ZodNumber;
                    spentTokens: z.ZodNumber;
                }, z.core.$strict>>;
                truncated: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"eval_workflow_snippet">;
                ok: z.ZodBoolean;
                diagnostics: z.ZodArray<z.ZodObject<{
                    line: z.ZodNumber;
                    column: z.ZodNumber;
                    code: z.ZodNumber;
                    message: z.ZodString;
                }, z.core.$strict>>;
                logs: z.ZodArray<z.ZodString>;
                response: z.ZodString;
                durationMs: z.ZodNumber;
                truncated: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"saved_workflow_list">;
                workflows: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    whenToUse: z.ZodOptional<z.ZodString>;
                    scope: z.ZodString;
                    path: z.ZodString;
                    argNames: z.ZodArray<z.ZodString>;
                }, z.core.$strict>>;
                invalid: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodString;
                    reason: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>>;
                truncated: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"list_models">;
                current: z.ZodOptional<z.ZodString>;
                models: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    providerLabel: z.ZodOptional<z.ZodString>;
                    reasoningLevels: z.ZodArray<z.ZodString>;
                    defaultReasoningLevel: z.ZodOptional<z.ZodString>;
                    contextWindow: z.ZodOptional<z.ZodNumber>;
                    disabledReason: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                truncated: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"resume_workflow_run">;
                runId: z.ZodString;
            }, z.core.$strict>], "kind">>>;
            error: z.ZodOptional<z.ZodObject<{
                code: z.ZodString;
                message: z.ZodString;
            }, z.core.$strip>>;
            progress: z.ZodOptional<z.ZodObject<{
                bytes: z.ZodOptional<z.ZodNumber>;
                previewLine: z.ZodOptional<z.ZodString>;
                fraction: z.ZodOptional<z.ZodNumber>;
                total: z.ZodOptional<z.ZodNumber>;
                message: z.ZodOptional<z.ZodString>;
                updatedAt: z.ZodNumber;
            }, z.core.$strip>>;
            outputPreview: z.ZodOptional<z.ZodObject<{
                text: z.ZodString;
                fullText: z.ZodString;
                totalLines: z.ZodNumber;
                totalBytes: z.ZodNumber;
                linesEstimated: z.ZodBoolean;
            }, z.core.$strict>>;
            approvalInteractionId: z.ZodOptional<z.ZodString>;
            backgrounded: z.ZodOptional<z.ZodLiteral<true>>;
            workId: z.ZodOptional<z.ZodString>;
            startedAt: z.ZodOptional<z.ZodNumber>;
            endedAt: z.ZodOptional<z.ZodNumber>;
            rowId: z.ZodNumber;
            turnId: z.ZodString;
            entityId: z.ZodOptional<z.ZodString>;
            productTurnId: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodLiteral<"visible">>;
            createdAt: z.ZodNumber;
            createdAtSeq: z.ZodNumber;
            actions: z.ZodOptional<z.ZodObject<{
                canFork: z.ZodOptional<z.ZodLiteral<true>>;
                canEdit: z.ZodOptional<z.ZodLiteral<true>>;
                canRetry: z.ZodOptional<z.ZodLiteral<true>>;
                canRewindFiles: z.ZodOptional<z.ZodLiteral<true>>;
                editDisposition: z.ZodOptional<z.ZodEnum<{
                    fork: "fork";
                    rewind: "rewind";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"artifact">;
            artifactVersionId: z.ZodString;
            logicalArtifactKey: z.ZodString;
            displayName: z.ZodString;
            artifactType: z.ZodEnum<{
                text: "text";
                html: "html";
                image: "image";
                pdf: "pdf";
                pptx: "pptx";
                docx: "docx";
                xlsx: "xlsx";
                md: "md";
            }>;
            mimeType: z.ZodString;
            sizeBytes: z.ZodNumber;
            sha256: z.ZodString;
            ref: z.ZodString;
            state: z.ZodLiteral<"current">;
            rowId: z.ZodNumber;
            turnId: z.ZodString;
            entityId: z.ZodOptional<z.ZodString>;
            productTurnId: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodLiteral<"visible">>;
            createdAt: z.ZodNumber;
            createdAtSeq: z.ZodNumber;
            actions: z.ZodOptional<z.ZodObject<{
                canFork: z.ZodOptional<z.ZodLiteral<true>>;
                canEdit: z.ZodOptional<z.ZodLiteral<true>>;
                canRetry: z.ZodOptional<z.ZodLiteral<true>>;
                canRewindFiles: z.ZodOptional<z.ZodLiteral<true>>;
                editDisposition: z.ZodOptional<z.ZodEnum<{
                    fork: "fork";
                    rewind: "rewind";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"subagent">;
            parentToolCallId: z.ZodOptional<z.ZodString>;
            subagentType: z.ZodString;
            status: z.ZodEnum<{
                running: "running";
                failed: "failed";
                success: "success";
                cancelled: "cancelled";
            }>;
            summaryText: z.ZodString;
            childSessionId: z.ZodOptional<z.ZodString>;
            backgrounded: z.ZodOptional<z.ZodLiteral<true>>;
            workId: z.ZodOptional<z.ZodString>;
            startedAt: z.ZodOptional<z.ZodNumber>;
            endedAt: z.ZodOptional<z.ZodNumber>;
            rowId: z.ZodNumber;
            turnId: z.ZodString;
            entityId: z.ZodOptional<z.ZodString>;
            productTurnId: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodLiteral<"visible">>;
            createdAt: z.ZodNumber;
            createdAtSeq: z.ZodNumber;
            actions: z.ZodOptional<z.ZodObject<{
                canFork: z.ZodOptional<z.ZodLiteral<true>>;
                canEdit: z.ZodOptional<z.ZodLiteral<true>>;
                canRetry: z.ZodOptional<z.ZodLiteral<true>>;
                canRewindFiles: z.ZodOptional<z.ZodLiteral<true>>;
                editDisposition: z.ZodOptional<z.ZodEnum<{
                    fork: "fork";
                    rewind: "rewind";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"hookInvocation">;
            hookInvocationId: z.ZodString;
            hookEventName: z.ZodEnum<{
                SessionStart: "SessionStart";
                UserPromptSubmit: "UserPromptSubmit";
                PreToolUse: "PreToolUse";
                PermissionRequest: "PermissionRequest";
                PostToolUse: "PostToolUse";
                PostToolUseFailure: "PostToolUseFailure";
                Stop: "Stop";
            }>;
            hookCount: z.ZodNumber;
            state: z.ZodEnum<{
                running: "running";
                completed: "completed";
                failed: "failed";
            }>;
            startedAt: z.ZodNumber;
            endedAt: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            lane: z.ZodEnum<{
                assistantWork: "assistantWork";
                toolBefore: "toolBefore";
                toolAfter: "toolAfter";
            }>;
            anchorToolCallId: z.ZodOptional<z.ZodString>;
            executions: z.ZodArray<z.ZodObject<{
                hookRunId: z.ZodString;
                hookIndex: z.ZodNumber;
                didExecute: z.ZodBoolean;
                state: z.ZodEnum<{
                    running: "running";
                    completed: "completed";
                    failed: "failed";
                }>;
                outcome: z.ZodOptional<z.ZodEnum<{
                    failed: "failed";
                    success: "success";
                    cancelled: "cancelled";
                    timed_out: "timed_out";
                    blocked: "blocked";
                }>>;
                blockReason: z.ZodOptional<z.ZodString>;
                startedAt: z.ZodNumber;
                endedAt: z.ZodOptional<z.ZodNumber>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                displayName: z.ZodString;
                sourceKind: z.ZodEnum<{
                    user: "user";
                    project: "project";
                    plugin: "plugin";
                }>;
                pluginName: z.ZodOptional<z.ZodString>;
                toolName: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            rowId: z.ZodNumber;
            turnId: z.ZodString;
            entityId: z.ZodOptional<z.ZodString>;
            productTurnId: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodLiteral<"visible">>;
            createdAt: z.ZodNumber;
            createdAtSeq: z.ZodNumber;
            actions: z.ZodOptional<z.ZodObject<{
                canFork: z.ZodOptional<z.ZodLiteral<true>>;
                canEdit: z.ZodOptional<z.ZodLiteral<true>>;
                canRetry: z.ZodOptional<z.ZodLiteral<true>>;
                canRewindFiles: z.ZodOptional<z.ZodLiteral<true>>;
                editDisposition: z.ZodOptional<z.ZodEnum<{
                    fork: "fork";
                    rewind: "rewind";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"timelineMarker">;
            sourceCommandId: z.ZodOptional<z.ZodString>;
            lane: z.ZodOptional<z.ZodEnum<{
                assistantWork: "assistantWork";
                turnTailBoundary: "turnTailBoundary";
                lightBoundary: "lightBoundary";
            }>>;
            marker: z.ZodUnion<readonly [z.ZodObject<{
                type: z.ZodLiteral<"compact">;
                origin: z.ZodEnum<{
                    auto: "auto";
                    manual: "manual";
                }>;
                status: z.ZodEnum<{
                    running: "running";
                    failed: "failed";
                    success: "success";
                    cancelled: "cancelled";
                    noop: "noop";
                }>;
                tokensBefore: z.ZodOptional<z.ZodNumber>;
                tokensAfter: z.ZodOptional<z.ZodNumber>;
                summaryRef: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"forkNotice">;
                parentSessionId: z.ZodString;
                parentRowId: z.ZodNumber;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"forkCreated">;
                childSessionId: z.ZodString;
                atRowId: z.ZodNumber;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"modelChange">;
                fromProvider: z.ZodString;
                fromModel: z.ZodString;
                toProvider: z.ZodString;
                toModel: z.ZodString;
                toThought: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"modelChange">;
                fromProvider: z.ZodOptional<z.ZodNever>;
                fromModel: z.ZodOptional<z.ZodNever>;
                toProvider: z.ZodString;
                toModel: z.ZodString;
                toThought: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"goalSet">;
                objective: z.ZodString;
                previousObjective: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"goalVerify">;
                iteration: z.ZodNumber;
                outcome: z.ZodEnum<{
                    running: "running";
                    failed: "failed";
                    pass: "pass";
                    notSatisfied: "notSatisfied";
                }>;
                detail: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"retryNotice">;
                attempt: z.ZodNumber;
                reasonCode: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"checkpointRestored">;
                checkpointId: z.ZodString;
            }, z.core.$strip>]>;
            rowId: z.ZodNumber;
            turnId: z.ZodString;
            entityId: z.ZodOptional<z.ZodString>;
            productTurnId: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodLiteral<"visible">>;
            createdAt: z.ZodNumber;
            createdAtSeq: z.ZodNumber;
            actions: z.ZodOptional<z.ZodObject<{
                canFork: z.ZodOptional<z.ZodLiteral<true>>;
                canEdit: z.ZodOptional<z.ZodLiteral<true>>;
                canRetry: z.ZodOptional<z.ZodLiteral<true>>;
                canRewindFiles: z.ZodOptional<z.ZodLiteral<true>>;
                editDisposition: z.ZodOptional<z.ZodEnum<{
                    fork: "fork";
                    rewind: "rewind";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>], "kind">>;
    }, z.core.$strict>;
    integrity: z.ZodObject<{
        projection_sha256: z.ZodString;
        artifact_set_sha256: z.ZodString;
    }, z.core.$strict>;
    disclosure_confirmation: z.ZodObject<{
        version: z.ZodLiteral<1>;
        accepted_at: z.ZodNumber;
        acknowledged_no_secret_detection: z.ZodLiteral<true>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ConversationShareConfirmRequest = z.infer<typeof conversationShareConfirmRequestSchema>;
export declare const conversationSharePreviewArtifactSchema: z.ZodObject<{
    artifact_id: z.ZodString;
    logical_artifact_key: z.ZodString;
    producer_product_turn_id: z.ZodString;
    artifact_version: z.ZodNumber;
    state: z.ZodLiteral<"current">;
    ref: z.ZodString;
    artifact_type: z.ZodEnum<{
        text: "text";
        html: "html";
        image: "image";
        pdf: "pdf";
        pptx: "pptx";
        docx: "docx";
        xlsx: "xlsx";
        md: "md";
    }>;
    display_name: z.ZodString;
    original_path: z.ZodOptional<z.ZodString>;
    extension: z.ZodString;
    mime_type: z.ZodString;
    size_bytes: z.ZodNumber;
    sha256: z.ZodString;
    url: z.ZodString;
    url_expires_at: z.ZodNumber;
}, z.core.$strip>;
/**
 * 入站 wire 形状：rows 是 unknown[]，由 decodeConversationShareRows 逐行降级。
 *
 * 传输层不理解 row 语义是刻意的——否则老客户端遇到一行新 kind 就整份分享打不开。
 * 对外类型 ConversationSharePreview 是「解码后」的形状，不从这份 schema 推断。
 */
export declare const conversationSharePreviewDataSchema: z.ZodObject<{
    schema_version: z.ZodNumber;
    share: z.ZodObject<{
        title: z.ZodString;
        access_mode: z.ZodEnum<{
            private: "private";
            public_readonly: "public_readonly";
            public_importable: "public_importable";
        }>;
        created_at: z.ZodNumber;
        expires_at: z.ZodNumber;
    }, z.core.$strip>;
    rows: z.ZodArray<z.ZodUnknown>;
    artifacts: z.ZodArray<z.ZodObject<{
        artifact_id: z.ZodString;
        logical_artifact_key: z.ZodString;
        producer_product_turn_id: z.ZodString;
        artifact_version: z.ZodNumber;
        state: z.ZodLiteral<"current">;
        ref: z.ZodString;
        artifact_type: z.ZodEnum<{
            text: "text";
            html: "html";
            image: "image";
            pdf: "pdf";
            pptx: "pptx";
            docx: "docx";
            xlsx: "xlsx";
            md: "md";
        }>;
        display_name: z.ZodString;
        original_path: z.ZodOptional<z.ZodString>;
        extension: z.ZodString;
        mime_type: z.ZodString;
        size_bytes: z.ZodNumber;
        sha256: z.ZodString;
        url: z.ZodString;
        url_expires_at: z.ZodNumber;
    }, z.core.$strip>>;
    integrity: z.ZodObject<{
        projection_sha256: z.ZodString;
        artifact_set_sha256: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ConversationSharePreviewWire = z.infer<typeof conversationSharePreviewDataSchema>;
export type ConversationSharePreview = Omit<ConversationSharePreviewWire, "rows"> & {
    rows: ConversationRow[];
    /** 本端认不出、已跳过的行数；>0 时 UI 必须给「部分内容需要更新 ZCode 查看」软提示。 */
    unsupportedRowCount: number;
};
export declare const conversationShareContinuationRequestSchema: z.ZodObject<{
    schema_version: z.ZodLiteral<1>;
    client_request_id: z.ZodString;
}, z.core.$strict>;
export type ConversationShareContinuationRequest = z.infer<typeof conversationShareContinuationRequestSchema>;
export declare const conversationShareContinuationArtifactSchema: z.ZodObject<{
    artifact_id: z.ZodString;
    logical_artifact_key: z.ZodString;
    producer_product_turn_id: z.ZodString;
    artifact_version: z.ZodNumber;
    state: z.ZodLiteral<"current">;
    ref: z.ZodString;
    artifact_type: z.ZodEnum<{
        text: "text";
        html: "html";
        image: "image";
        pdf: "pdf";
        pptx: "pptx";
        docx: "docx";
        xlsx: "xlsx";
        md: "md";
    }>;
    display_name: z.ZodString;
    original_path: z.ZodOptional<z.ZodString>;
    extension: z.ZodString;
    mime_type: z.ZodString;
    size_bytes: z.ZodNumber;
    sha256: z.ZodString;
    download_url: z.ZodString;
    download_url_expires_at: z.ZodNumber;
}, z.core.$strip>;
export declare const conversationShareContinuationDataSchema: z.ZodObject<{
    schema_version: z.ZodNumber;
    import_grant_id: z.ZodString;
    import_grant_expires_at: z.ZodNumber;
    share: z.ZodObject<{
        title: z.ZodString;
        access_mode: z.ZodEnum<{
            private: "private";
            public_readonly: "public_readonly";
            public_importable: "public_importable";
        }>;
        created_at: z.ZodNumber;
        expires_at: z.ZodNumber;
        share_id: z.ZodString;
    }, z.core.$strip>;
    rows: z.ZodArray<z.ZodUnknown>;
    artifacts: z.ZodArray<z.ZodObject<{
        artifact_id: z.ZodString;
        logical_artifact_key: z.ZodString;
        producer_product_turn_id: z.ZodString;
        artifact_version: z.ZodNumber;
        state: z.ZodLiteral<"current">;
        ref: z.ZodString;
        artifact_type: z.ZodEnum<{
            text: "text";
            html: "html";
            image: "image";
            pdf: "pdf";
            pptx: "pptx";
            docx: "docx";
            xlsx: "xlsx";
            md: "md";
        }>;
        display_name: z.ZodString;
        original_path: z.ZodOptional<z.ZodString>;
        extension: z.ZodString;
        mime_type: z.ZodString;
        size_bytes: z.ZodNumber;
        sha256: z.ZodString;
        download_url: z.ZodString;
        download_url_expires_at: z.ZodNumber;
    }, z.core.$strip>>;
    integrity: z.ZodObject<{
        projection_sha256: z.ZodString;
        artifact_set_sha256: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ConversationShareContinuationWire = z.infer<typeof conversationShareContinuationDataSchema>;
export type ConversationShareContinuation = Omit<ConversationShareContinuationWire, "rows"> & {
    rows: ConversationRow[];
    /** 未解析的原始 rows：落盘只读副本时按原样保存，避免未知字段被本端永久抹掉。 */
    rawRows: readonly unknown[];
    /** 本端认不出、已跳过的行数；>0 时 UI 必须给「部分内容需要更新 ZCode 查看」软提示。 */
    unsupportedRowCount: number;
};
/** 本端已知的业务错误码；wire 上不做枚举校验，未知码保留服务端 msg 并落 unknown。 */
export declare const conversationShareKnownErrorCodeSchema: z.ZodUnion<readonly [z.ZodLiteral<3001>, z.ZodLiteral<3002>, z.ZodLiteral<3200>, z.ZodLiteral<3201>, z.ZodLiteral<3203>, z.ZodLiteral<3204>, z.ZodLiteral<3205>, z.ZodLiteral<3206>, z.ZodLiteral<3207>, z.ZodLiteral<3208>, z.ZodLiteral<3209>, z.ZodLiteral<3210>, z.ZodLiteral<3211>, z.ZodLiteral<3212>, z.ZodLiteral<3213>, z.ZodLiteral<3214>, z.ZodLiteral<3215>]>;
export type ConversationShareApiErrorCode = z.infer<typeof conversationShareKnownErrorCodeSchema>;
/**
 * 错误信封对 code 不设枚举：后端上线一个新业务码时，老客户端应该照样能拿到服务端 msg，
 * 而不是整条信封解析失败、退化成没有上下文的 "HTTP 4xx"。
 */
export declare const conversationShareErrorEnvelopeSchema: z.ZodObject<{
    code: z.ZodNumber;
    msg: z.ZodString;
}, z.core.$strip>;
export type ConversationShareErrorEnvelope = z.infer<typeof conversationShareErrorEnvelopeSchema>;
export declare function createConversationShareSuccessEnvelopeSchema<TSchema extends z.ZodType>(dataSchema: TSchema): z.ZodObject<{
    code: z.ZodLiteral<0>;
    msg: z.ZodString;
    data: TSchema;
}, z.core.$strip>;
//# sourceMappingURL=conversation-share.d.ts.map