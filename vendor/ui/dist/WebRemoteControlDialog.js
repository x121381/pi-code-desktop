import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { resolveWebRemoteControlWorkspaceKey } from "@zcode/shared";
import { Bot as BotIcon, CopyIcon, LoaderCircle, MonitorSmartphone, RefreshCw, Smartphone, Unplug, XIcon, } from "lucide-react";
import { BotsDialog } from "./BotsDialog.js";
import { ProviderIcon } from "./BotsDialog/shared.js";
import { Button } from "./components/ui/button.js";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "./components/ui/dialog.js";
import { toast } from "./components/ui/toast.js";
import { useConfirmDialog } from "./hooks/useConfirmDialog.js";
import { usePlatform } from "./hooks/usePlatform.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
import { logger } from "./logger.js";
import { getBotProviderRegionTagLabelId } from "./botsUi.js";
const REMOTE_CONTROL_BOT_ENTRIES = [
    { provider: "weixin" },
    { provider: "feishu" },
    { provider: "lark" },
    { provider: "telegram" },
];
export function isSameWebRemoteControlTarget(status, workspacePath, workspaceIdentity, remoteSessionId) {
    if (status.status === "idle" || status.status === "error") {
        return false;
    }
    // Bugfix: 之前这里仅凭 sessionId 存在就判定“同一目标”，会把其他 workspace 的旧会话误复用，
    // 导致当前 workspace 打开弹层时不触发 start，状态长期卡在 starting。
    // 这里改为严格比较 workspaceKey(identity 优先) + remoteSessionId，确保会话和目标一一对应。
    const statusWorkspacePath = status.workspacePath?.trim();
    if (!statusWorkspacePath) {
        return false;
    }
    const expectedWorkspaceKey = resolveWebRemoteControlWorkspaceKey({
        workspacePath,
        workspaceIdentity,
    });
    const statusWorkspaceKey = resolveWebRemoteControlWorkspaceKey({
        workspacePath: statusWorkspacePath,
        workspaceIdentity: status.workspaceIdentity,
    });
    if (statusWorkspaceKey !== expectedWorkspaceKey) {
        return false;
    }
    const expectedRemoteSessionId = remoteSessionId?.trim() || undefined;
    const statusRemoteSessionId = status.remoteSessionId?.trim() || undefined;
    if (statusRemoteSessionId !== expectedRemoteSessionId) {
        return false;
    }
    return Boolean(status.windowControlSessionId ?? status.sessionId);
}
export function isReusableWebRemoteControlSession(status) {
    if (status.status === "idle" || status.status === "error") {
        return false;
    }
    // Bugfix: 打开桌面弹层只是查看/管理 window 级远控入口，不能因为当前桌面 workspace
    // 和手机已 bridge 的 workspace 不一致就重启 device relay 会话；否则会主动给手机发
    // desktop-disconnected。只有已经连上手机的会话才跨 workspace 复用，避免未连接的旧二维码
    // 继续把新扫码用户带回旧默认 workspace。
    return Boolean(status.mobileConnected && (status.windowControlSessionId ?? status.sessionId));
}
function getStatusLabel(status, formatMessage) {
    switch (status.status) {
        case "starting":
            return formatMessage({ id: "webRemoteControl.status.starting" });
        case "running":
            return formatMessage({ id: "webRemoteControl.status.running" });
        case "connecting":
            return formatMessage({ id: "webRemoteControl.status.connecting" });
        case "active":
            return formatMessage({ id: "webRemoteControl.status.active" });
        case "error":
            return formatMessage({ id: "webRemoteControl.status.error" });
        default:
            return formatMessage({ id: "webRemoteControl.status.idle" });
    }
}
function getStatusDetail(status, formatMessage) {
    switch (status.status) {
        case "starting":
            return formatMessage({ id: "webRemoteControl.statusDetail.starting" });
        case "running":
            return formatMessage({ id: "webRemoteControl.statusDetail.running" });
        case "connecting":
            return formatMessage({ id: "webRemoteControl.statusDetail.connecting" });
        case "active":
            return formatMessage({ id: "webRemoteControl.statusDetail.active" });
        case "error":
            return formatMessage({ id: "webRemoteControl.statusDetail.error" });
        default:
            return formatMessage({ id: "webRemoteControl.statusDetail.idle" });
    }
}
function getStatusDotClassName(status) {
    if (status.status === "error") {
        return "bg-destructive";
    }
    if (status.status === "active") {
        return "bg-success";
    }
    if (status.status === "idle") {
        return "bg-border";
    }
    return "bg-warning";
}
export function getWebRemoteControlStatusTagLabel(status, formatMessage) {
    const deviceName = status.mobileDeviceInfo?.browserPlatform?.trim() ||
        status.mobileDeviceInfo?.name?.trim();
    if (deviceName) {
        return deviceName;
    }
    if (status.mobileConnected) {
        return formatMessage({ id: "webRemoteControl.statusTag.phone" });
    }
    if (status.status === "idle") {
        return formatMessage({ id: "webRemoteControl.status.idle" });
    }
    if (status.status === "error") {
        return formatMessage({ id: "webRemoteControl.status.error" });
    }
    return formatMessage({ id: "webRemoteControl.statusTag.ready" });
}
function isSameWebRemoteControlStatus(left, right) {
    return (left.status === right.status &&
        left.sessionId === right.sessionId &&
        left.windowControlSessionId === right.windowControlSessionId &&
        left.deviceToken === right.deviceToken &&
        left.expiresAt === right.expiresAt &&
        left.mobileConnected === right.mobileConnected &&
        left.mobileDeviceInfo?.updatedAt === right.mobileDeviceInfo?.updatedAt &&
        left.mobileDeviceInfo?.userAgent === right.mobileDeviceInfo?.userAgent &&
        left.mobileDeviceInfo?.viewport?.width ===
            right.mobileDeviceInfo?.viewport?.width &&
        left.mobileDeviceInfo?.viewport?.height ===
            right.mobileDeviceInfo?.viewport?.height &&
        left.qrUrl === right.qrUrl &&
        left.connectUrl === right.connectUrl &&
        left.workspacePath === right.workspacePath &&
        left.workspaceIdentity === right.workspaceIdentity &&
        left.remoteSessionId === right.remoteSessionId &&
        left.error === right.error &&
        left.failure?.reason === right.failure?.reason &&
        left.failure?.message === right.failure?.message);
}
function getFailureDescription(failure, formatMessage) {
    if (!failure) {
        return null;
    }
    switch (failure.reason) {
        case "session-not-found":
            return formatMessage({ id: "webRemoteControl.failure.sessionNotFound" });
        case "session-expired":
            return formatMessage({ id: "webRemoteControl.failure.sessionExpired" });
        case "session-conflict":
            if (failure.message?.toLowerCase().includes("kicked")) {
                return formatMessage({ id: "webRemoteControl.failure.kicked" });
            }
            return formatMessage({ id: "webRemoteControl.failure.sessionConflict" });
        case "workspace-closed":
            return formatMessage({ id: "webRemoteControl.failure.workspaceClosed" });
        case "desktop-disconnected":
            return formatMessage({
                id: "webRemoteControl.failure.desktopDisconnected",
            });
        case "invalid-mobile-connection":
            return formatMessage({
                id: "webRemoteControl.failure.invalidMobileConnection",
            });
        case "desktop-bootstrap-timeout":
            return formatMessage({
                id: "webRemoteControl.failure.desktopBootstrapTimeout",
            });
        case "connection-recovery-timeout":
            return formatMessage({
                id: "webRemoteControl.failure.connectionRecoveryTimeout",
            });
        case "relay-unavailable":
            return formatMessage({ id: "webRemoteControl.failure.relayUnavailable" });
        case "unsupported-action":
            return formatMessage({
                id: "webRemoteControl.failure.unsupportedAction",
            });
        case "unexpected-error":
            return formatMessage({ id: "webRemoteControl.failure.unexpectedError" });
    }
}
export const WebRemoteControlDialog = memo(function WebRemoteControlDialogComponent({ open, onOpenChange, workspacePath, workspaceIdentity, remoteSessionId, initialTaskId, }) {
    const platform = usePlatform();
    const confirmDialog = useConfirmDialog();
    const { intl } = useZCodeIntl();
    const [status, setStatus] = useState({
        status: "idle",
    });
    const [loading, setLoading] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState(null);
    const [botsDialogOpen, setBotsDialogOpen] = useState(false);
    const [botEntryProvider, setBotEntryProvider] = useState(null);
    const statusLabel = useMemo(() => getStatusLabel(status, intl.formatMessage), [intl.formatMessage, status]);
    const statusDetail = useMemo(() => getStatusDetail(status, intl.formatMessage), [intl.formatMessage, status]);
    const failureDescription = useMemo(() => getFailureDescription(status.failure, intl.formatMessage), [intl.formatMessage, status.failure]);
    const statusTagLabel = useMemo(() => getWebRemoteControlStatusTagLabel(status, intl.formatMessage), [intl.formatMessage, status]);
    const statusDotClassName = getStatusDotClassName(status);
    useEffect(() => {
        if (!open) {
            return;
        }
        let cancelled = false;
        const syncWebRemoteControlStatus = async () => {
            setLoading(true);
            try {
                const currentStatus = await platform.getWebRemoteControlStatus();
                let nextStatus;
                if (isSameWebRemoteControlTarget(currentStatus, workspacePath, workspaceIdentity, remoteSessionId) ||
                    isReusableWebRemoteControlSession(currentStatus)) {
                    nextStatus = currentStatus;
                }
                else {
                    const startResult = await platform.startWebRemoteControl({
                        workspacePath,
                        workspaceIdentity,
                        remoteSessionId,
                        initialTaskId,
                    });
                    // 兼容仍可返回 cancelled 的平台实现；当前 Desktop 不再叠加原生确认。
                    nextStatus = startResult.status === "cancelled" ? { status: "idle" } : startResult;
                }
                // Bugfix: 手机端默认主题已统一收敛到 dark，不再依赖二维码 URL 透传 theme。
                // 这里去掉启动参数里的 theme，避免桌面端主题无意义地参与远控链路。
                if (!cancelled) {
                    setStatus(nextStatus);
                    logger.info("[WebRemoteControlDialog] Web 远程控制状态已同步", {
                        workspacePath,
                        workspaceIdentity: workspaceIdentity ?? "none",
                        remoteSessionId: remoteSessionId ?? "none",
                        initialTaskId: initialTaskId ?? "none",
                        status: nextStatus.status,
                        sessionId: nextStatus.sessionId ?? "none",
                    });
                }
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                if (!cancelled) {
                    setStatus({
                        status: "error",
                        workspacePath,
                        remoteSessionId,
                        error: message,
                    });
                    toast(intl.formatMessage({ id: "webRemoteControl.startFailed" }, { error: message }));
                }
                logger.error("[WebRemoteControlDialog] 启动 Web 远程控制失败", {
                    workspacePath,
                    workspaceIdentity: workspaceIdentity ?? "none",
                    remoteSessionId: remoteSessionId ?? "none",
                    initialTaskId: initialTaskId ?? "none",
                    error: message,
                });
            }
            finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        void syncWebRemoteControlStatus();
        return () => {
            cancelled = true;
        };
    }, [
        intl,
        open,
        platform,
        remoteSessionId,
        workspaceIdentity,
        workspacePath,
        initialTaskId,
    ]);
    useEffect(() => {
        if (!open) {
            return;
        }
        let cancelled = false;
        const pollWebRemoteControlStatus = async () => {
            try {
                const nextStatus = await platform.getWebRemoteControlStatus();
                if (cancelled) {
                    return;
                }
                const shouldApplyStatus = isSameWebRemoteControlTarget(nextStatus, workspacePath, workspaceIdentity, remoteSessionId) ||
                    isReusableWebRemoteControlSession(nextStatus) ||
                    nextStatus.status === "idle" ||
                    nextStatus.status === "error";
                if (!shouldApplyStatus) {
                    return;
                }
                setStatus((currentStatus) => isSameWebRemoteControlStatus(currentStatus, nextStatus)
                    ? currentStatus
                    : nextStatus);
            }
            catch {
                // Bugfix: Web 远程控制的状态变化发生在 main / relay 侧，
                // 如果弹层只在打开时同步一次，状态会长期停在“等待连接”。
                // 这里用轻量轮询补齐状态刷新；单次失败时静默忽略，避免打断用户操作。
            }
        };
        const intervalId = window.setInterval(() => {
            void pollWebRemoteControlStatus();
        }, 1000);
        return () => {
            cancelled = true;
            window.clearInterval(intervalId);
        };
    }, [open, platform, remoteSessionId, workspaceIdentity, workspacePath]);
    useEffect(() => {
        if (!status.qrUrl) {
            setQrDataUrl(null);
            return;
        }
        let cancelled = false;
        setQrDataUrl(null);
        void QRCode.toDataURL(status.qrUrl, {
            margin: 1,
            width: 320,
        })
            .then((dataUrl) => {
            if (!cancelled) {
                setQrDataUrl(dataUrl);
            }
        })
            .catch((error) => {
            const message = error instanceof Error ? error.message : String(error);
            logger.error("[WebRemoteControlDialog] 生成二维码失败", message);
        });
        return () => {
            cancelled = true;
        };
    }, [status.qrUrl]);
    const handleCopyLink = async () => {
        if (!status.connectUrl) {
            return;
        }
        try {
            await navigator.clipboard.writeText(status.connectUrl);
            toast(intl.formatMessage({ id: "webRemoteControl.copyLink.copied" }));
            logger.info("[WebRemoteControlDialog] 已复制 Web 远程控制链接", {
                workspacePath,
                remoteSessionId: remoteSessionId ?? "none",
                sessionId: status.sessionId ?? "none",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            toast(intl.formatMessage({ id: "webRemoteControl.copyLinkFailed" }, { error: message }));
            logger.error("[WebRemoteControlDialog] 复制 Web 远程控制链接失败", message);
        }
    };
    const handleRefreshQr = async () => {
        // Bugfix: 刷新二维码会废弃之前复制或扫码得到的 sid/hash 链接。
        // 之前按钮和复制链接并排，误触会让已发出的手机链接立即失效；这里先用统一确认弹窗保护。
        const confirmed = await confirmDialog({
            title: intl.formatMessage({ id: "webRemoteControl.refreshQr.confirmTitle" }),
            description: intl.formatMessage({
                id: "webRemoteControl.refreshQr.confirmDescription",
            }),
            confirmLabel: intl.formatMessage({ id: "webRemoteControl.refreshQr" }),
        });
        if (!confirmed) {
            return;
        }
        setLoading(true);
        try {
            const nextStatus = await platform.refreshWebRemoteControlPairing({
                workspacePath,
                workspaceIdentity,
                remoteSessionId,
                initialTaskId,
            });
            if (nextStatus.status === "cancelled") {
                // 兼容可取消的平台实现：保持当前运行状态，不显示成功或失败反馈。
                return;
            }
            // Bugfix: 泄露后的旧二维码包含 sid/hash，单纯重新绘制图片只会更新时间戳。
            // 这里走平台层 reset，确保 main 清掉持久化配对材料后重新注册 relay 设备。
            setStatus(nextStatus);
            toast(intl.formatMessage({ id: "webRemoteControl.refreshQr.success" }));
            logger.info("[WebRemoteControlDialog] 已刷新 Web 远程控制二维码", {
                workspacePath,
                workspaceIdentity: workspaceIdentity ?? "none",
                remoteSessionId: remoteSessionId ?? "none",
                initialTaskId: initialTaskId ?? "none",
                sessionId: nextStatus.sessionId ?? "none",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            toast(intl.formatMessage({ id: "webRemoteControl.refreshQr.failed" }, { error: message }));
            logger.error("[WebRemoteControlDialog] 刷新 Web 远程控制二维码失败", {
                workspacePath,
                workspaceIdentity: workspaceIdentity ?? "none",
                remoteSessionId: remoteSessionId ?? "none",
                initialTaskId: initialTaskId ?? "none",
                error: message,
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleStop = async () => {
        setLoading(true);
        try {
            await platform.stopWebRemoteControl();
            setStatus({ status: "idle" });
            onOpenChange(false);
            toast(intl.formatMessage({ id: "webRemoteControl.stopSuccess" }));
            logger.info("[WebRemoteControlDialog] 已关闭 Web 远程控制", {
                workspacePath,
                remoteSessionId: remoteSessionId ?? "none",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            toast(intl.formatMessage({ id: "webRemoteControl.stopFailed" }, { error: message }));
            logger.error("[WebRemoteControlDialog] 关闭 Web 远程控制失败", message);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDialogOpenChange = (nextOpen) => {
        logger.info("[WebRemoteControlDialog] 弹层开关状态变化", {
            workspacePath,
            remoteSessionId: remoteSessionId ?? "none",
            nextOpen,
        });
        onOpenChange(nextOpen);
    };
    const handleDismiss = () => {
        logger.info("[WebRemoteControlDialog] 用户点击右上角关闭按钮", {
            workspacePath,
            remoteSessionId: remoteSessionId ?? "none",
            sessionId: status.sessionId ?? "none",
            status: status.status,
        });
        handleDialogOpenChange(false);
    };
    const handleOpenBotEntry = (provider) => {
        setBotEntryProvider(provider);
        setBotsDialogOpen(true);
        logger.info("[WebRemoteControlDialog] 打开 Bot Channel 配置入口", {
            workspacePath,
            workspaceIdentity: workspaceIdentity ?? "none",
            provider,
        });
    };
    const handleOpenBotsDialog = () => {
        setBotEntryProvider(null);
        setBotsDialogOpen(true);
        logger.info("[WebRemoteControlDialog] 打开 Bots 总配置入口", {
            workspacePath,
            workspaceIdentity: workspaceIdentity ?? "none",
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx(Dialog, { open: open, onOpenChange: handleDialogOpenChange, children: _jsxs(DialogContent, { showCloseButton: false, 
                    // Bugfix: Mobile Remote Control 弹窗之前比 Remote Connect 更宽也更贴近窗口边缘，
                    // 启动二维码和 Bot Channel 内容时会显得层级不一致。这里复用 Remote Connect 的外层尺寸，
                    // 但不强制撑满高度；远控内容比 Remote Connect 少，内容自适应能避免窗口显得空。
                    className: "max-h-[calc(100vh-6rem)] max-w-4xl gap-0 overflow-hidden rounded-2xl p-0", children: [_jsxs(Button, { type: "button", variant: "ghost", size: "icon-sm", 
                            // Bugfix: 这个弹窗会贴近桌面窗口顶部显示，默认 close 在 Electron drag 区里容易点不中。
                            // 这里改成显式点击关闭，并把按钮本身标成 no-drag，保证右上角关闭动作能稳定命中。
                            // Bugfix: 远控弹层内可点击控件之前没有显式 pointer cursor，桌面端 hover 时不像可操作元素。
                            // 这里仅给启用态补手指指针，禁用态仍沿用 Button 的 disabled 交互语义。
                            className: "absolute top-2 right-2 enabled:cursor-pointer [app-region:no-drag]", onClick: handleDismiss, children: [_jsx(XIcon, {}), _jsx("span", { className: "sr-only", children: "Close" })] }), _jsxs("div", { "data-testid": "web-remote-control-dialog-scroll", className: "max-h-[calc(100vh-6rem)] min-h-0 overflow-y-auto p-5", children: [_jsx(DialogHeader, { className: "space-y-2 pr-8", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-primary", children: _jsx(MonitorSmartphone, { className: "size-5" }) }), _jsxs("div", { className: "space-y-1", children: [_jsx(DialogTitle, { children: intl.formatMessage({ id: "webRemoteControl.title" }) }), _jsx(DialogDescription, { children: intl.formatMessage({ id: "webRemoteControl.description" }) })] })] }) }), _jsxs("div", { "data-testid": "web-remote-control-main-grid", className: "mt-5 grid gap-4 md:grid-cols-[minmax(0,1.45fr)_minmax(300px,1fr)]", children: [_jsxs("section", { "data-testid": "web-remote-control-scan-card", className: "flex min-h-[360px] flex-col rounded-xl border border-border bg-card p-4", children: [_jsxs("div", { className: "mb-4 flex items-start gap-2", children: [_jsx(Smartphone, { className: "mt-0.5 size-4 shrink-0 text-foreground-subtle" }), _jsxs("div", { className: "min-w-0 space-y-1", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({
                                                                        id: "webRemoteControl.mobileQr.title",
                                                                    }) }), _jsx("p", { className: "text-ui-base/relaxed text-foreground-subtle", children: intl.formatMessage({
                                                                        id: "webRemoteControl.mobileQr.description",
                                                                    }) })] })] }), _jsxs("div", { "data-testid": "web-remote-control-connection-card", className: "mb-3 rounded-lg bg-surface px-3 py-2", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: statusLabel }), _jsxs("div", { className: "flex min-w-0 items-center gap-1.5 rounded-full bg-card px-2 py-0.5 text-ui-xs font-medium text-foreground-subtle", children: [_jsx("span", { className: `size-1.5 shrink-0 rounded-full ${statusDotClassName}` }), _jsx("span", { className: "truncate", children: statusTagLabel })] })] }), _jsx("div", { className: "text-ui-base/relaxed text-foreground-subtle", children: statusDetail })] }), loading ? (_jsx(LoaderCircle, { className: "size-4 animate-spin text-foreground-subtle" })) : (_jsxs(Button, { type: "button", variant: "outline", size: "default", className: "shrink-0 gap-2 enabled:cursor-pointer", onClick: () => void handleStop(), disabled: status.status === "idle", children: [_jsx(Unplug, { className: "size-3.5" }), intl.formatMessage({ id: "webRemoteControl.stop" })] }))] }), failureDescription ? (_jsxs("div", { className: "mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-ui-base/relaxed text-destructive", children: [_jsx("p", { children: failureDescription }), status.failure?.message &&
                                                                    status.failure.message !== failureDescription ? (_jsx("p", { className: "mt-1 text-ui-xs/relaxed opacity-80", children: status.failure.message })) : null] })) : status.error ? (_jsx("p", { className: "mt-3 text-ui-base/relaxed text-destructive", children: status.error })) : null, _jsxs("div", { "data-testid": "web-remote-control-copy-link-row", className: "mt-3 flex min-h-10 flex-wrap items-center gap-3 border-t border-border pt-3", children: [_jsx("div", { className: "min-w-48 flex-1 text-ui-base/relaxed text-foreground-subtle", children: intl.formatMessage({
                                                                        id: "webRemoteControl.copyLink.description",
                                                                    }) }), _jsxs(Button, { type: "button", variant: "outline", size: "default", className: "shrink-0 gap-2 enabled:cursor-pointer", onClick: () => void handleRefreshQr(), disabled: loading, children: [_jsx(RefreshCw, { className: "size-3.5" }), intl.formatMessage({ id: "webRemoteControl.refreshQr" })] }), _jsxs(Button, { type: "button", variant: "outline", size: "default", className: "shrink-0 gap-2 enabled:cursor-pointer", onClick: () => void handleCopyLink(), disabled: !status.connectUrl || loading, children: [_jsx(CopyIcon, { className: "size-3.5" }), intl.formatMessage({ id: "webRemoteControl.copyLink" })] })] })] }), _jsx("div", { className: "flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-background-alt p-4", children: qrDataUrl ? (_jsx("img", { src: qrDataUrl, alt: intl.formatMessage({ id: "webRemoteControl.qrAlt" }), className: "size-64 max-w-full rounded-lg bg-white p-3" })) : (_jsxs("div", { className: "flex flex-col items-center gap-3 text-center text-ui-base text-foreground-subtle", children: [_jsx(LoaderCircle, { className: "size-5 animate-spin" }), _jsx("span", { children: intl.formatMessage({
                                                                    id: "webRemoteControl.generating",
                                                                }) })] })) })] }), _jsxs("section", { className: "flex min-h-[360px] flex-col rounded-xl border border-border bg-card p-4", children: [_jsxs("div", { className: "mb-4 flex items-start gap-2", children: [_jsx(BotIcon, { className: "mt-0.5 size-4 shrink-0 text-foreground-subtle" }), _jsxs("div", { className: "min-w-0 space-y-1", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({
                                                                        id: "webRemoteControl.botChannel.title",
                                                                    }) }), _jsx("p", { className: "text-ui-base/relaxed text-foreground-subtle", children: intl.formatMessage({
                                                                        id: "webRemoteControl.botChannel.description",
                                                                    }) })] })] }), _jsx("div", { className: "grid min-h-0 flex-1 gap-3", children: REMOTE_CONTROL_BOT_ENTRIES.map((entry) => {
                                                        const regionTagLabelId = getBotProviderRegionTagLabelId(entry.provider);
                                                        return (_jsxs("button", { type: "button", className: "flex min-h-0 cursor-pointer items-start gap-3 rounded-lg border border-transparent bg-surface px-3 py-3 text-left transition-colors hover:border-input-border-focused hover:bg-surface-hover focus-visible:border-input-border-focused", onClick: () => handleOpenBotEntry(entry.provider), children: [_jsx(ProviderIcon, { provider: entry.provider, className: "size-12 shrink-0" }), _jsxs("span", { className: "min-w-0 flex-1 space-y-1", children: [_jsxs("span", { className: "flex min-w-0 items-center gap-1.5 text-ui-base font-medium text-foreground", children: [_jsx("span", { className: "min-w-0 truncate", children: intl.formatMessage({
                                                                                        id: `webRemoteControl.botChannel.${entry.provider}.title`,
                                                                                    }) }), regionTagLabelId ? (_jsx("span", { className: "inline-flex h-5 shrink-0 items-center rounded-full border border-border px-2 text-ui-xs font-medium leading-none text-foreground-subtle", children: intl.formatMessage({ id: regionTagLabelId }) })) : null] }), _jsx("span", { className: "block text-ui-base/relaxed text-foreground-subtle", children: intl.formatMessage({
                                                                                id: `webRemoteControl.botChannel.${entry.provider}.description`,
                                                                            }) }), _jsx("span", { className: "block text-ui-base font-medium text-primary", children: intl.formatMessage({
                                                                                id: "webRemoteControl.botChannel.configure",
                                                                            }) })] })] }, entry.provider));
                                                    }) }), _jsx("div", { className: "mt-3", children: _jsxs(Button, { type: "button", variant: "outline", size: "lg", "data-testid": "web-remote-control-open-bots", className: "w-full justify-center gap-2 enabled:cursor-pointer", onClick: handleOpenBotsDialog, children: [_jsx(BotIcon, { className: "size-3.5" }), intl.formatMessage({
                                                                id: "webRemoteControl.botChannel.manageBots",
                                                            })] }) })] })] })] })] }) }), _jsx(BotsDialog, { open: botsDialogOpen, onOpenChange: setBotsDialogOpen, workspacePath: workspacePath, workspaceIdentity: workspaceIdentity, entryProvider: botEntryProvider })] }));
});
//# sourceMappingURL=WebRemoteControlDialog.js.map