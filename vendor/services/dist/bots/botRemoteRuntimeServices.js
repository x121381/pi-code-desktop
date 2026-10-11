import { ChannelClient, MessagePortProtocol, ProxyChannel, } from "@zcode/rpc";
import { IZCodeTaskService, } from "#src/session/zcodeTaskService.js";
import { IZCodeAgentService, } from "#src/zcode-agent/zcodeAgent.js";
import { IZCodeSessionService, } from "#src/zcode-session/zcodeSession.js";
import { IModelSelectionService, } from "#src/model-provider/providerFacadeServices.js";
function toMessagePortLike(port) {
    return {
        addEventListener(type, listener) {
            if (port.addEventListener) {
                port.addEventListener(type, listener);
                return;
            }
            port.on?.(type, listener);
        },
        removeEventListener(type, listener) {
            if (port.removeEventListener) {
                port.removeEventListener(type, listener);
                return;
            }
            port.off?.(type, listener);
        },
        postMessage(data) {
            port.postMessage(data);
        },
        start() {
            port.start?.();
        },
        close() {
            port.close?.();
        },
    };
}
export function createRemoteRuntimeServicesFromPort(port) {
    const protocol = new MessagePortProtocol(toMessagePortLike(port));
    const client = new ChannelClient(protocol);
    return {
        zcodeAgentService: ProxyChannel.toService(client.getChannel(IZCodeAgentService.channelName)),
        zcodeTaskService: ProxyChannel.toService(client.getChannel(IZCodeTaskService.channelName)),
        zcodeSessionService: ProxyChannel.toService(client.getChannel(IZCodeSessionService.channelName)),
        modelSelectionService: ProxyChannel.toService(client.getChannel(IModelSelectionService.channelName)),
    };
}
//# sourceMappingURL=botRemoteRuntimeServices.js.map