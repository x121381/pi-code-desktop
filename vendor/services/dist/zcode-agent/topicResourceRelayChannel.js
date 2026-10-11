import { channelReplyHostRequestSchema } from "@zcode/shared";
import { zcodeTopicResourceRelayRequestSchema, zcodeTopicResourceRelayKeySchema, } from "@zcode/shared";
import { createTopicResourceRelay, } from "./topicResourceRelay.js";
/** 只注册在已鉴权远程连接的反向 server 上，不暴露在 Renderer/手机 service collection。 */
export function createTopicResourceRelayChannel(deps) {
    const relay = createTopicResourceRelay(deps);
    const validations = new Set();
    let disposed = false;
    const channel = {
        async call(_context, command, value, token) {
            if (disposed || token?.isCancellationRequested)
                throw new Error("Topic resource connection closed");
            if (command === "reply") {
                if (!deps.reply)
                    throw new Error("Channel reply unavailable");
                return (await deps.reply(channelReplyHostRequestSchema.parse(value)));
            }
            if (command === "validate") {
                const request = zcodeTopicResourceRelayRequestSchema.parse(value);
                if (validations.size >= 2)
                    throw new Error("Topic resource validation busy");
                const controller = new AbortController();
                validations.add(controller);
                const subscription = token?.onCancellationRequested(() => controller.abort());
                const timer = setTimeout(() => controller.abort(), 120_000);
                try {
                    await deps.validate(request, controller.signal);
                    controller.signal.throwIfAborted();
                    return { valid: true };
                }
                finally {
                    clearTimeout(timer);
                    subscription?.dispose();
                    validations.delete(controller);
                }
            }
            if (!["begin", "chunk", "finish", "cancel"].includes(command))
                throw new Error("Unsupported topic resource operation");
            const request = value && typeof value === "object" ? value : {};
            const key = zcodeTopicResourceRelayKeySchema.parse({
                requestId: request.requestId,
                taskId: request.taskId,
            });
            const subscription = token?.onCancellationRequested(() => {
                relay.cancel(key);
            });
            try {
                if (command === "begin")
                    return (await relay.begin(value));
                if (command === "chunk")
                    return (await relay.chunk(value));
                if (command === "finish")
                    return (await relay.finish(value));
                return { cancelled: relay.cancel(value) };
            }
            finally {
                subscription?.dispose();
            }
        },
        listen() {
            throw new Error("Topic resource events are unavailable");
        },
    };
    return {
        channel,
        dispose() {
            disposed = true;
            relay.dispose();
            for (const controller of validations)
                controller.abort();
            validations.clear();
        },
    };
}
//# sourceMappingURL=topicResourceRelayChannel.js.map