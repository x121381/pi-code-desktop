import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
interface AppErrorBoundaryProps {
    children: ReactNode;
    isDesktop?: boolean;
    isMacDesktop?: boolean;
    isWindowsDesktop?: boolean;
    /**
     * React 错误边界捕获的异常不会冒泡到 window.onerror，监控 SDK默认收不到。
     * Desktop 等宿主可传入此回调，将 React 错误边界捕获的异常转发到监控 SDK。
     */
    onCaughtReactError?: (error: Error, errorInfo: ErrorInfo) => void;
}
interface AppErrorBoundaryState {
    error: Error | null;
    componentStack: string;
}
export type ScopedErrorBoundaryVariant = "panel" | "inline" | "compact" | "silent";
interface ScopedErrorBoundaryProps {
    children: ReactNode;
    scope: string;
    resetKeys?: readonly unknown[];
    variant?: ScopedErrorBoundaryVariant;
    className?: string;
    onReset?: () => void;
    onCaughtReactError?: (error: Error, errorInfo: ErrorInfo, scope: string) => void;
}
/**
 * AppErrorBoundary —— React 根级错误边界
 *
 * renderer 入口若直接把 ZCodeIntlProvider / Root 挂到 createRoot，
 * 一旦某个 Provider 或页面组件在 render / lifecycle 阶段抛错，React 会整棵树卸载，
 * 用户看到的就只剩一张白屏。这里包一层共享根级边界，把异常收敛成可恢复 fallback，
 * 至少保证界面还能给出“重试 / 刷新”的出口，并把错误打到统一 UI 日志里。
 */
export declare class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
    state: AppErrorBoundaryState;
    static getDerivedStateFromError(error: unknown): AppErrorBoundaryState;
    componentDidCatch(error: unknown, errorInfo: ErrorInfo): void;
    private handleReset;
    private handleReload;
    render(): string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
}
/**
 * ScopedErrorBoundary —— 局部 UI 故障隔离边界
 *
 * 只有根级错误边界时，workspace 内任意一个面板 render 抛错都会一路冒泡到根，
 * 最终把整套界面替换成全屏错误页。这里提供可复用的局部边界，让 sidebar、chat、
 * terminal、side pane 等区域各自失败各自恢复，避免单个组件问题扩大成整窗不可用。
 */
export declare class ScopedErrorBoundary extends Component<ScopedErrorBoundaryProps, AppErrorBoundaryState> {
    state: AppErrorBoundaryState;
    static getDerivedStateFromError(error: unknown): AppErrorBoundaryState;
    componentDidCatch(error: unknown, errorInfo: ErrorInfo): void;
    componentDidUpdate(previousProps: ScopedErrorBoundaryProps): void;
    private handleReset;
    private handleReload;
    render(): string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
}
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map