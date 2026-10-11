import { type IPlatformService } from "@zcode/shared";
/** ARMS 自定义事件名：React 错误边界捕获的渲染层异常 */
export declare const REACT_ERROR_ARMS_EVENT_NAME = "perf_react_error";
/** ARMS 业务分组 */
export declare const REACT_ERROR_ARMS_GROUP = "react_error";
/**
 * stack / componentStack 截断上限。
 * 原因：React 组件堆栈与错误栈可能很长，ARMS 单字段过长会被截断/拒绝，
 * 主动截断到上限保证关键头部（最近的抛错组件）一定上得去。
 */
export declare const REACT_ERROR_STACK_MAX_LEN = 4000;
type ArmsReporter = Pick<IPlatformService, "reportArmsCustomEvent">;
/**
 * 注入 ARMS reporter。
 *
 * 注意：必须在 renderer 入口 createRoot 之前注入，不能依赖 Root 的 effect。
 * 因为根级 AppErrorBoundary 的职责正是兜住 Root 自身渲染崩溃——若 reporter 走
 * Root effect 注入，Root 首帧就崩时 effect 从未执行，根级错误依旧丢失。
 */
export declare function setReactErrorArmsReporter(reporter: ArmsReporter | null): void;
export declare function clearReactErrorArmsReporterForTest(): void;
/**
 * 把 React 错误边界捕获的异常上报到 ARMS RUM。
 *
 * 背景：React 错误边界拦截子树渲染异常、阻止其冒泡到 window.onerror，
 * 而 Browser RUM SDK 靠 window.onerror / unhandledrejection 自动采集，
 * 故边界捕获的错误对 RUM 默认完全不可见，只能靠本地日志。这里把它转发到
 * 与 perf_crash 同一条 ARMS 自定义事件干道，补上这块盲区。
 */
export declare function reportReactErrorToArms(params: {
    error: Error;
    componentStack: string;
    scope?: string;
}): void;
export {};
//# sourceMappingURL=reactErrorArmsTelemetry.d.ts.map