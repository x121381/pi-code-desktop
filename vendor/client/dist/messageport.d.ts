import type { IServiceAccessor } from "@zcode/services";
export interface MessagePortServiceConnection {
    services: IServiceAccessor;
    dispose: (reason?: Error) => void;
}
/**
 * 创建一个带明确生命周期的 MessagePort service connection。
 *
 * scoped remote session 换代时必须同时释放 ChannelClient 和底层 port，
 * 否则旧 attachment 上的挂起 RPC 无法 settle，并会继续占用上层去重状态。
 */
export declare function createMessagePortServiceConnection(port: MessagePort): MessagePortServiceConnection;
/**
 * 通过 MessagePort 连接服务。
 *
 * Desktop 模式下，utilityProcess（或 main 进程的远程代理）通过 MessagePort
 * 暴露 ChannelServer，renderer 用此函数建立 ChannelClient 连接。
 */
export declare function connectViaMessagePort(port: MessagePort): IServiceAccessor;
//# sourceMappingURL=messageport.d.ts.map