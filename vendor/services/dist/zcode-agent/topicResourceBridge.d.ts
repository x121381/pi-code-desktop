import { type ZCodeTopicResourceReadParams, type ZCodeTopicResourceReadResult, type ZCodePromptAttachment, type ZCodeProtocolTrace } from "@zcode/shared";
export interface TopicResourceBridgeDependencies {
    validate(request: ZCodeTopicResourceReadParams, signal: AbortSignal, trace?: ZCodeProtocolTrace): Promise<void>;
    read(request: ZCodeTopicResourceReadParams, signal: AbortSignal, trace?: ZCodeProtocolTrace): Promise<ZCodePromptAttachment>;
    upload(request: ZCodeTopicResourceReadParams, attachment: ZCodePromptAttachment, signal: AbortSignal, trace?: ZCodeProtocolTrace): Promise<ZCodeTopicResourceReadResult>;
}
/** 每个实际 CLI 连接拥有独立取消域，不能取消另一工作区或另一任务的读取。 */
export declare function createTopicResourceBridge(dependencies: TopicResourceBridgeDependencies | (() => TopicResourceBridgeDependencies)): {
    read(value: unknown, trace?: ZCodeProtocolTrace): Promise<ZCodeTopicResourceReadResult>;
    cancel(request: {
        requestId: string;
        taskId: string;
    }): boolean;
    dispose(): void;
};
//# sourceMappingURL=topicResourceBridge.d.ts.map