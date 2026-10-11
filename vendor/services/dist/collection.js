import { ProxyChannel } from "@zcode/rpc";
/**
 * ServiceCollection — 服务注册中心
 *
 * 服务端用来注册服务实例，并自动暴露到 ChannelServer。
 */
export class ServiceCollection {
    _services = new Map();
    register(descriptor, instance) {
        this._services.set(descriptor.channelName, instance);
        return this;
    }
    get(descriptor) {
        const instance = this._services.get(descriptor.channelName);
        if (!instance) {
            throw new Error(`Service not registered: ${descriptor.channelName}`);
        }
        return instance;
    }
    getOptional(descriptor) {
        return this._services.get(descriptor.channelName);
    }
    /** 将所有已注册的服务自动暴露为 channel */
    exposeOnChannelServer(server, overrides = new Map()) {
        for (const [channelName, instance] of this._services) {
            const exposed = overrides.get(channelName) ?? instance;
            server.registerChannel(channelName, ProxyChannel.fromService(exposed));
        }
    }
}
//# sourceMappingURL=collection.js.map