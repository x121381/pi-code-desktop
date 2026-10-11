import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Component } from "react";
import { DEFAULT_LOCALE } from "@zcode/shared";
import { DesktopWindowFrame } from "./DesktopWindowFrame.js";
import zhCN from "./i18n/locales/zh-CN.js";
import enUS from "./i18n/locales/en-US.js";
import { logger } from "./logger.js";
import { reportReactErrorToArms } from "./lib/reactErrorArmsTelemetry.js";
import { cn } from "./components/lib/utils.js";
import { Button } from "./components/ui/button.js";
import { AlertTriangleIcon, RefreshCw } from "lucide-react";
const LOCALE_PREFERENCE_KEY = "zcode-locale-preference";
function normalizeError(error) {
    if (error instanceof Error) {
        return error;
    }
    return new Error(typeof error === "string" ? error : "Unknown error");
}
function serializeErrorForLog(error) {
    return {
        name: error.name,
        message: error.message,
        ...(error.stack ? { stack: error.stack } : {}),
    };
}
function resolveBoundaryLocale() {
    if (typeof localStorage !== "undefined" && typeof localStorage.getItem === "function") {
        try {
            const storedPreference = localStorage.getItem(LOCALE_PREFERENCE_KEY);
            if (storedPreference === "zh-CN" || storedPreference === "en-US") {
                return storedPreference;
            }
        }
        catch {
            // 在 Node 测试环境里，可能出现“localStorage 对象存在但能力不完整/不可读”的场景
            // （例如只有占位对象或读取阶段直接抛错）。错误边界若不兜底会在 fallback 渲染期再次崩溃，
            // 用户就会看到白屏。这里吞掉存储层异常，继续回退到 navigator / 默认语言。
        }
    }
    if (typeof navigator !== "undefined") {
        return navigator.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en-US";
    }
    return DEFAULT_LOCALE;
}
function formatBoundaryMessage(id) {
    const locale = resolveBoundaryLocale();
    const messages = locale === "en-US" ? enUS : zhCN;
    return messages[id] ?? id;
}
function haveResetKeysChanged(previousKeys = [], nextKeys = []) {
    if (previousKeys.length !== nextKeys.length) {
        return true;
    }
    return previousKeys.some((previousKey, index) => !Object.is(previousKey, nextKeys[index]));
}
function ErrorFallback({ error, componentStack, onReset, onReload, isDesktop, isMacDesktop, isWindowsDesktop, }) {
    const errorSummary = error.message.trim() || formatBoundaryMessage("appError.unknown");
    return (_jsx(DesktopWindowFrame, { title: formatBoundaryMessage("appError.title"), isDesktop: isDesktop, isMacDesktop: isMacDesktop, isWindowsDesktop: isWindowsDesktop, children: _jsx("div", { className: "flex h-full min-h-0 justify-center overflow-y-auto p-6", children: _jsxs("div", { role: "alert", 
                // 错误信息和组件堆栈可能非常长，之前外层不可滚动会把内容挤出视口，
                // 用户既看不完堆栈，也点不到“重试/刷新”按钮。这里让 fallback 卡片固定从顶部开始，
                // 并配合外层纵向滚动，确保窗口再小也能完整访问全部操作。
                className: "w-full max-w-xl self-start rounded-3xl border border-destructive/20 bg-surface-alt p-6 shadow-sm", children: [_jsx("div", { className: "flex size-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive", children: _jsx(AlertTriangleIcon, { className: "size-5" }) }), _jsx("h1", { className: "mt-4 text-lg font-semibold text-foreground", children: formatBoundaryMessage("appError.title") }), _jsx("p", { className: "mt-2 text-ui-base leading-6 text-on-surface-muted", children: formatBoundaryMessage("appError.description") }), _jsx("div", { className: "mt-4 rounded-2xl border border-border bg-background px-3 py-2 font-mono text-ui-base leading-5 text-on-surface-muted", children: errorSummary }), _jsxs("div", { className: "mt-5 flex flex-wrap gap-2", children: [_jsx(Button, { type: "button", onClick: onReset, children: formatBoundaryMessage("appError.retry") }), _jsxs(Button, { type: "button", variant: "outline", onClick: onReload, children: [_jsx(RefreshCw, {}), formatBoundaryMessage("appError.reload")] })] }), _jsx("p", { className: "mt-4 text-ui-base leading-5 text-on-surface-muted", children: formatBoundaryMessage("appError.hint") }), componentStack ? (_jsxs("details", { className: "mt-4 rounded-2xl border border-border bg-background px-3 py-2", children: [_jsx("summary", { className: "cursor-pointer text-ui-base font-medium text-on-surface-muted", children: formatBoundaryMessage("appError.details") }), _jsx("pre", { className: "mt-2 max-h-[40vh] overflow-auto whitespace-pre-wrap break-words text-ui-base leading-5 text-on-surface-muted", children: componentStack.trim() })] })) : null] }) }) }));
}
function ScopedErrorFallback({ error, componentStack, onReset, onReload, variant = "panel", className, }) {
    if (variant === "silent") {
        return null;
    }
    const errorSummary = error.message.trim() || formatBoundaryMessage("appError.unknown");
    const isCompact = variant === "compact";
    const showDetails = variant !== "compact";
    if (isCompact) {
        return (_jsxs("div", { role: "alert", className: cn("flex min-h-10 items-center gap-2 border-border bg-surface px-3 py-2", className), children: [_jsx(AlertTriangleIcon, { className: "size-4 shrink-0 text-destructive" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "truncate text-ui-base font-medium text-foreground", children: formatBoundaryMessage("appError.sectionTitle") }), _jsx("p", { className: "truncate font-mono text-ui-base text-foreground-subtle", children: errorSummary })] }), _jsx(Button, { type: "button", size: "sm", variant: "outline", onClick: onReset, children: formatBoundaryMessage("appError.sectionRetry") })] }));
    }
    const content = (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive", children: _jsx(AlertTriangleIcon, { className: "size-4" }) }), _jsx("h2", { className: "mt-3 text-ui-base font-medium text-foreground", children: formatBoundaryMessage("appError.sectionTitle") }), _jsx("p", { className: "mt-1 text-ui-base leading-5 text-foreground-subtle", children: formatBoundaryMessage("appError.sectionDescription") }), _jsx("div", { className: "mt-3 rounded-lg border border-border bg-background px-3 py-2 font-mono text-ui-base leading-5 text-foreground-subtle", children: errorSummary }), _jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [_jsx(Button, { type: "button", size: "sm", onClick: onReset, children: formatBoundaryMessage("appError.sectionRetry") }), _jsxs(Button, { type: "button", size: "sm", variant: "outline", onClick: onReload, children: [_jsx(RefreshCw, {}), formatBoundaryMessage("appError.reload")] })] }), _jsx("p", { className: "mt-3 text-ui-base leading-5 text-foreground-subtle", children: formatBoundaryMessage("appError.sectionHint") }), showDetails && componentStack ? (_jsxs("details", { className: "mt-3 rounded-lg border border-border bg-background px-3 py-2", children: [_jsx("summary", { className: "cursor-pointer text-ui-base font-medium text-foreground-subtle", children: formatBoundaryMessage("appError.details") }), _jsx("pre", { className: "mt-2 max-h-[32vh] overflow-auto whitespace-pre-wrap break-words text-ui-base leading-5 text-foreground-subtle", children: componentStack.trim() })] })) : null] }));
    if (variant === "inline") {
        return (_jsx("div", { role: "alert", className: cn("w-full rounded-xl border border-destructive/20 bg-surface p-4", className), children: content }));
    }
    return (_jsx("div", { role: "alert", className: cn("flex h-full min-h-0 items-center justify-center overflow-auto bg-background p-4", className), children: _jsx("div", { className: "w-full max-w-md rounded-xl border border-destructive/20 bg-surface p-4 shadow-sm", children: content }) }));
}
/**
 * AppErrorBoundary —— React 根级错误边界
 *
 * renderer 入口若直接把 ZCodeIntlProvider / Root 挂到 createRoot，
 * 一旦某个 Provider 或页面组件在 render / lifecycle 阶段抛错，React 会整棵树卸载，
 * 用户看到的就只剩一张白屏。这里包一层共享根级边界，把异常收敛成可恢复 fallback，
 * 至少保证界面还能给出“重试 / 刷新”的出口，并把错误打到统一 UI 日志里。
 */
export class AppErrorBoundary extends Component {
    state = {
        error: null,
        componentStack: "",
    };
    static getDerivedStateFromError(error) {
        return {
            error: normalizeError(error),
            componentStack: "",
        };
    }
    componentDidCatch(error, errorInfo) {
        const normalizedError = normalizeError(error);
        logger.error("[AppErrorBoundary] React subtree crashed:", 
        // Error 对象跨 preload 日志 bridge 序列化后会变成 {}，
        // 导致 Maximum update depth 等关键 message 丢失。这里显式展开可诊断字段。
        serializeErrorForLog(normalizedError), errorInfo.componentStack);
        this.props.onCaughtReactError?.(normalizedError, errorInfo);
        // React 错误边界拦截了异常、阻止其冒泡到 window.onerror，RUM Browser SDK 默认收不到。
        // 主动转发到 ARMS 自定义事件干道（reporter 在 renderer 入口早注入），补上根级渲染崩溃盲区。
        reportReactErrorToArms({
            error: normalizedError,
            componentStack: errorInfo.componentStack ?? "",
        });
        this.setState({ componentStack: errorInfo.componentStack ?? "" });
    }
    handleReset = () => {
        this.setState({
            error: null,
            componentStack: "",
        });
    };
    handleReload = () => {
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    };
    render() {
        if (!this.state.error) {
            return this.props.children;
        }
        return (_jsx(ErrorFallback, { error: this.state.error, componentStack: this.state.componentStack, onReset: this.handleReset, onReload: this.handleReload, isDesktop: this.props.isDesktop, isMacDesktop: this.props.isMacDesktop, isWindowsDesktop: this.props.isWindowsDesktop }));
    }
}
/**
 * ScopedErrorBoundary —— 局部 UI 故障隔离边界
 *
 * 只有根级错误边界时，workspace 内任意一个面板 render 抛错都会一路冒泡到根，
 * 最终把整套界面替换成全屏错误页。这里提供可复用的局部边界，让 sidebar、chat、
 * terminal、side pane 等区域各自失败各自恢复，避免单个组件问题扩大成整窗不可用。
 */
export class ScopedErrorBoundary extends Component {
    state = {
        error: null,
        componentStack: "",
    };
    static getDerivedStateFromError(error) {
        return {
            error: normalizeError(error),
            componentStack: "",
        };
    }
    componentDidCatch(error, errorInfo) {
        const normalizedError = normalizeError(error);
        logger.error(`[ScopedErrorBoundary:${this.props.scope}] React subtree crashed:`, 
        // Error 对象跨 preload 日志 bridge 序列化后会变成 {}，
        // 局部边界需要保留 message/stack 才能定位 UI 更新循环。
        serializeErrorForLog(normalizedError), errorInfo.componentStack);
        this.props.onCaughtReactError?.(normalizedError, errorInfo, this.props.scope);
        // 同根级边界：scoped 区域捕获的渲染异常同样不会冒泡到 RUM，按 scope 区分上报，
        // 让 sidebar/chat/terminal/settings 等局部崩溃在 RUM 里可见、可定位。
        reportReactErrorToArms({
            error: normalizedError,
            componentStack: errorInfo.componentStack ?? "",
            scope: this.props.scope,
        });
        this.setState({ componentStack: errorInfo.componentStack ?? "" });
    }
    componentDidUpdate(previousProps) {
        if (this.state.error && haveResetKeysChanged(previousProps.resetKeys, this.props.resetKeys)) {
            // 局部 fallback 如果不随 workspace/task/tab 切换自动清空，
            // 用户离开出错区域后再回来仍会看到旧错误。resetKeys 变化时重置边界，
            // 让新的隔离上下文可以重新渲染。
            this.setState({
                error: null,
                componentStack: "",
            });
        }
    }
    handleReset = () => {
        this.setState({
            error: null,
            componentStack: "",
        });
        this.props.onReset?.();
    };
    handleReload = () => {
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    };
    render() {
        if (!this.state.error) {
            return this.props.children;
        }
        return (_jsx(ScopedErrorFallback, { error: this.state.error, componentStack: this.state.componentStack, onReset: this.handleReset, onReload: this.handleReload, variant: this.props.variant, className: this.props.className }));
    }
}
//# sourceMappingURL=ErrorBoundary.js.map