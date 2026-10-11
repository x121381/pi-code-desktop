import { type IChannelServer } from "@zcode/rpc";
import type { ServiceDescriptor } from "./descriptors.js";
/**
 * ServiceCollection — 服务注册中心
 *
 * 服务端用来注册服务实例，并自动暴露到 ChannelServer。
 */
export declare class ServiceCollection {
    private readonly _services;
    register<T>(descriptor: ServiceDescriptor<T>, instance: T): this;
    get<T>(descriptor: ServiceDescriptor<T>): T;
    getOptional<T>(descriptor: ServiceDescriptor<T>): T | undefined;
    /** 将所有已注册的服务自动暴露为 channel */
    exposeOnChannelServer(server: IChannelServer, overrides?: ReadonlyMap<string, unknown>): void;
}
//# sourceMappingURL=collection.d.ts.map