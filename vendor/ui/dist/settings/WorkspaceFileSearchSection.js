import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { FolderOpen, RotateCcw, Save, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Textarea } from "@/components/ui/textarea.js";
import { toast } from "@/components/ui/toast.js";
import { usePlatform } from "@/hooks/usePlatform.js";
import { useWorkspaceServicesResolution } from "@/hooks/useWorkspaceServices.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { SettingsGroupCard } from "@/settings/SettingsPageParts.js";
import { logger } from "@/logger.js";
/**
 * 工作区文件搜索忽略规则（.zcodeignore）编辑页。
 * 规则文件是目录排除的单一真相源：编辑保存即生效（下次扫描读取新内容）；
 * 「从 .gitignore 同步」与「恢复默认规则」是分区操作：只重写各自标记区
 * （gitignore 同步区 / 默认排除段），用户自定义规则区不受影响；结果填入编辑框，
 * 仍需保存才落盘。
 */
export function WorkspaceFileSearchSection({ workspacePath, workspaceIdentity, }) {
    // 无 workspace 时直接提示，不挂 workspace 服务解析 hook 链（同 SessionPluginReferenceIconBoundary
    // 的分层先例），避免无谓的 services/tabStore context 依赖。
    if (!workspacePath) {
        return _jsx(NoWorkspaceFileSearchHint, {});
    }
    return (_jsx(ActiveWorkspaceFileSearchEditor, { workspacePath: workspacePath, workspaceIdentity: workspaceIdentity }));
}
function NoWorkspaceFileSearchHint() {
    const { intl } = useZCodeIntl();
    return (_jsx("p", { className: "text-ui-base leading-6 text-foreground-subtle", children: intl.formatMessage({ id: "settings.workspaceFileSearch.noWorkspace" }) }));
}
function ActiveWorkspaceFileSearchEditor({ workspacePath, workspaceIdentity, }) {
    const { intl } = useZCodeIntl();
    const platform = usePlatform();
    const resolution = useWorkspaceServicesResolution(workspacePath, undefined, workspaceIdentity);
    const services = resolution.services;
    const rpcReady = resolution.rpcReady;
    const [loaded, setLoaded] = useState(null);
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const loadVersionRef = useRef(0);
    const load = useCallback(async () => {
        if (!workspacePath || !rpcReady) {
            return;
        }
        const version = loadVersionRef.current + 1;
        loadVersionRef.current = version;
        setLoading(true);
        try {
            const result = await services.fileService.readWorkspaceFileSearchIgnore({
                rootPath: workspacePath,
            });
            if (loadVersionRef.current !== version) {
                return;
            }
            setLoaded({ content: result.content, source: result.source });
            setDraft(result.content);
        }
        catch (error) {
            if (loadVersionRef.current !== version) {
                return;
            }
            logger.warn("[WorkspaceFileSearchSection] 读取 .zcodeignore 失败", {
                error: error instanceof Error ? error.message : String(error),
            });
            toast(intl.formatMessage({ id: "settings.workspaceFileSearch.loadFailed" }));
        }
        finally {
            if (loadVersionRef.current === version) {
                setLoading(false);
            }
        }
    }, [intl, rpcReady, services, workspacePath]);
    // 分区操作：只重写对应标记区（sync-gitignore 重写 gitignore 同步区；reset-defaults
    // 重置默认排除段），用户自定义规则区不受影响；结果填充编辑框，保存才落盘。
    const applyTransform = useCallback(async (transform) => {
        if (!workspacePath || !rpcReady) {
            return;
        }
        const version = loadVersionRef.current + 1;
        loadVersionRef.current = version;
        try {
            const result = await services.fileService.applyWorkspaceFileSearchIgnoreTransform({
                rootPath: workspacePath,
                transform,
            });
            if (loadVersionRef.current !== version) {
                return;
            }
            // 只更新编辑框内容；loaded 保持不变，dirty 语义由内容差异自然产生。
            setDraft(result.content);
        }
        catch (error) {
            if (loadVersionRef.current !== version) {
                return;
            }
            logger.warn("[WorkspaceFileSearchSection] 应用 .zcodeignore 分区操作失败", {
                transform,
                error: error instanceof Error ? error.message : String(error),
            });
            toast(intl.formatMessage({ id: "settings.workspaceFileSearch.transformFailed" }));
        }
    }, [intl, rpcReady, services, workspacePath]);
    useEffect(() => {
        if (!workspacePath || !rpcReady) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setLoaded(null);
        setDraft("");
        void load();
        // load 是依赖 workspace/services 的回调；workspace 切换时先重置再拉取。
    }, [load, rpcReady, workspacePath]);
    const handleSave = useCallback(async () => {
        if (!workspacePath) {
            return;
        }
        setSaving(true);
        try {
            await services.fileService.writeWorkspaceFileSearchIgnore({
                rootPath: workspacePath,
                content: draft,
            });
            setLoaded({ content: draft, source: "file" });
            toast(intl.formatMessage({ id: "settings.workspaceFileSearch.saved" }));
        }
        catch (error) {
            logger.warn("[WorkspaceFileSearchSection] 保存 .zcodeignore 失败", {
                error: error instanceof Error ? error.message : String(error),
            });
            toast(intl.formatMessage({ id: "settings.workspaceFileSearch.saveFailed" }));
        }
        finally {
            setSaving(false);
        }
    }, [draft, intl, services, workspacePath]);
    // 保存语义是"把编辑框内容落盘"：template 态（.zcodeignore 尚未创建）即使未编辑也允许保存，
    // 否则用户第一次进页面什么都不改就永远无法创建文件；已落盘态才按"有修改才可保存"门控。
    const canSave = loaded === null || loaded.source === "template" || draft !== loaded.content;
    // "有未保存的修改"提示只表达真实差异（template 态未编辑时不显示）。
    const dirty = loaded !== null && loaded.source === "file" && draft !== loaded.content;
    // 「打开文件位置」：.zcodeignore 位于 workspace 根，打开根目录即所在位置
    // （与 WindowsCaptionMenuButton/ModelTrajectoryPane 先例一致传目录）。
    // 远程 workspace 的规则文件在远端机器，本地文件管理器无法打开，按钮不展示。
    const isLocalWorkspace = !workspaceIdentity?.trim();
    const revealTargetReady = loaded?.source === "file";
    const handleReveal = useCallback(async () => {
        const result = await platform.openInFileManager(workspacePath);
        if (!result.success) {
            toast(intl.formatMessage({ id: "appHeader.openInFileManagerFailed" }));
        }
    }, [intl, platform, workspacePath]);
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground-subtle", children: intl.formatMessage({ id: "settings.workspaceFileSearch.description" }) }), _jsx(SettingsGroupCard, { children: _jsxs("div", { className: "space-y-3 px-4 py-3", children: [loaded?.source === "template" ? (_jsx("div", { className: "text-ui-base leading-6 text-foreground-subtle", children: intl.formatMessage({ id: "settings.workspaceFileSearch.templateHint" }) })) : null, _jsx(Textarea, { value: draft, onChange: (event) => setDraft(event.target.value), onKeyDown: (event) => {
                                // 保存快捷键：编辑器内 Ctrl/Cmd+S 与点保存按钮等价（preventDefault
                                // 阻止浏览器默认行为）；门控与按钮一致（canSave）。
                                if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
                                    event.preventDefault();
                                    if (canSave && !saving && !loading) {
                                        void handleSave();
                                    }
                                }
                            }, spellCheck: false, disabled: loading || saving, className: "min-h-64 w-full font-mono text-ui-base", "aria-label": intl.formatMessage({ id: "settings.workspaceFileSearch.editorLabel" }), "data-testid": "workspace-file-search-ignore-editor" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "default", size: "sm", disabled: !canSave || saving || loading, onClick: () => void handleSave(), "data-testid": "workspace-file-search-ignore-save", children: [_jsx(Save, { className: "size-4" }), intl.formatMessage({ id: "settings.workspaceFileSearch.save" })] }), _jsxs(Button, { variant: "outline", size: "sm", disabled: loading || saving, onClick: () => void applyTransform("sync-gitignore"), "data-testid": "workspace-file-search-ignore-resync", children: [_jsx(RotateCcw, { className: "size-4" }), intl.formatMessage({ id: "settings.workspaceFileSearch.resync" })] }), _jsxs(Button, { variant: "outline", size: "sm", disabled: loading || saving, onClick: () => void applyTransform("reset-defaults"), "data-testid": "workspace-file-search-ignore-restore-defaults", children: [_jsx(Undo2, { className: "size-4" }), intl.formatMessage({ id: "settings.workspaceFileSearch.restoreDefaults" })] }), isLocalWorkspace ? (_jsxs(Button, { variant: "outline", size: "sm", disabled: !revealTargetReady || loading || saving, title: revealTargetReady
                                        ? undefined
                                        : intl.formatMessage({ id: "settings.workspaceFileSearch.revealHint" }), onClick: () => void handleReveal(), "data-testid": "workspace-file-search-ignore-reveal", children: [_jsx(FolderOpen, { className: "size-4" }), intl.formatMessage({ id: "settings.workspaceFileSearch.reveal" })] })) : null, dirty ? (_jsx("span", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.workspaceFileSearch.unsaved" }) })) : null] })] }) })] }));
}
//# sourceMappingURL=WorkspaceFileSearchSection.js.map