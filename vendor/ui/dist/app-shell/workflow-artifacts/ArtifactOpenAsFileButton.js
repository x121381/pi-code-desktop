import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState } from "react";
import { ChevronDownIcon, CopyIcon, ExternalLinkIcon, FolderOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { toast } from "@/components/ui/toast.js";
import { useOptionalPlatform } from "@/hooks/usePlatform.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { persistLastSelectedEditorId } from "@/lib/editorPreference.js";
import { sortInstalledEditorsForOpenWith } from "@/lib/openWithEditors.js";
import { logger } from "@/logger.js";
function canOpenAsFile(platform) {
    return (platform !== null &&
        platform.materializeWorkflowArtifactFile !== undefined &&
        platform.openExternalFile !== undefined);
}
/** 当前宿主能不能「作为文件打开」——头部据此决定「在工作区显示」进菜单还是独立成按钮。 */
export function useCanOpenArtifactAsFile() {
    return canOpenAsFile(useOptionalPlatform());
}
export function ArtifactOpenAsFileButton(props) {
    const platform = useOptionalPlatform();
    if (!canOpenAsFile(platform))
        return null;
    return _jsx(OpenAsFileSplitButton, { ...props, platform: platform });
}
function OpenAsFileSplitButton({ runId, artifactId, version, fileName, bytes, onReveal, platform, }) {
    const { intl } = useZCodeIntl();
    const [editors, setEditors] = useState(null);
    // 一版一个副本路径：同一版再打开不再把最多 20 MiB 的字节重传一遍 IPC。存的是 promise，
    // 连点两下也只落一次；失败即出缓存，下一次点击重试。
    const pathsRef = useRef(new Map());
    const ensureLocalPath = useCallback(() => {
        const key = `${runId}\u0000${artifactId}\u0000${version}\u0000${fileName}`;
        const cached = pathsRef.current.get(key);
        if (cached !== undefined)
            return cached;
        if (bytes === null)
            return Promise.reject(new Error("artifact bytes are not loaded"));
        const pending = platform
            .materializeWorkflowArtifactFile({ runId, artifactId, version, fileName, bytes })
            .then((result) => result.localPath);
        pathsRef.current.set(key, pending);
        pending.catch(() => pathsRef.current.delete(key));
        return pending;
    }, [artifactId, bytes, fileName, platform, runId, version]);
    const reportFailure = useCallback((action, error) => {
        logger.warn("[workflow-artifacts] 作为文件打开失败", {
            action,
            artifactId,
            error: error instanceof Error ? error.message : String(error),
            runId,
            version,
        });
        toast(intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.openAsFileFailed" }));
    }, [artifactId, intl, runId, version]);
    const openWith = useCallback((action, open) => {
        void ensureLocalPath()
            .then(open)
            .then((result) => {
            if (!result.success)
                reportFailure(action, result.error ?? "unknown-error");
        })
            .catch((error) => reportFailure(action, error));
    }, [ensureLocalPath, reportFailure]);
    const handleOpenDefault = () => openWith("default-app", (localPath) => platform.openExternalFile(localPath));
    const handleOpenInEditor = (editor) => {
        persistLastSelectedEditorId(editor.id);
        // 副本恒在宿主本机上：远程工作区也不带 remoteTarget，否则会被当成远端路径去开。
        openWith(`editor:${editor.id}`, (localPath) => platform.openInEditor(editor.id, localPath, { pathKind: "file" }));
    };
    const handleCopyPath = () => {
        void ensureLocalPath()
            .then((localPath) => navigator.clipboard?.writeText(localPath))
            .catch((error) => reportFailure("copy-path", error));
    };
    const loadEditors = () => {
        if (editors !== null)
            return;
        void platform
            .getInstalledEditors()
            .then((installed) => setEditors(sortInstalledEditorsForOpenWith(installed)))
            .catch((error) => {
            logger.warn("[workflow-artifacts] 获取打开方式失败", {
                error: error instanceof Error ? error.message : String(error),
            });
            setEditors([]);
        });
    };
    const disabled = bytes === null;
    const label = intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.openAsFile" });
    const chooseLabel = intl.formatMessage({ id: "appHeader.selectOpenApp" });
    return (_jsxs(DropdownMenu, { onOpenChange: (open) => open && loadEditors(), children: [_jsxs("div", { className: "flex h-6 shrink-0 items-center overflow-hidden rounded-md border border-border bg-input transition-colors hover:border-border-hover", children: [_jsxs(Button, { className: "h-6 rounded-none border-0 pr-1.5", "data-testid": "workflow-artifact-open-as-file", disabled: disabled, onClick: handleOpenDefault, size: "sm", type: "button", variant: "ghost", children: [_jsx(ExternalLinkIcon, { "aria-hidden": "true", className: "size-3.5" }), label] }), _jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { "aria-label": chooseLabel, className: "!w-5 rounded-none border-0 text-foreground-subtlest", "data-testid": "workflow-artifact-open-as-file-menu", disabled: disabled, size: "icon-sm", title: chooseLabel, type: "button", variant: "ghost", children: _jsx(ChevronDownIcon, { "aria-hidden": "true", className: "size-3.5" }) }) })] }), _jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [editors === null || editors.length === 0 ? (_jsx(DropdownMenuItem, { disabled: true, children: intl.formatMessage({
                            id: editors === null ? "common.loading" : "chat.previewCards.noOpenApps",
                        }) })) : (editors.map((editor) => (_jsxs(DropdownMenuItem, { onSelect: () => handleOpenInEditor(editor), children: [_jsx("img", { alt: "", className: "size-4 shrink-0", src: editor.iconDataUrl }), _jsx("span", { className: "truncate", children: editor.name })] }, editor.id)))), _jsx(DropdownMenuSeparator, {}), onReveal === undefined ? null : (_jsxs(DropdownMenuItem, { "data-testid": "workflow-artifact-open-as-file-reveal", onSelect: onReveal, children: [_jsx(FolderOpenIcon, { "aria-hidden": "true", className: "size-4" }), intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.reveal" })] })), _jsxs(DropdownMenuItem, { onSelect: handleCopyPath, children: [_jsx(CopyIcon, { "aria-hidden": "true", className: "size-4" }), intl.formatMessage({ id: "fileActions.copyAbsolutePath" })] })] })] }));
}
//# sourceMappingURL=ArtifactOpenAsFileButton.js.map