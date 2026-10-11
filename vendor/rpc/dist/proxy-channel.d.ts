/**
 * Layer 5: ProxyChannel —— 服务自动代理（杀手锏）
 *
 * 这是让 VS Code 开发者效率极高的关键抽象。
 *
 * 没有 ProxyChannel 时，你需要为每个服务手写 IServerChannel：
 *   class FileServiceChannel implements IServerChannel {
 *     call(ctx, command, arg) {
 *       switch (command) {
 *         case 'readFile': return this.service.readFile(arg[0]);
 *         case 'writeFile': return this.service.writeFile(arg[0], arg[1]);
 *         // ... 每个方法都要手动映射
 *       }
 *     }
 *   }
 *
 * 有了 ProxyChannel，一行代码搞定：
 *   const channel = ProxyChannel.fromService(fileService);
 *   // 自动把所有方法映射为 call，所有 on* 事件映射为 listen
 *
 * 客户端同样一行：
 *   const fileService = ProxyChannel.toService<IFileService>(channel);
 *   await fileService.readFile(uri);  // 就像调用本地方法！
 *
 * 原理：
 * - fromService: 遍历 service 的属性，方法 → call，on* 事件 → listen
 * - toService: 利用 ES6 Proxy 拦截属性访问，自动分派到 call/listen
 */
import { DisposableStore } from "./foundation.js";
import { IChannel, IServerChannel } from "./channels.js";
export declare namespace ProxyChannel {
    /**
     * 服务端：把一个 service 对象自动包装为 IServerChannel
     *
     * 约定：
     * - 以 on + 大写字母开头的属性视为事件 (如 onDidChange)
     * - 以 onDynamic + 大写字母开头的视为动态事件（方法，调用后返回事件）
     * - 其他方法视为 RPC 方法
     */
    function fromService<TContext>(service: unknown, disposables?: DisposableStore): IServerChannel<TContext>;
    /**
     * 客户端：把一个 IChannel 包装成类型安全的 service 对象
     *
     * 利用 ES6 Proxy 拦截所有属性访问：
     * - 访问 on* → channel.listen(propKey)
     * - 访问其他 → 返回一个函数，调用时变成 channel.call(propKey, args)
     */
    function toService<T extends object>(channel: IChannel, options?: {
        context?: unknown;
    }): T;
}
//# sourceMappingURL=proxy-channel.d.ts.map