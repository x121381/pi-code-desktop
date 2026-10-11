import { z } from "zod";
export declare const conversationInputSourceSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"pluginUi">;
    pluginId: z.ZodString;
    toolCallId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"genUi">;
    path: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
}, z.core.$strict>], "kind">;
export type ConversationInputSource = z.infer<typeof conversationInputSourceSchema>;
export declare const conversationInputDeliverySchema: z.ZodObject<{
    requested: z.ZodEnum<{
        auto: "auto";
        queue: "queue";
        guide: "guide";
        startNow: "startNow";
    }>;
    admitted: z.ZodEnum<{
        queue: "queue";
        guide: "guide";
        startNow: "startNow";
    }>;
    fallbackReasonCode: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const conversationInputOrderSchema: z.ZodObject<{
    admissionSeq: z.ZodNumber;
    queuePosition: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const conversationInputSteerSchema: z.ZodObject<{
    state: z.ZodEnum<{
        notRequested: "notRequested";
        submitting: "submitting";
        steering: "steering";
        guided: "guided";
        fellBack: "fellBack";
    }>;
    reasonCode: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const conversationInputDispatchSchema: z.ZodObject<{
    state: z.ZodEnum<{
        queued: "queued";
        reserved: "reserved";
        admitted: "admitted";
        promoting: "promoting";
        drained: "drained";
    }>;
    reservationId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const conversationInputIntentSchema: z.ZodObject<{
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
    sourceCommandId: z.ZodString;
    queueItemId: z.ZodString;
    clientId: z.ZodString;
    kind: z.ZodEnum<{
        compact: "compact";
        sendText: "sendText";
        sendGoalCommand: "sendGoalCommand";
    }>;
    text: z.ZodString;
    attachments: z.ZodDefault<z.ZodArray<z.ZodObject<{
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
    sharedContextRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"shared_context_import">;
        context_id: z.ZodString;
    }, z.core.$strict>>>;
    delivery: z.ZodObject<{
        requested: z.ZodEnum<{
            auto: "auto";
            queue: "queue";
            guide: "guide";
            startNow: "startNow";
        }>;
        admitted: z.ZodEnum<{
            queue: "queue";
            guide: "guide";
            startNow: "startNow";
        }>;
        fallbackReasonCode: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    order: z.ZodObject<{
        admissionSeq: z.ZodNumber;
        queuePosition: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    steer: z.ZodObject<{
        state: z.ZodEnum<{
            notRequested: "notRequested";
            submitting: "submitting";
            steering: "steering";
            guided: "guided";
            fellBack: "fellBack";
        }>;
        reasonCode: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    dispatch: z.ZodObject<{
        state: z.ZodEnum<{
            queued: "queued";
            reserved: "reserved";
            admitted: "admitted";
            promoting: "promoting";
            drained: "drained";
        }>;
        reservationId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    admittedAt: z.ZodNumber;
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
    provenance: z.ZodOptional<z.ZodObject<{
        sourceCommandId: z.ZodString;
        queueItemId: z.ZodOptional<z.ZodString>;
        clientId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    source: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"pluginUi">;
        pluginId: z.ZodString;
        toolCallId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"genUi">;
        path: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "kind">>;
}, z.core.$strict>;
export type ConversationInputIntent = z.infer<typeof conversationInputIntentSchema>;
//# sourceMappingURL=input-intent.d.ts.map