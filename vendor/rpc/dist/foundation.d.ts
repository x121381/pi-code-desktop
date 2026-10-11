/**
 * Layer 0: 基础设施
 * - IDisposable / DisposableStore: 资源生命周期管理
 * - Event / Emitter: 事件系统
 * - CancellationToken: 取消令牌
 *
 * 这些是整个 IPC 框架的地基，所有上层模块都依赖它们。
 */
export interface IDisposable {
    dispose(): void;
}
export declare function toDisposable(fn: () => void): IDisposable;
/**
 * DisposableStore 收集多个 IDisposable，统一释放。
 * VS Code 里几乎每个类都有一个 DisposableStore 来管理子资源。
 */
export declare class DisposableStore implements IDisposable {
    private items;
    private isDisposed;
    add<T extends IDisposable>(item: T): T;
    dispose(): void;
}
/**
 * Event<T> 就是一个函数签名：传入 listener，返回一个 IDisposable 用于取消订阅。
 * 这是整个 IPC 框架中事件流转的核心类型。
 */
export type Event<T> = (listener: (e: T) => void) => IDisposable;
export declare namespace Event {
    /** 永远不触发的事件 */
    const None: Event<any>;
    /** 只触发一次就自动取消订阅 */
    function once<T>(event: Event<T>): Event<T>;
    /** 把事件转为 Promise，resolve 后自动取消订阅 */
    function toPromise<T>(event: Event<T>): Promise<T>;
    /** 过滤事件 */
    function filter<T>(event: Event<T>, fn: (e: T) => boolean): Event<T>;
    /** 映射事件 */
    function map<T, R>(event: Event<T>, fn: (e: T) => R): Event<R>;
}
/**
 * Emitter<T> 是事件的发射器。
 *
 * 关键设计：
 * - onWillAddFirstListener: 第一个订阅者到来时触发（懒初始化资源）
 * - onDidRemoveLastListener: 最后一个订阅者离开时触发（释放资源）
 *
 * 这个"懒订阅"机制在 IPC 框架中至关重要——
 * ChannelClient 的 requestEvent 正是利用它来实现
 * "有人监听才发送 EventListen 请求，无人监听就发 EventDispose"。
 */
export declare class Emitter<T> implements IDisposable {
    private listeners;
    private disposed;
    private options?;
    constructor(options?: EmitterOptions);
    get event(): Event<T>;
    fire(event: T): void;
    dispose(): void;
}
interface EmitterOptions {
    onWillAddFirstListener?: () => void;
    onDidRemoveLastListener?: () => void;
}
/**
 * Relay 是一个"事件中继器"，可以动态切换输入源。
 * 用于 getDelayedChannel 中：先创建 Relay，等 channel promise resolve 后切换 input。
 */
export declare class Relay<T> implements IDisposable {
    private emitter;
    private inputDisposable;
    readonly event: Event<T>;
    set input(event: Event<T>);
    dispose(): void;
}
/**
 * EventMultiplexer 聚合多个事件源为一个事件。
 * IPCServer 的 getMulticastEvent 用它来聚合所有客户端的同名事件。
 */
export declare class EventMultiplexer<T> implements IDisposable {
    private readonly emitter;
    private readonly disposables;
    readonly event: Event<T>;
    add(event: Event<T>): IDisposable;
    dispose(): void;
}
export interface CancellationToken {
    readonly isCancellationRequested: boolean;
    readonly onCancellationRequested: Event<void>;
}
export declare namespace CancellationToken {
    const None: CancellationToken;
}
export declare class CancellationTokenSource implements IDisposable {
    private _token?;
    private emitter;
    private _isCancelled;
    get token(): CancellationToken;
    cancel(): void;
    dispose(): void;
}
export {};
//# sourceMappingURL=foundation.d.ts.map