import { z } from "zod";
export type { SharedContextRef } from "./shared-context-ref.js";
export * from "./workflow-command-rejections.js";
export declare const commandPayloadSchemas: {
    readonly createSession: z.ZodObject<{
        workspaceId: z.ZodString;
        permissionScope: z.ZodOptional<z.ZodLiteral<"session">>;
        firstInput: z.ZodOptional<z.ZodObject<{
            text: z.ZodString;
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
            modelSelection: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            mode: z.ZodOptional<z.ZodEnum<{
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
            }>>;
            planEnabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        config: z.ZodOptional<z.ZodObject<{
            modelSelection: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            provider: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            thought: z.ZodOptional<z.ZodString>;
            followupMode: z.ZodOptional<z.ZodEnum<{
                queue: "queue";
                guide: "guide";
            }>>;
            mode: z.ZodOptional<z.ZodString>;
            planEnabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            name: z.ZodString;
            command: z.ZodString;
            args: z.ZodArray<z.ZodString>;
            env: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strict>>;
            isolation: z.ZodOptional<z.ZodEnum<{
                workspace: "workspace";
                session: "session";
            }>>;
            protocolVersion: z.ZodOptional<z.ZodEnum<{
                auto: "auto";
                legacy: "legacy";
                "2026-07-28": "2026-07-28";
            }>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<{
                http: "http";
                sse: "sse";
            }>;
            url: z.ZodString;
            headers: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strict>>;
            oauth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
                type: z.ZodLiteral<"client_credentials">;
                clientId: z.ZodString;
                clientSecret: z.ZodString;
                clientName: z.ZodOptional<z.ZodString>;
                scope: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"authorization_code">;
                clientId: z.ZodOptional<z.ZodString>;
                clientSecret: z.ZodOptional<z.ZodString>;
                clientName: z.ZodOptional<z.ZodString>;
                redirectPath: z.ZodOptional<z.ZodString>;
                scope: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>]>>;
            isolation: z.ZodOptional<z.ZodEnum<{
                workspace: "workspace";
                session: "session";
            }>>;
            protocolVersion: z.ZodOptional<z.ZodEnum<{
                auto: "auto";
                legacy: "legacy";
                "2026-07-28": "2026-07-28";
            }>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>]>>>;
        offPeakToolEnabled: z.ZodOptional<z.ZodBoolean>;
        dynamicWorkflowEnabled: z.ZodOptional<z.ZodBoolean>;
        dynamicWorkflowMode: z.ZodOptional<z.ZodEnum<{
            disabled: "disabled";
            onDemand: "onDemand";
            alwaysOn: "alwaysOn";
        }>>;
    }, z.core.$strip>;
    readonly createSelectionSideSession: z.ZodObject<{
        firstInput: z.ZodOptional<z.ZodObject<{
            text: z.ZodString;
            modelSelection: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly sendText: z.ZodObject<{
        text: z.ZodString;
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
        requestedDelivery: z.ZodOptional<z.ZodEnum<{
            queue: "queue";
            guide: "guide";
            startNow: "startNow";
        }>>;
        browserAmbientContext: z.ZodOptional<z.ZodObject<{
            tabCount: z.ZodNumber;
            currentUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        context_refs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"shared_context_import">;
            context_id: z.ZodString;
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
        heldQueueDisposition: z.ZodOptional<z.ZodEnum<{
            clearQueueAndSend: "clearQueueAndSend";
            keepQueueAndSend: "keepQueueAndSend";
        }>>;
        expectedHeldQueueItemIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        modelSelection: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        mode: z.ZodOptional<z.ZodEnum<{
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
        }>>;
        planEnabled: z.ZodOptional<z.ZodBoolean>;
        modelExecution: z.ZodOptional<z.ZodObject<{
            memoryExtraction: z.ZodOptional<z.ZodLiteral<"skip">>;
            selectionScope: z.ZodLiteral<"execution">;
            requestAuth: z.ZodOptional<z.ZodObject<{
                apiKey: z.ZodOptional<z.ZodString>;
                apiKeyId: z.ZodOptional<z.ZodString>;
                accountScope: z.ZodOptional<z.ZodString>;
                headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$strict>>;
            subagents: z.ZodOptional<z.ZodObject<{
                foregroundModel: z.ZodLiteral<"submission">;
                background: z.ZodLiteral<"deny">;
            }, z.core.$strict>>;
            selectionFallback: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                rules: z.ZodArray<z.ZodObject<{
                    reason: z.ZodEnum<{
                        highspeed_card_expired: "highspeed_card_expired";
                        highspeed_request_failed: "highspeed_request_failed";
                    }>;
                    providerErrorCode: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                target: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        highspeedMeta: z.ZodOptional<z.ZodObject<{
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
        automationId: z.ZodOptional<z.ZodString>;
        offPeakTaskId: z.ZodOptional<z.ZodString>;
        offPeakRunType: z.ZodOptional<z.ZodEnum<{
            init: "init";
            resume: "resume";
        }>>;
        botDeliveryTarget: z.ZodOptional<z.ZodObject<{
            provider: z.ZodEnum<{
                feishu: "feishu";
                lark: "lark";
                weixin: "weixin";
            }>;
            botId: z.ZodString;
            providerUserId: z.ZodString;
            chatType: z.ZodEnum<{
                private: "private";
                group: "group";
            }>;
            threadId: z.ZodOptional<z.ZodString>;
            rootMessageId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
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
        toolDisallowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    readonly sendGoalCommand: z.ZodObject<{
        text: z.ZodString;
        displayText: z.ZodOptional<z.ZodString>;
        modelSelection: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        mode: z.ZodOptional<z.ZodEnum<{
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
        }>>;
        planEnabled: z.ZodOptional<z.ZodBoolean>;
        heldQueueDisposition: z.ZodOptional<z.ZodEnum<{
            clearQueueAndSend: "clearQueueAndSend";
            keepQueueAndSend: "keepQueueAndSend";
        }>>;
        expectedHeldQueueItemIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    readonly stop: z.ZodObject<{
        expectedForegroundExecutionId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    readonly compact: z.ZodObject<{}, z.core.$strip>;
    readonly forkAssistant: z.ZodObject<{
        target: z.ZodObject<{
            rowId: z.ZodNumber;
            entityId: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strip>;
    readonly applyFileRewind: z.ZodObject<{
        target: z.ZodObject<{
            rowId: z.ZodNumber;
            entityId: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strip>;
    readonly editUserQuery: z.ZodObject<{
        target: z.ZodObject<{
            rowId: z.ZodNumber;
            entityId: z.ZodString;
        }, z.core.$strict>;
        newText: z.ZodString;
        conversationQuotes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            path: z.ZodOptional<z.ZodString>;
            senderName: z.ZodOptional<z.ZodString>;
            senderId: z.ZodOptional<z.ZodString>;
            messageId: z.ZodOptional<z.ZodString>;
            sentAt: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
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
        modelSelection: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        modelExecution: z.ZodOptional<z.ZodObject<{
            memoryExtraction: z.ZodOptional<z.ZodLiteral<"skip">>;
            selectionScope: z.ZodLiteral<"execution">;
            requestAuth: z.ZodOptional<z.ZodObject<{
                apiKey: z.ZodOptional<z.ZodString>;
                apiKeyId: z.ZodOptional<z.ZodString>;
                accountScope: z.ZodOptional<z.ZodString>;
                headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$strict>>;
            subagents: z.ZodOptional<z.ZodObject<{
                foregroundModel: z.ZodLiteral<"submission">;
                background: z.ZodLiteral<"deny">;
            }, z.core.$strict>>;
            selectionFallback: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                rules: z.ZodArray<z.ZodObject<{
                    reason: z.ZodEnum<{
                        highspeed_card_expired: "highspeed_card_expired";
                        highspeed_request_failed: "highspeed_request_failed";
                    }>;
                    providerErrorCode: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                target: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        highspeedMeta: z.ZodOptional<z.ZodObject<{
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
        workspaceMode: z.ZodOptional<z.ZodEnum<{
            rewind: "rewind";
            preserve: "preserve";
        }>>;
    }, z.core.$strip>;
    readonly retryTurn: z.ZodObject<{
        target: z.ZodObject<{
            rowId: z.ZodNumber;
            entityId: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strip>;
    readonly setAssistantFeedback: z.ZodObject<{
        target: z.ZodObject<{
            rowId: z.ZodNumber;
            entityId: z.ZodString;
        }, z.core.$strict>;
        feedback: z.ZodNullable<z.ZodEnum<{
            like: "like";
            dislike: "dislike";
        }>>;
    }, z.core.$strip>;
    readonly setHighspeedMetrics: z.ZodObject<{
        target: z.ZodObject<{
            rowId: z.ZodNumber;
            entityId: z.ZodString;
        }, z.core.$strict>;
        regularTps: z.ZodNumber;
        outputTokens: z.ZodNumber;
        durationMs: z.ZodNumber;
        highspeedTps: z.ZodNumber;
        savedDurationMs: z.ZodNumber;
        modelDurationMs: z.ZodOptional<z.ZodNumber>;
        toolDurationMs: z.ZodOptional<z.ZodNumber>;
        otherDurationMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    readonly sendQueuedNow: z.ZodObject<{
        queueItemId: z.ZodString;
        modelSelection: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        modelExecution: z.ZodOptional<z.ZodObject<{
            memoryExtraction: z.ZodOptional<z.ZodLiteral<"skip">>;
            selectionScope: z.ZodLiteral<"execution">;
            requestAuth: z.ZodOptional<z.ZodObject<{
                apiKey: z.ZodOptional<z.ZodString>;
                apiKeyId: z.ZodOptional<z.ZodString>;
                accountScope: z.ZodOptional<z.ZodString>;
                headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$strict>>;
            subagents: z.ZodOptional<z.ZodObject<{
                foregroundModel: z.ZodLiteral<"submission">;
                background: z.ZodLiteral<"deny">;
            }, z.core.$strict>>;
            selectionFallback: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                rules: z.ZodArray<z.ZodObject<{
                    reason: z.ZodEnum<{
                        highspeed_card_expired: "highspeed_card_expired";
                        highspeed_request_failed: "highspeed_request_failed";
                    }>;
                    providerErrorCode: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                target: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        highspeedMeta: z.ZodOptional<z.ZodObject<{
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
    }, z.core.$strip>;
    readonly editQueueItem: z.ZodObject<{
        queueItemId: z.ZodString;
        newText: z.ZodString;
    }, z.core.$strip>;
    readonly reorderQueueItem: z.ZodObject<{
        queueItemId: z.ZodString;
        beforeQueueItemId: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
    readonly deleteQueueItem: z.ZodObject<{
        queueItemId: z.ZodString;
    }, z.core.$strip>;
    readonly setAutoDrain: z.ZodObject<{
        autoDrain: z.ZodBoolean;
    }, z.core.$strip>;
    readonly resolveInteraction: z.ZodObject<{
        interactionId: z.ZodString;
        answer: z.ZodObject<{
            optionId: z.ZodOptional<z.ZodString>;
            freeText: z.ZodOptional<z.ZodString>;
            action: z.ZodOptional<z.ZodEnum<{
                accept: "accept";
                decline: "decline";
                cancel: "cancel";
            }>>;
            content: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    readonly respondWorkspaceHookReview: z.ZodObject<{
        sessionId: z.ZodString;
        taskId: z.ZodString;
        runId: z.ZodString;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceIdentity: z.ZodString;
        bundleDigest: z.ZodString;
        reviewFlowId: z.ZodString;
        generation: z.ZodNumber;
        interactionId: z.ZodString;
        decision: z.ZodObject<{
            action: z.ZodLiteral<"trust_selected">;
            reviewItemIds: z.ZodArray<z.ZodString>;
        }, z.core.$strict>;
    }, z.core.$strict>;
    readonly toggleWorkspaceHookReviewItem: z.ZodObject<{
        sessionId: z.ZodString;
        taskId: z.ZodString;
        runId: z.ZodString;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceIdentity: z.ZodString;
        bundleDigest: z.ZodString;
        reviewFlowId: z.ZodString;
        generation: z.ZodNumber;
        interactionId: z.ZodString;
        reviewItemId: z.ZodString;
        enabled: z.ZodBoolean;
    }, z.core.$strict>;
    readonly revokeWorkspaceHookTrust: z.ZodUnion<readonly [z.ZodObject<{
        sessionId: z.ZodString;
        taskId: z.ZodString;
        runId: z.ZodString;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceIdentity: z.ZodString;
        bundleDigest: z.ZodString;
        reviewFlowId: z.ZodString;
        generation: z.ZodNumber;
        interactionId: z.ZodString;
        reviewItemIds: z.ZodArray<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        sessionId: z.ZodString;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceIdentity: z.ZodString;
        bundleDigest: z.ZodString;
        hookDeclarationDigests: z.ZodArray<z.ZodString>;
    }, z.core.$strict>]>;
    readonly requestWorkspaceHookReview: z.ZodObject<{
        sessionId: z.ZodString;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceIdentity: z.ZodString;
        bundleDigest: z.ZodString;
    }, z.core.$strict>;
    readonly snoozeInteractionAutoResolution: z.ZodObject<{
        interactionId: z.ZodString;
    }, z.core.$strip>;
    readonly switchModelConfig: z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        thought: z.ZodString;
    }, z.core.$strip>;
    readonly switchCollaborationMode: z.ZodObject<{
        mode: z.ZodEnum<{
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
        }>;
    }, z.core.$strip>;
    readonly setFollowupMode: z.ZodObject<{
        mode: z.ZodEnum<{
            queue: "queue";
            guide: "guide";
        }>;
    }, z.core.$strip>;
    readonly pauseGoal: z.ZodObject<{}, z.core.$strip>;
    readonly resumeGoal: z.ZodObject<{}, z.core.$strip>;
    readonly cancelBackgroundWork: z.ZodObject<{
        workId: z.ZodString;
    }, z.core.$strip>;
    readonly resumeWorkflowRun: z.ZodObject<{
        workId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    readonly startSavedWorkflow: z.ZodObject<{
        name: z.ZodString;
        scope: z.ZodOptional<z.ZodEnum<{
            project: "project";
            global: "global";
        }>>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>;
    readonly amendWorkflowRunSettings: z.ZodObject<{
        workId: z.ZodString;
        subagentModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        maxConcurrency: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>;
    readonly renameSession: z.ZodObject<{
        title: z.ZodString;
    }, z.core.$strip>;
    readonly deleteSession: z.ZodObject<{}, z.core.$strip>;
    readonly discardSharedContext: z.ZodObject<{
        contextId: z.ZodString;
    }, z.core.$strict>;
};
export type CommandType = keyof typeof commandPayloadSchemas;
export type CommandPayloadMap = {
    [T in CommandType]: T extends "sendText" ? z.infer<(typeof commandPayloadSchemas)[T]> & import("../zcode-task-types-core.js").ZCodeBackgroundTurnAttribution : z.infer<(typeof commandPayloadSchemas)[T]>;
};
export declare const commandTypeSchema: z.ZodEnum<{
    compact: "compact";
    stop: "stop";
    sendText: "sendText";
    sendGoalCommand: "sendGoalCommand";
    switchModelConfig: "switchModelConfig";
    setFollowupMode: "setFollowupMode";
    sendQueuedNow: "sendQueuedNow";
    pauseGoal: "pauseGoal";
    resumeGoal: "resumeGoal";
    amendWorkflowRunSettings: "amendWorkflowRunSettings";
    createSession: "createSession";
    createSelectionSideSession: "createSelectionSideSession";
    forkAssistant: "forkAssistant";
    applyFileRewind: "applyFileRewind";
    editUserQuery: "editUserQuery";
    retryTurn: "retryTurn";
    setAssistantFeedback: "setAssistantFeedback";
    setHighspeedMetrics: "setHighspeedMetrics";
    editQueueItem: "editQueueItem";
    reorderQueueItem: "reorderQueueItem";
    deleteQueueItem: "deleteQueueItem";
    setAutoDrain: "setAutoDrain";
    resolveInteraction: "resolveInteraction";
    respondWorkspaceHookReview: "respondWorkspaceHookReview";
    toggleWorkspaceHookReviewItem: "toggleWorkspaceHookReviewItem";
    revokeWorkspaceHookTrust: "revokeWorkspaceHookTrust";
    requestWorkspaceHookReview: "requestWorkspaceHookReview";
    snoozeInteractionAutoResolution: "snoozeInteractionAutoResolution";
    switchCollaborationMode: "switchCollaborationMode";
    cancelBackgroundWork: "cancelBackgroundWork";
    resumeWorkflowRun: "resumeWorkflowRun";
    startSavedWorkflow: "startSavedWorkflow";
    renameSession: "renameSession";
    deleteSession: "deleteSession";
    discardSharedContext: "discardSharedContext";
}>;
export declare const BACKGROUND_WORK_CANCEL_REJECTED_FAULT_PREFIX: "fault.command.backgroundWorkCancelRejected.";
export declare const COMMANDS_REQUIRING_BASE_REVISION: ReadonlySet<CommandType>;
export declare const ROW_TARGETING_COMMANDS: ReadonlySet<CommandType>;
export declare const commandEnvelopeSchema: z.ZodObject<{
    ttft: z.ZodOptional<z.ZodObject<{
        version: z.ZodLiteral<1>;
        observationId: z.ZodString;
    }, z.core.$strict>>;
    commandId: z.ZodString;
    clientId: z.ZodString;
    sessionId: z.ZodNullable<z.ZodString>;
    baseRevision: z.ZodOptional<z.ZodNumber>;
    baseLogEpoch: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        compact: "compact";
        stop: "stop";
        sendText: "sendText";
        sendGoalCommand: "sendGoalCommand";
        switchModelConfig: "switchModelConfig";
        setFollowupMode: "setFollowupMode";
        sendQueuedNow: "sendQueuedNow";
        pauseGoal: "pauseGoal";
        resumeGoal: "resumeGoal";
        amendWorkflowRunSettings: "amendWorkflowRunSettings";
        createSession: "createSession";
        createSelectionSideSession: "createSelectionSideSession";
        forkAssistant: "forkAssistant";
        applyFileRewind: "applyFileRewind";
        editUserQuery: "editUserQuery";
        retryTurn: "retryTurn";
        setAssistantFeedback: "setAssistantFeedback";
        setHighspeedMetrics: "setHighspeedMetrics";
        editQueueItem: "editQueueItem";
        reorderQueueItem: "reorderQueueItem";
        deleteQueueItem: "deleteQueueItem";
        setAutoDrain: "setAutoDrain";
        resolveInteraction: "resolveInteraction";
        respondWorkspaceHookReview: "respondWorkspaceHookReview";
        toggleWorkspaceHookReviewItem: "toggleWorkspaceHookReviewItem";
        revokeWorkspaceHookTrust: "revokeWorkspaceHookTrust";
        requestWorkspaceHookReview: "requestWorkspaceHookReview";
        snoozeInteractionAutoResolution: "snoozeInteractionAutoResolution";
        switchCollaborationMode: "switchCollaborationMode";
        cancelBackgroundWork: "cancelBackgroundWork";
        resumeWorkflowRun: "resumeWorkflowRun";
        startSavedWorkflow: "startSavedWorkflow";
        renameSession: "renameSession";
        deleteSession: "deleteSession";
        discardSharedContext: "discardSharedContext";
    }>;
    payload: z.ZodUnknown;
    issuedAt: z.ZodNumber;
}, z.core.$strip>;
export type CommandEnvelope = z.infer<typeof commandEnvelopeSchema>;
/** 校验信封并按 type 校验 payload（信封 schema 无法静态关联 payload，收口在这里）。 */
export declare function parseCommandEnvelope(value: unknown): {
    ok: true;
    envelope: CommandEnvelope;
} | {
    ok: false;
    error: z.ZodError;
};
export declare const commandResultSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodEnum<{
        createSession: "createSession";
        createSelectionSideSession: "createSelectionSideSession";
        forkAssistant: "forkAssistant";
    }>;
    sessionId: z.ZodString;
    input: z.ZodOptional<z.ZodObject<{
        delivery: z.ZodEnum<{
            queue: "queue";
            guide: "guide";
            startNow: "startNow";
        }>;
        inputId: z.ZodString;
        messageId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"resolveInteraction">;
    resolvedBy: z.ZodObject<{
        clientId: z.ZodString;
        optionId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"applyFileRewind">;
    applied: z.ZodBoolean;
    preview: z.ZodObject<{
        canApply: z.ZodBoolean;
        ignoredFiles: z.ZodArray<z.ZodObject<{
            operationCount: z.ZodNumber;
            path: z.ZodString;
            reason: z.ZodLiteral<"bash_ignored">;
            toolNames: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
        safeFiles: z.ZodArray<z.ZodObject<{
            action: z.ZodEnum<{
                delete: "delete";
                restore: "restore";
            }>;
            operationCount: z.ZodNumber;
            path: z.ZodString;
            toolNames: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
        unsafeFiles: z.ZodArray<z.ZodObject<{
            currentHash: z.ZodOptional<z.ZodString>;
            expectedHash: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
            operationCount: z.ZodNumber;
            path: z.ZodString;
            reason: z.ZodEnum<{
                checkpoint_missing: "checkpoint_missing";
                checkpoint_unreadable: "checkpoint_unreadable";
                external_modified: "external_modified";
                file_read_failed: "file_read_failed";
                unsupported_checkpoint: "unsupported_checkpoint";
            }>;
            toolNames: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    response: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"editUserQuery">;
    disposition: z.ZodEnum<{
        fork: "fork";
        rewind: "rewind";
        blocked: "blocked";
    }>;
    sessionId: z.ZodString;
    reasonCode: z.ZodOptional<z.ZodString>;
    preview: z.ZodOptional<z.ZodObject<{
        canApply: z.ZodBoolean;
        ignoredFiles: z.ZodArray<z.ZodObject<{
            operationCount: z.ZodNumber;
            path: z.ZodString;
            reason: z.ZodLiteral<"bash_ignored">;
            toolNames: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
        safeFiles: z.ZodArray<z.ZodObject<{
            action: z.ZodEnum<{
                delete: "delete";
                restore: "restore";
            }>;
            operationCount: z.ZodNumber;
            path: z.ZodString;
            toolNames: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
        unsafeFiles: z.ZodArray<z.ZodObject<{
            currentHash: z.ZodOptional<z.ZodString>;
            expectedHash: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
            operationCount: z.ZodNumber;
            path: z.ZodString;
            reason: z.ZodEnum<{
                checkpoint_missing: "checkpoint_missing";
                checkpoint_unreadable: "checkpoint_unreadable";
                external_modified: "external_modified";
                file_read_failed: "file_read_failed";
                unsupported_checkpoint: "unsupported_checkpoint";
            }>;
            toolNames: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"startSavedWorkflow">;
    runId: z.ZodString;
    toolCallId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"amendWorkflowRunSettings">;
    runId: z.ZodString;
    toolCallId: z.ZodString;
    supersededRunId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"inputAccepted">;
    delivery: z.ZodEnum<{
        queue: "queue";
        guide: "guide";
        startNow: "startNow";
    }>;
    inputId: z.ZodString;
    messageId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"inputDisposition">;
    delivery: z.ZodEnum<{
        queue: "queue";
        guide: "guide";
        startNow: "startNow";
    }>;
}, z.core.$strip>], "type">;
export type CommandResult = z.infer<typeof commandResultSchema>;
export declare const commandAckSchema: z.ZodObject<{
    memoryEnabled: z.ZodOptional<z.ZodBoolean>;
    ttftExcluded: z.ZodOptional<z.ZodLiteral<"capacity">>;
    commandId: z.ZodString;
    status: z.ZodEnum<{
        failed: "failed";
        stale: "stale";
        duplicate: "duplicate";
        accepted: "accepted";
        rejected: "rejected";
        noop: "noop";
    }>;
    reasonCode: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    revisionAtDecision: z.ZodNumber;
    result: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodEnum<{
            createSession: "createSession";
            createSelectionSideSession: "createSelectionSideSession";
            forkAssistant: "forkAssistant";
        }>;
        sessionId: z.ZodString;
        input: z.ZodOptional<z.ZodObject<{
            delivery: z.ZodEnum<{
                queue: "queue";
                guide: "guide";
                startNow: "startNow";
            }>;
            inputId: z.ZodString;
            messageId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resolveInteraction">;
        resolvedBy: z.ZodObject<{
            clientId: z.ZodString;
            optionId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"applyFileRewind">;
        applied: z.ZodBoolean;
        preview: z.ZodObject<{
            canApply: z.ZodBoolean;
            ignoredFiles: z.ZodArray<z.ZodObject<{
                operationCount: z.ZodNumber;
                path: z.ZodString;
                reason: z.ZodLiteral<"bash_ignored">;
                toolNames: z.ZodArray<z.ZodString>;
            }, z.core.$strict>>;
            safeFiles: z.ZodArray<z.ZodObject<{
                action: z.ZodEnum<{
                    delete: "delete";
                    restore: "restore";
                }>;
                operationCount: z.ZodNumber;
                path: z.ZodString;
                toolNames: z.ZodArray<z.ZodString>;
            }, z.core.$strict>>;
            unsafeFiles: z.ZodArray<z.ZodObject<{
                currentHash: z.ZodOptional<z.ZodString>;
                expectedHash: z.ZodOptional<z.ZodString>;
                message: z.ZodOptional<z.ZodString>;
                operationCount: z.ZodNumber;
                path: z.ZodString;
                reason: z.ZodEnum<{
                    checkpoint_missing: "checkpoint_missing";
                    checkpoint_unreadable: "checkpoint_unreadable";
                    external_modified: "external_modified";
                    file_read_failed: "file_read_failed";
                    unsupported_checkpoint: "unsupported_checkpoint";
                }>;
                toolNames: z.ZodArray<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        response: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"editUserQuery">;
        disposition: z.ZodEnum<{
            fork: "fork";
            rewind: "rewind";
            blocked: "blocked";
        }>;
        sessionId: z.ZodString;
        reasonCode: z.ZodOptional<z.ZodString>;
        preview: z.ZodOptional<z.ZodObject<{
            canApply: z.ZodBoolean;
            ignoredFiles: z.ZodArray<z.ZodObject<{
                operationCount: z.ZodNumber;
                path: z.ZodString;
                reason: z.ZodLiteral<"bash_ignored">;
                toolNames: z.ZodArray<z.ZodString>;
            }, z.core.$strict>>;
            safeFiles: z.ZodArray<z.ZodObject<{
                action: z.ZodEnum<{
                    delete: "delete";
                    restore: "restore";
                }>;
                operationCount: z.ZodNumber;
                path: z.ZodString;
                toolNames: z.ZodArray<z.ZodString>;
            }, z.core.$strict>>;
            unsafeFiles: z.ZodArray<z.ZodObject<{
                currentHash: z.ZodOptional<z.ZodString>;
                expectedHash: z.ZodOptional<z.ZodString>;
                message: z.ZodOptional<z.ZodString>;
                operationCount: z.ZodNumber;
                path: z.ZodString;
                reason: z.ZodEnum<{
                    checkpoint_missing: "checkpoint_missing";
                    checkpoint_unreadable: "checkpoint_unreadable";
                    external_modified: "external_modified";
                    file_read_failed: "file_read_failed";
                    unsupported_checkpoint: "unsupported_checkpoint";
                }>;
                toolNames: z.ZodArray<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"startSavedWorkflow">;
        runId: z.ZodString;
        toolCallId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"amendWorkflowRunSettings">;
        runId: z.ZodString;
        toolCallId: z.ZodString;
        supersededRunId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"inputAccepted">;
        delivery: z.ZodEnum<{
            queue: "queue";
            guide: "guide";
            startNow: "startNow";
        }>;
        inputId: z.ZodString;
        messageId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"inputDisposition">;
        delivery: z.ZodEnum<{
            queue: "queue";
            guide: "guide";
            startNow: "startNow";
        }>;
    }, z.core.$strip>], "type">>;
}, z.core.$strip>;
export type CommandAck = z.infer<typeof commandAckSchema>;
export declare const commandKeySchema: z.ZodObject<{
    sessionId: z.ZodNullable<z.ZodString>;
    commandId: z.ZodString;
}, z.core.$strict>;
export type CommandKey = z.infer<typeof commandKeySchema>;
export declare const commandsQueryParamsSchema: z.ZodObject<{
    commands: z.ZodArray<z.ZodObject<{
        sessionId: z.ZodNullable<z.ZodString>;
        commandId: z.ZodString;
    }, z.core.$strict>>;
    clock: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export type CommandsQueryParams = z.infer<typeof commandsQueryParamsSchema>;
export declare const commandQueryItemSchema: z.ZodObject<{
    key: z.ZodObject<{
        sessionId: z.ZodNullable<z.ZodString>;
        commandId: z.ZodString;
    }, z.core.$strict>;
    result: z.ZodUnion<readonly [z.ZodObject<{
        memoryEnabled: z.ZodOptional<z.ZodBoolean>;
        ttftExcluded: z.ZodOptional<z.ZodLiteral<"capacity">>;
        commandId: z.ZodString;
        status: z.ZodEnum<{
            failed: "failed";
            stale: "stale";
            duplicate: "duplicate";
            accepted: "accepted";
            rejected: "rejected";
            noop: "noop";
        }>;
        reasonCode: z.ZodOptional<z.ZodString>;
        message: z.ZodOptional<z.ZodString>;
        revisionAtDecision: z.ZodNumber;
        result: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodEnum<{
                createSession: "createSession";
                createSelectionSideSession: "createSelectionSideSession";
                forkAssistant: "forkAssistant";
            }>;
            sessionId: z.ZodString;
            input: z.ZodOptional<z.ZodObject<{
                delivery: z.ZodEnum<{
                    queue: "queue";
                    guide: "guide";
                    startNow: "startNow";
                }>;
                inputId: z.ZodString;
                messageId: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resolveInteraction">;
            resolvedBy: z.ZodObject<{
                clientId: z.ZodString;
                optionId: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"applyFileRewind">;
            applied: z.ZodBoolean;
            preview: z.ZodObject<{
                canApply: z.ZodBoolean;
                ignoredFiles: z.ZodArray<z.ZodObject<{
                    operationCount: z.ZodNumber;
                    path: z.ZodString;
                    reason: z.ZodLiteral<"bash_ignored">;
                    toolNames: z.ZodArray<z.ZodString>;
                }, z.core.$strict>>;
                safeFiles: z.ZodArray<z.ZodObject<{
                    action: z.ZodEnum<{
                        delete: "delete";
                        restore: "restore";
                    }>;
                    operationCount: z.ZodNumber;
                    path: z.ZodString;
                    toolNames: z.ZodArray<z.ZodString>;
                }, z.core.$strict>>;
                unsafeFiles: z.ZodArray<z.ZodObject<{
                    currentHash: z.ZodOptional<z.ZodString>;
                    expectedHash: z.ZodOptional<z.ZodString>;
                    message: z.ZodOptional<z.ZodString>;
                    operationCount: z.ZodNumber;
                    path: z.ZodString;
                    reason: z.ZodEnum<{
                        checkpoint_missing: "checkpoint_missing";
                        checkpoint_unreadable: "checkpoint_unreadable";
                        external_modified: "external_modified";
                        file_read_failed: "file_read_failed";
                        unsupported_checkpoint: "unsupported_checkpoint";
                    }>;
                    toolNames: z.ZodArray<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            response: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"editUserQuery">;
            disposition: z.ZodEnum<{
                fork: "fork";
                rewind: "rewind";
                blocked: "blocked";
            }>;
            sessionId: z.ZodString;
            reasonCode: z.ZodOptional<z.ZodString>;
            preview: z.ZodOptional<z.ZodObject<{
                canApply: z.ZodBoolean;
                ignoredFiles: z.ZodArray<z.ZodObject<{
                    operationCount: z.ZodNumber;
                    path: z.ZodString;
                    reason: z.ZodLiteral<"bash_ignored">;
                    toolNames: z.ZodArray<z.ZodString>;
                }, z.core.$strict>>;
                safeFiles: z.ZodArray<z.ZodObject<{
                    action: z.ZodEnum<{
                        delete: "delete";
                        restore: "restore";
                    }>;
                    operationCount: z.ZodNumber;
                    path: z.ZodString;
                    toolNames: z.ZodArray<z.ZodString>;
                }, z.core.$strict>>;
                unsafeFiles: z.ZodArray<z.ZodObject<{
                    currentHash: z.ZodOptional<z.ZodString>;
                    expectedHash: z.ZodOptional<z.ZodString>;
                    message: z.ZodOptional<z.ZodString>;
                    operationCount: z.ZodNumber;
                    path: z.ZodString;
                    reason: z.ZodEnum<{
                        checkpoint_missing: "checkpoint_missing";
                        checkpoint_unreadable: "checkpoint_unreadable";
                        external_modified: "external_modified";
                        file_read_failed: "file_read_failed";
                        unsupported_checkpoint: "unsupported_checkpoint";
                    }>;
                    toolNames: z.ZodArray<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"startSavedWorkflow">;
            runId: z.ZodString;
            toolCallId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"amendWorkflowRunSettings">;
            runId: z.ZodString;
            toolCallId: z.ZodString;
            supersededRunId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"inputAccepted">;
            delivery: z.ZodEnum<{
                queue: "queue";
                guide: "guide";
                startNow: "startNow";
            }>;
            inputId: z.ZodString;
            messageId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"inputDisposition">;
            delivery: z.ZodEnum<{
                queue: "queue";
                guide: "guide";
                startNow: "startNow";
            }>;
        }, z.core.$strip>], "type">>;
    }, z.core.$strip>, z.ZodLiteral<"unknown">]>;
}, z.core.$strict>;
export type CommandQueryItem = z.infer<typeof commandQueryItemSchema>;
export declare const commandsQueryResultSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        key: z.ZodObject<{
            sessionId: z.ZodNullable<z.ZodString>;
            commandId: z.ZodString;
        }, z.core.$strict>;
        result: z.ZodUnion<readonly [z.ZodObject<{
            memoryEnabled: z.ZodOptional<z.ZodBoolean>;
            ttftExcluded: z.ZodOptional<z.ZodLiteral<"capacity">>;
            commandId: z.ZodString;
            status: z.ZodEnum<{
                failed: "failed";
                stale: "stale";
                duplicate: "duplicate";
                accepted: "accepted";
                rejected: "rejected";
                noop: "noop";
            }>;
            reasonCode: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
            revisionAtDecision: z.ZodNumber;
            result: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodEnum<{
                    createSession: "createSession";
                    createSelectionSideSession: "createSelectionSideSession";
                    forkAssistant: "forkAssistant";
                }>;
                sessionId: z.ZodString;
                input: z.ZodOptional<z.ZodObject<{
                    delivery: z.ZodEnum<{
                        queue: "queue";
                        guide: "guide";
                        startNow: "startNow";
                    }>;
                    inputId: z.ZodString;
                    messageId: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resolveInteraction">;
                resolvedBy: z.ZodObject<{
                    clientId: z.ZodString;
                    optionId: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"applyFileRewind">;
                applied: z.ZodBoolean;
                preview: z.ZodObject<{
                    canApply: z.ZodBoolean;
                    ignoredFiles: z.ZodArray<z.ZodObject<{
                        operationCount: z.ZodNumber;
                        path: z.ZodString;
                        reason: z.ZodLiteral<"bash_ignored">;
                        toolNames: z.ZodArray<z.ZodString>;
                    }, z.core.$strict>>;
                    safeFiles: z.ZodArray<z.ZodObject<{
                        action: z.ZodEnum<{
                            delete: "delete";
                            restore: "restore";
                        }>;
                        operationCount: z.ZodNumber;
                        path: z.ZodString;
                        toolNames: z.ZodArray<z.ZodString>;
                    }, z.core.$strict>>;
                    unsafeFiles: z.ZodArray<z.ZodObject<{
                        currentHash: z.ZodOptional<z.ZodString>;
                        expectedHash: z.ZodOptional<z.ZodString>;
                        message: z.ZodOptional<z.ZodString>;
                        operationCount: z.ZodNumber;
                        path: z.ZodString;
                        reason: z.ZodEnum<{
                            checkpoint_missing: "checkpoint_missing";
                            checkpoint_unreadable: "checkpoint_unreadable";
                            external_modified: "external_modified";
                            file_read_failed: "file_read_failed";
                            unsupported_checkpoint: "unsupported_checkpoint";
                        }>;
                        toolNames: z.ZodArray<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>;
                response: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"editUserQuery">;
                disposition: z.ZodEnum<{
                    fork: "fork";
                    rewind: "rewind";
                    blocked: "blocked";
                }>;
                sessionId: z.ZodString;
                reasonCode: z.ZodOptional<z.ZodString>;
                preview: z.ZodOptional<z.ZodObject<{
                    canApply: z.ZodBoolean;
                    ignoredFiles: z.ZodArray<z.ZodObject<{
                        operationCount: z.ZodNumber;
                        path: z.ZodString;
                        reason: z.ZodLiteral<"bash_ignored">;
                        toolNames: z.ZodArray<z.ZodString>;
                    }, z.core.$strict>>;
                    safeFiles: z.ZodArray<z.ZodObject<{
                        action: z.ZodEnum<{
                            delete: "delete";
                            restore: "restore";
                        }>;
                        operationCount: z.ZodNumber;
                        path: z.ZodString;
                        toolNames: z.ZodArray<z.ZodString>;
                    }, z.core.$strict>>;
                    unsafeFiles: z.ZodArray<z.ZodObject<{
                        currentHash: z.ZodOptional<z.ZodString>;
                        expectedHash: z.ZodOptional<z.ZodString>;
                        message: z.ZodOptional<z.ZodString>;
                        operationCount: z.ZodNumber;
                        path: z.ZodString;
                        reason: z.ZodEnum<{
                            checkpoint_missing: "checkpoint_missing";
                            checkpoint_unreadable: "checkpoint_unreadable";
                            external_modified: "external_modified";
                            file_read_failed: "file_read_failed";
                            unsupported_checkpoint: "unsupported_checkpoint";
                        }>;
                        toolNames: z.ZodArray<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"startSavedWorkflow">;
                runId: z.ZodString;
                toolCallId: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"amendWorkflowRunSettings">;
                runId: z.ZodString;
                toolCallId: z.ZodString;
                supersededRunId: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"inputAccepted">;
                delivery: z.ZodEnum<{
                    queue: "queue";
                    guide: "guide";
                    startNow: "startNow";
                }>;
                inputId: z.ZodString;
                messageId: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"inputDisposition">;
                delivery: z.ZodEnum<{
                    queue: "queue";
                    guide: "guide";
                    startNow: "startNow";
                }>;
            }, z.core.$strip>], "type">>;
        }, z.core.$strip>, z.ZodLiteral<"unknown">]>;
    }, z.core.$strict>>;
    clock: z.ZodOptional<z.ZodObject<{
        instanceId: z.ZodString;
        receivedAt: z.ZodNumber;
        sentAt: z.ZodNumber;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type CommandsQueryResult = z.infer<typeof commandsQueryResultSchema>;
//# sourceMappingURL=command.d.ts.map