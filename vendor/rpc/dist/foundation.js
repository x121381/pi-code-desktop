/**
 * Layer 0: 基础设施
 * - IDisposable / DisposableStore: 资源生命周期管理
 * - Event / Emitter: 事件系统
 * - CancellationToken: 取消令牌
 *
 * 这些是整个 IPC 框架的地基，所有上层模块都依赖它们。
 */
export function toDisposable(fn) {
    return { dispose: once(fn) };
}
function once(fn) {
    let called = false;
    return () => {
        if (!called) {
            called = true;
            fn();
        }
    };
}
/**
 * DisposableStore 收集多个 IDisposable，统一释放。
 * VS Code 里几乎每个类都有一个 DisposableStore 来管理子资源。
 */
export class DisposableStore {
    items = new Set();
    isDisposed = false;
    add(item) {
        if (this.isDisposed) {
            console.warn("Adding to a disposed DisposableStore");
            item.dispose();
            return item;
        }
        this.items.add(item);
        return item;
    }
    dispose() {
        if (this.isDisposed) {
            return;
        }
        this.isDisposed = true;
        for (const item of this.items) {
            item.dispose();
        }
        this.items.clear();
    }
}
export var Event;
(function (Event) {
    /** 永远不触发的事件 */
    Event.None = () => ({ dispose() { } });
    /** 只触发一次就自动取消订阅 */
    function once(event) {
        return (listener) => {
            let fired = false;
            const disposable = event((e) => {
                if (!fired) {
                    fired = true;
                    disposable.dispose();
                    listener(e);
                }
            });
            return disposable;
        };
    }
    Event.once = once;
    /** 把事件转为 Promise，resolve 后自动取消订阅 */
    function toPromise(event) {
        return new Promise((resolve) => once(event)(resolve));
    }
    Event.toPromise = toPromise;
    /** 过滤事件 */
    function filter(event, fn) {
        return (listener) => event((e) => {
            if (fn(e)) {
                listener(e);
            }
        });
    }
    Event.filter = filter;
    /** 映射事件 */
    function map(event, fn) {
        return (listener) => event((e) => listener(fn(e)));
    }
    Event.map = map;
})(Event || (Event = {}));
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
export class Emitter {
    listeners = new Set();
    disposed = false;
    options;
    constructor(options) {
        this.options = options;
    }
    get event() {
        return (listener) => {
            if (this.disposed) {
                return { dispose() { } };
            }
            const isFirst = this.listeners.size === 0;
            this.listeners.add(listener);
            if (isFirst) {
                this.options?.onWillAddFirstListener?.();
            }
            return toDisposable(() => {
                this.listeners.delete(listener);
                if (this.listeners.size === 0) {
                    this.options?.onDidRemoveLastListener?.();
                }
            });
        };
    }
    fire(event) {
        if (this.disposed) {
            return;
        }
        for (const listener of [...this.listeners]) {
            listener(event);
        }
    }
    dispose() {
        this.disposed = true;
        this.listeners.clear();
    }
}
/**
 * Relay 是一个"事件中继器"，可以动态切换输入源。
 * 用于 getDelayedChannel 中：先创建 Relay，等 channel promise resolve 后切换 input。
 */
export class Relay {
    emitter = new Emitter();
    inputDisposable = { dispose() { } };
    event = this.emitter.event;
    set input(event) {
        this.inputDisposable.dispose();
        this.inputDisposable = event((e) => this.emitter.fire(e));
    }
    dispose() {
        this.inputDisposable.dispose();
        this.emitter.dispose();
    }
}
/**
 * EventMultiplexer 聚合多个事件源为一个事件。
 * IPCServer 的 getMulticastEvent 用它来聚合所有客户端的同名事件。
 */
export class EventMultiplexer {
    emitter = new Emitter();
    disposables = [];
    event = this.emitter.event;
    add(event) {
        const d = event((e) => this.emitter.fire(e));
        this.disposables.push(d);
        return d;
    }
    dispose() {
        for (const d of this.disposables) {
            d.dispose();
        }
        this.emitter.dispose();
    }
}
export var CancellationToken;
(function (CancellationToken) {
    CancellationToken.None = {
        isCancellationRequested: false,
        onCancellationRequested: Event.None,
    };
})(CancellationToken || (CancellationToken = {}));
export class CancellationTokenSource {
    _token;
    emitter = new Emitter();
    _isCancelled = false;
    get token() {
        if (!this._token) {
            this._token = {
                isCancellationRequested: false,
                onCancellationRequested: this.emitter.event,
            };
        }
        return this._token;
    }
    cancel() {
        if (!this._isCancelled) {
            this._isCancelled = true;
            this.emitter.fire();
        }
    }
    dispose() {
        this.emitter.dispose();
    }
}
//# sourceMappingURL=foundation.js.map