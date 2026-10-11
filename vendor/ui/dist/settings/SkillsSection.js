import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable max-lines -- 技能管理面板需共享筛选、安装与开关交互状态，集中维护更便于一致性 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronRight, ExternalLink, Import, Plus, Trash2, UploadCloud, WandSparkles, } from "lucide-react";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { Button } from "@/components/ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog.js";
import { Switch } from "@/components/ui/switch.js";
import { ZCODE_AGENT_PROVIDER } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { toast } from "@/components/ui/toast.js";
import { usePlatform } from "@/hooks/usePlatform.js";
import { useZCodeSessionService } from "@/hooks/useZCodeSessionService.js";
import { useBaseWorkspaceServices, useWorkspaceServicesResolution, } from "@/hooks/useWorkspaceServices.js";
import { useConfirmDialog } from "@/hooks/useConfirmDialog.js";
import { buildSkillMentionMarkdown } from "@/mentions/mentionMarkdown.js";
import { filterSkillsForProvider } from "@/lib/skillSourceFilter.js";
import { invalidateDeferredDraftSessionForSkillChange } from "@/lib/zcodeDraftSkillInvalidation.js";
import { PluginStoreAvatar } from "@/settings/PluginStoreAvatar.js";
import { SettingsResourceHeaderActions } from "@/settings/SettingsResourceHeaderActions.js";
import { SettingsResourceGroupHeader, SettingsResourceList, } from "@/settings/SettingsResourceGroup.js";
import { SettingsBreadcrumbReporter } from "@/settings/SettingsHeaderBreadcrumb.js";
import { PluginInstallEmptyState, PluginLoadingState, PluginSearchEmptyState, } from "@/settings/PluginInstallEmptyState.js";
import { resolvePluginDisplayName, resolveUniquePluginListingByName, } from "@/settings/pluginStoreListing.js";
import { groupSkillsByPlugin } from "@/settings/pluginManagedResourceGroups.js";
import { SkillsImportDialog } from "@/settings/ExternalAgentImportDialog.js";
import { formatRemoteSkillSyncTarget } from "@/settings/RemoteSkillSyncDialog.js";
import { RemoteSyncDialogs, shouldShowRemoteSyncActions, } from "@/settings/RemoteSyncActions.js";
import { refreshSharedSkillStoreForWorkspace } from "@/lib/skillStoreRefresh.js";
import { usePluginManagementStore } from "@/store/pluginManagementStore.js";
import { groupScopedSkillsBySource, selectPluginsForScope, selectSkillsForScope, } from "@/settings/pluginCapabilityProjection.js";
function getWorkspaceBasename(workspacePath) {
    if (!workspacePath)
        return "";
    return workspacePath.split(/[\\/]/u).filter(Boolean).at(-1) ?? workspacePath;
}
function formatSkillPublishedAt(timestamp) {
    if (timestamp === undefined) {
        return null;
    }
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return date.toISOString();
}
function SkillDetailField({ label, value, mono = false, className = "", }) {
    if (!value) {
        return null;
    }
    return (_jsxs("div", { className: `min-w-0 ${className}`, children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: label }), _jsx("div", { className: [
                    "mt-1 break-words text-ui-base text-foreground-subtle",
                    mono ? "break-all font-mono" : "",
                ].join(" "), children: value })] }));
}
function SkillPathDetailField({ label, path, openLabel, onOpen, }) {
    return (_jsxs("div", { className: "min-w-0 col-span-2", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: label }), _jsx("div", { className: "mt-1", children: _jsxs(Button, { type: "button", variant: "link", size: "sm", "aria-label": openLabel, title: openLabel, className: "inline-flex h-auto max-w-full items-baseline gap-1.5 whitespace-normal break-all px-0 py-0 text-left align-baseline font-mono text-ui-base font-normal text-foreground-subtle underline-offset-2 hover:text-foreground hover:underline", onClick: onOpen, children: [_jsx("span", { children: path }), _jsx(ExternalLink, { className: "relative top-px size-3 shrink-0", "aria-hidden": "true" })] }) })] }));
}
export function SkillsSection({ workspacePath, workspaceIdentity, remoteSessionId, remoteTarget, isWebRemoteControl = false, scopeFilter, searchQuery, onVisibleCountChange, onCreateTask, onDetailOpenChange, onOpenPluginStore, showMarketplaceBreadcrumb = false, reportDetailBreadcrumb = false, }) {
    const { intl, locale } = useZCodeIntl();
    const platform = usePlatform();
    const baseServices = useBaseWorkspaceServices();
    const plugins = usePluginManagementStore((state) => state.plugins);
    const installedPlugins = usePluginManagementStore((state) => state.installedPlugins);
    const availablePlugins = usePluginManagementStore((state) => state.availablePlugins);
    const pluginListingById = useMemo(() => new Map(availablePlugins.map((plugin) => [plugin.id, plugin.listing])), [availablePlugins]);
    const pluginWorkspacePath = usePluginManagementStore((state) => state.workspacePath);
    const pluginWorkspaceIdentity = usePluginManagementStore((state) => state.workspaceIdentity);
    const pluginConfigScope = usePluginManagementStore((state) => state.configScope);
    const initializePlugins = usePluginManagementStore((state) => state.initialize);
    // useConfirmDialog 是纯 Zustand selector（不含 useState），放在这里不会影响 SkillsSection
    // 既有的「按 useState 调用次序」单测桩（见下方 selectedSkill 附近的注释）。
    const confirmDialog = useConfirmDialog();
    const activeWorkspacePath = workspacePath ?? null;
    const activeWorkspaceIdentity = workspaceIdentity;
    const targetServiceResolution = useWorkspaceServicesResolution(activeWorkspacePath, remoteSessionId, activeWorkspaceIdentity, remoteTarget);
    // PluginsSection 已把 Scope target 传入，但 Skills 仍从当前 ServiceProvider
    // 取服务，导致跨远程 host 误路由。技能读写和远端同步都改用同一 target 解析结果。
    const { pluginManagementService, skillSyncService, skillsService } = targetServiceResolution.services;
    const zcodeSessionService = useZCodeSessionService(activeWorkspacePath ?? undefined, undefined, activeWorkspaceIdentity);
    const [skills, setSkills] = useState([]);
    const [capability, setCapability] = useState(null);
    const [loadedSkillTargetKey, setLoadedSkillTargetKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const query = searchQuery;
    const [selectedSkill, setSelectedSkill] = useState(null);
    useEffect(() => {
        onDetailOpenChange?.(selectedSkill !== null);
    }, [onDetailOpenChange, selectedSkill]);
    const [diagnostics, setDiagnostics] = useState([]);
    const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [remoteSkillSyncOpen, setRemoteSkillSyncOpen] = useState(false);
    const latestRequestIdRef = useRef(0);
    const activeSkillTargetKey = activeWorkspaceIdentity?.trim() || activeWorkspacePath || "";
    const projectionMatchesTarget = !activeWorkspacePath || loadedSkillTargetKey === activeSkillTargetKey;
    useEffect(() => {
        if (!activeWorkspacePath || !targetServiceResolution.rpcReady)
            return;
        void initializePlugins({
            workspacePath: activeWorkspacePath,
            workspaceIdentity: activeWorkspaceIdentity,
            configScope: scopeFilter,
            pluginService: pluginManagementService,
        });
    }, [
        activeWorkspaceIdentity,
        activeWorkspacePath,
        initializePlugins,
        pluginManagementService,
        scopeFilter,
        targetServiceResolution.rpcReady,
    ]);
    const workspaceLabel = getWorkspaceBasename(activeWorkspacePath);
    const connectedRemoteSyncTarget = targetServiceResolution.rpcReady &&
        shouldShowRemoteSyncActions({
            remoteSessionId,
            remoteTarget,
            clientMode: isWebRemoteControl
                ? "web-remote-replayable"
                : "desktop-continuous",
            hasLocalSourceService: Boolean(baseServices.skillSyncService),
        }) && activeWorkspacePath
        ? remoteTarget
        : null;
    const remoteSkillSyncTargetLabel = connectedRemoteSyncTarget
        ? formatRemoteSkillSyncTarget(connectedRemoteSyncTarget, activeWorkspacePath ?? "")
        : "";
    const renderScopeLabel = useCallback((skill) => {
        switch (skill.scope) {
            case "workspace":
                // workspace 作用域显示 workspace 名，没有 workspace 时退回到通用文案。
                return (workspaceLabel ||
                    intl.formatMessage({
                        id: "settings.skills.scope.workspaceFallback",
                    }));
            case "plugin":
                return skill.pluginName?.trim()
                    ? resolvePluginDisplayName({
                        name: skill.pluginName,
                        listing: (skill.pluginId ? pluginListingById.get(skill.pluginId) : undefined) ??
                            resolveUniquePluginListingByName(availablePlugins, skill.pluginName),
                    }, locale)
                    : intl.formatMessage({ id: "settings.skills.scope.plugin" });
            case "user":
            default:
                return intl.formatMessage({ id: "settings.skills.scope.personal" });
        }
    }, [availablePlugins, intl, locale, pluginListingById, workspaceLabel]);
    const renderDiagnosticCodeLabel = useCallback((code) => intl.formatMessage({ id: `settings.skills.diagnostics.code.${code}` }), [intl]);
    const loadSkills = useCallback(async (showBlockingLoading) => {
        if (!targetServiceResolution.rpcReady)
            return;
        if (!activeWorkspacePath) {
            setSkills([]);
            setCapability(null);
            setDiagnostics([]);
            setError(null);
            setLoading(false);
            setLoadedSkillTargetKey("");
            return;
        }
        const requestTargetKey = activeWorkspaceIdentity?.trim() || activeWorkspacePath;
        setLoading(showBlockingLoading);
        setError(null);
        const requestId = ++latestRequestIdRef.current;
        try {
            const result = await skillsService.list({
                workspacePath: activeWorkspacePath,
                workspaceIdentity: activeWorkspaceIdentity,
                provider: ZCODE_AGENT_PROVIDER,
            });
            if (requestId !== latestRequestIdRef.current) {
                return;
            }
            setSkills(result.skills);
            setCapability(result.capability);
            setDiagnostics(result.diagnostics);
            setLoadedSkillTargetKey(requestTargetKey);
            setLoading(false);
        }
        catch (loadError) {
            if (requestId !== latestRequestIdRef.current) {
                return;
            }
            setLoadedSkillTargetKey(requestTargetKey);
            setLoading(false);
            setError(loadError instanceof Error ? loadError.message : String(loadError));
        }
    }, [
        activeWorkspaceIdentity,
        activeWorkspacePath,
        skillsService,
        targetServiceResolution.rpcReady,
    ]);
    useEffect(() => {
        if (!targetServiceResolution.rpcReady) {
            latestRequestIdRef.current += 1;
            setLoading(false);
            setError(null);
            setImportDialogOpen(false);
            setRemoteSkillSyncOpen(false);
            return;
        }
        // 首屏或切换 Scope target 时必须显示阻塞 loading；手动刷新仍走后台刷新，
        // 避免有当前 target 数据时整块闪烁。
        void loadSkills(true);
    }, [activeWorkspacePath, loadSkills, targetServiceResolution.rpcReady]);
    const refresh = useCallback(async () => {
        await loadSkills(false);
    }, [loadSkills]);
    const refreshSharedSkillStoreForCurrentWorkspace = useCallback(async () => {
        await refreshSharedSkillStoreForWorkspace({
            workspacePath: activeWorkspacePath,
            workspaceIdentity: activeWorkspaceIdentity,
            skillsService,
        });
    }, [activeWorkspaceIdentity, activeWorkspacePath, skillsService]);
    const setEnabled = useCallback(async (skillId, enabled) => {
        if (!activeWorkspacePath) {
            return;
        }
        // 移除三方来源后，技能状态统一写入 ZCode Agent 上下文，避免旧 provider 前缀带来分桶漂移。
        const targetSkill = skills.find((skill) => skill.id === skillId);
        const effectiveProvider = ZCODE_AGENT_PROVIDER;
        try {
            await skillsService.setEnabled({
                workspacePath: activeWorkspacePath,
                workspaceIdentity: activeWorkspaceIdentity,
                provider: effectiveProvider,
                scope: targetSkill?.scope,
                skillId,
                enabled,
            });
            await invalidateDeferredDraftSessionForSkillChange({
                zcodeSessionService,
                workspacePath: activeWorkspacePath,
                workspaceIdentity: activeWorkspaceIdentity,
                reason: "settings-skill-enabled",
            });
            await Promise.all([
                loadSkills(false),
                refreshSharedSkillStoreForCurrentWorkspace(),
            ]);
        }
        catch (setEnabledError) {
            setError(setEnabledError instanceof Error
                ? setEnabledError.message
                : String(setEnabledError));
        }
    }, [
        activeWorkspaceIdentity,
        activeWorkspacePath,
        loadSkills,
        refreshSharedSkillStoreForCurrentWorkspace,
        skills,
        skillsService,
        zcodeSessionService,
    ]);
    // 删除本地技能：plugin 作用域技能不可单独删除（由卸载插件管理），调用方已在 UI 层屏蔽其入口。
    // 复用应用根部已挂载的确认弹窗 store（useConfirmDialog），与子智能体删除流程保持一致。
    const handleDeleteSkill = useCallback(async (skill) => {
        if (!activeWorkspacePath || skill.scope === "plugin") {
            return;
        }
        const confirmed = await confirmDialog({
            title: intl.formatMessage({ id: "settings.skills.delete.title" }),
            description: intl.formatMessage({ id: "settings.skills.delete.description" }, { name: skill.name }),
            confirmLabel: intl.formatMessage({ id: "common.delete" }),
        });
        if (!confirmed) {
            return;
        }
        try {
            await skillsService.deleteSkill({
                workspacePath: activeWorkspacePath,
                workspaceIdentity: activeWorkspaceIdentity,
                skillId: skill.id,
            });
            await invalidateDeferredDraftSessionForSkillChange({
                zcodeSessionService,
                workspacePath: activeWorkspacePath,
                workspaceIdentity: activeWorkspaceIdentity,
                reason: "settings-skill-delete",
            });
            if (selectedSkill?.id === skill.id) {
                setSelectedSkill(null);
            }
            await loadSkills(false);
        }
        catch (deleteError) {
            setError(deleteError instanceof Error
                ? deleteError.message
                : String(deleteError));
        }
    }, [
        activeWorkspaceIdentity,
        activeWorkspacePath,
        confirmDialog,
        intl,
        loadSkills,
        selectedSkill,
        skillsService,
        zcodeSessionService,
    ]);
    const scopedProviderSkills = useMemo(() => {
        const allProviderSkills = filterSkillsForProvider(skills, ZCODE_AGENT_PROVIDER);
        const pluginStoreMatchesTarget = (pluginWorkspaceIdentity?.trim() || pluginWorkspacePath || "") ===
            (activeWorkspaceIdentity?.trim() || activeWorkspacePath || "") &&
            pluginConfigScope === scopeFilter;
        return selectSkillsForScope(allProviderSkills, pluginStoreMatchesTarget
            ? selectPluginsForScope(plugins, installedPlugins, scopeFilter)
            : [], scopeFilter);
    }, [
        activeWorkspaceIdentity,
        activeWorkspacePath,
        installedPlugins,
        pluginWorkspaceIdentity,
        pluginWorkspacePath,
        pluginConfigScope,
        plugins,
        scopeFilter,
        skills,
    ]);
    const groupedSkills = useMemo(() => groupSkillsByPlugin(scopedProviderSkills, query), [query, scopedProviderSkills]);
    const skillSourceGroups = useMemo(() => {
        return groupScopedSkillsBySource([...groupedSkills.local, ...groupedSkills.plugin], scopeFilter === "user"
            ? intl.formatMessage({ id: "settings.scope.user" })
            : workspaceLabel ||
                intl.formatMessage({ id: "settings.scope.workspace" }));
    }, [
        groupedSkills.local,
        groupedSkills.plugin,
        intl,
        scopeFilter,
        workspaceLabel,
    ]);
    const filteredSkillCount = groupedSkills.local.length + groupedSkills.plugin.length;
    const hasEmptySearchResult = Boolean(query.trim()) && filteredSkillCount === 0;
    const directInstalledSkillCount = scopedProviderSkills.filter((skill) => skill.scope !== "plugin").length;
    const hideInstalledGroup = Boolean(query.trim()) && groupedSkills.local.length === 0;
    const pluginIconItemById = useMemo(() => new Map(plugins.map((plugin) => [
        plugin.id,
        { name: plugin.name, listing: pluginListingById.get(plugin.id) },
    ])), [pluginListingById, plugins]);
    useEffect(() => {
        onVisibleCountChange?.(filteredSkillCount);
    }, [filteredSkillCount, onVisibleCountChange]);
    const handleCreateSkill = () => {
        if (!activeWorkspacePath || !onCreateTask) {
            return;
        }
        const effectiveProvider = ZCODE_AGENT_PROVIDER;
        const skillCreator = filterSkillsForProvider(skills, effectiveProvider).find((skill) => skill.name === "skill-creator");
        const markdown = buildSkillMentionMarkdown("skill-creator", skillCreator?.path);
        // v4 迁移删除旧 pendingComposerPrefill 后，这个入口仍手工操作 session
        // store，只剩返回聊天页的导航，skill-creator 文本没有进入新 Composer。统一委托
        // Root 的新任务入口，让草稿持久化、workspaceIdentity 隔离和 Composer 插入保持单一路径。
        onCreateTask({
            provider: effectiveProvider,
            initialPrompt: `${markdown} `,
            initialPromptMention: {
                id: `skill:${skillCreator?.id ?? "skill-creator"}`,
                category: "skills",
                label: "skill-creator",
                value: "skill-creator",
                markdown,
                ...(skillCreator?.description
                    ? { description: skillCreator.description }
                    : {}),
                ...(skillCreator
                    ? {
                        data: {
                            path: skillCreator.path,
                            scope: skillCreator.scope,
                        },
                    }
                    : {}),
            },
        });
    };
    const detailSkill = selectedSkill
        ? (skills.find((skill) => skill.id === selectedSkill.id) ?? selectedSkill)
        : null;
    const selectedSkillPublishedAt = formatSkillPublishedAt(detailSkill?.metadata?.publishedAt);
    const openSkillFilePath = useCallback(async (path) => {
        const result = await platform.openInFileManager(path);
        if (!result.success) {
            toast(intl.formatMessage({ id: "appHeader.openInFileManagerFailed" }));
        }
    }, [intl, platform]);
    // 诊断条数不等于加载失败的技能数；同一次扫描可以返回可用技能和多个目录级警告。
    // 按严重级别展示真实统计，避免把 warning 误报成“所有技能加载失败”。
    const diagnosticErrorCount = diagnostics.filter((diagnostic) => diagnostic.severity === "error").length;
    const diagnosticWarningCount = diagnostics.length - diagnosticErrorCount;
    const diagnosticsSummary = diagnostics.length > 0
        ? intl.formatMessage({ id: "settings.skills.diagnostics.summary" }, {
            errorCount: String(diagnosticErrorCount),
            warningCount: String(diagnosticWarningCount),
        })
        : "";
    const renderSkillRow = (skill) => {
        const pluginIconItem = skill.pluginId
            ? pluginIconItemById.get(skill.pluginId)
            : skill.pluginName
                ? {
                    name: skill.pluginName,
                    listing: resolveUniquePluginListingByName(availablePlugins, skill.pluginName),
                }
                : undefined;
        return (_jsxs("div", { className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-hover", children: [skill.scope === "plugin" && pluginIconItem ? (_jsx(PluginStoreAvatar, { item: pluginIconItem, className: "size-9 bg-background" })) : (_jsx("div", { className: "flex size-9 shrink-0 items-center justify-center rounded-xl bg-background text-foreground-subtle", "aria-hidden": "true", children: _jsx(WandSparkles, { className: "size-4" }) })), _jsxs("div", { role: "button", tabIndex: 0, className: "min-w-0 cursor-default rounded-md outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused focus-visible:ring-offset-2 focus-visible:ring-offset-card", onClick: () => setSelectedSkill(skill), onKeyDown: (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedSkill(skill);
                        }
                    }, children: [_jsx("div", { className: "flex min-w-0 flex-wrap items-center gap-2", children: _jsx("span", { className: "truncate text-ui-base font-medium text-foreground", children: skill.name }) }), _jsx("div", { className: "mt-0.5 truncate text-ui-sm text-foreground-subtle", children: skill.description ||
                                intl.formatMessage({
                                    id: "settings.skills.noDescription",
                                }) })] }), _jsx("div", { className: "flex shrink-0 items-center gap-2", children: skill.scope === "plugin" ? null : (_jsxs(_Fragment, { children: [_jsx(Switch, { checked: skill.enabled, onCheckedChange: (checked) => {
                                    void setEnabled(skill.id, checked);
                                } }), _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "shrink-0 text-foreground-subtle hover:bg-destructive/10 hover:text-destructive", "aria-label": intl.formatMessage({ id: "common.delete" }), title: intl.formatMessage({ id: "common.delete" }), onClick: () => void handleDeleteSkill(skill), children: _jsx(Trash2, { className: "size-3.5", "aria-hidden": "true" }) })] })) })] }, skill.id));
    };
    const renderSkillList = (groupSkills) => (_jsx(SettingsResourceList, { items: groupSkills, getKey: (skill) => skill.id, renderItem: renderSkillRow }));
    const skillHeaderActions = (_jsx(SettingsResourceHeaderActions, { onRefresh: () => void Promise.all([
            refresh(),
            refreshSharedSkillStoreForCurrentWorkspace(),
        ]), onImport: () => setImportDialogOpen(true), onNew: handleCreateSkill, importDisabled: !capability?.userScopeAvailable, importActionId: "settings.skills.import.open", newActionId: "settings.skills.create.open" }));
    const remoteSyncAction = connectedRemoteSyncTarget ? (_jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "settings.skills.remoteSync.open" }), children: _jsx(Button, { type: "button", variant: "outline", size: "icon-lg", "aria-label": intl.formatMessage({
                id: "settings.skills.remoteSync.open",
            }), onClick: () => setRemoteSkillSyncOpen(true), children: _jsx(UploadCloud, { className: "size-3.5", "aria-hidden": "true" }) }) })) : null;
    return (_jsxs("div", { className: "space-y-4", children: [reportDetailBreadcrumb && detailSkill ? (_jsx(SettingsBreadcrumbReporter, { items: showMarketplaceBreadcrumb
                    ? [
                        {
                            label: intl.formatMessage({ id: "settings.plugins.title" }),
                            onSelect: () => setSelectedSkill(null),
                        },
                        { label: detailSkill.name },
                    ]
                    : [{ label: detailSkill.name }], onSectionSelect: showMarketplaceBreadcrumb && onOpenPluginStore
                    ? onOpenPluginStore
                    : () => setSelectedSkill(null) })) : null, remoteSyncAction ? (_jsx("div", { className: "flex justify-end", children: remoteSyncAction })) : null, connectedRemoteSyncTarget ? (_jsx("div", { className: "rounded-lg border border-border bg-card px-3 py-2 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.skills.remoteContext" }, { target: remoteSkillSyncTargetLabel }) })) : null, targetServiceResolution.rpcReady && diagnostics.length > 0 ? (_jsxs("div", { className: "overflow-hidden rounded-lg border border-amber-500/40 bg-amber-500/10 text-ui-base text-foreground", children: [_jsxs("button", { type: "button", className: "flex w-full items-center gap-2 px-3 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", onClick: () => setDiagnosticsOpen((prev) => !prev), "aria-expanded": diagnosticsOpen, "aria-label": diagnosticsOpen
                            ? intl.formatMessage({
                                id: "settings.skills.diagnostics.collapse",
                            })
                            : intl.formatMessage({
                                id: "settings.skills.diagnostics.expand",
                            }), children: [diagnosticsOpen ? (_jsx(ChevronDown, { className: "size-3.5 shrink-0", "aria-hidden": "true" })) : (_jsx(ChevronRight, { className: "size-3.5 shrink-0", "aria-hidden": "true" })), _jsx(AlertTriangle, { className: "size-3.5 shrink-0 text-amber-500", "aria-hidden": "true" }), _jsx("span", { className: "flex-1 truncate font-medium", children: diagnosticsSummary })] }), diagnosticsOpen ? (_jsx("ul", { className: "space-y-1 border-t border-amber-500/30 px-3 py-2", children: diagnostics.map((diagnostic, index) => (_jsxs("li", { className: "min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [_jsx("span", { className: diagnostic.severity === "error"
                                                ? "shrink-0 text-ui-xs font-semibold uppercase tracking-wide text-destructive"
                                                : "shrink-0 text-ui-xs font-semibold uppercase tracking-wide text-amber-500", children: diagnostic.severity }), _jsx("span", { className: "font-medium text-foreground", children: renderDiagnosticCodeLabel(diagnostic.code) }), diagnostic.skillName ? (_jsxs("span", { className: "text-foreground-subtle", children: ["\u00B7 ", diagnostic.skillName] })) : null] }), _jsx("div", { className: "mt-0.5 break-words text-foreground-subtle", children: diagnostic.message }), diagnostic.path ? (_jsx("div", { className: "mt-0.5 break-all font-mono text-ui-xs text-foreground-subtle", children: diagnostic.path })) : null] }, `${diagnostic.code}-${diagnostic.path ?? "no-path"}-${index}`))) })) : null] })) : null, targetServiceResolution.rpcReady && !capability?.userScopeAvailable ? (_jsx("div", { className: "rounded-lg border border-border bg-card px-3 py-2 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.skills.userScopeDesktopOnly" }) })) : null, targetServiceResolution.rpcReady && error ? (_jsx("div", { className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-ui-base text-destructive", children: error })) : null, !targetServiceResolution.rpcReady ? (_jsx(PluginLoadingState, { label: intl.formatMessage({ id: "common.connecting" }) })) : loading || !projectionMatchesTarget ? (_jsx(PluginLoadingState, { label: intl.formatMessage({ id: "common.loading" }) })) : hasEmptySearchResult ? (_jsx(PluginSearchEmptyState, { label: intl.formatMessage({
                    id: "settings.plugin.skills.searchEmpty",
                }) })) : (_jsxs("div", { className: "space-y-6", children: [_jsxs("section", { className: hideInstalledGroup ? "hidden" : "space-y-4", children: [_jsx("div", { "data-skills-plugin-direct-actions": "true", children: _jsx(SettingsResourceGroupHeader, { actions: skillHeaderActions, count: groupedSkills.local.length, title: intl.formatMessage({
                                        id: "settings.plugin.skills.installed",
                                    }) }) }), groupedSkills.local.length > 0 ? (renderSkillList(groupedSkills.local)) : directInstalledSkillCount === 0 && !query.trim() ? (_jsx(PluginInstallEmptyState, { title: intl.formatMessage({
                                    id: "settings.plugin.skills.emptyInstalledTitle",
                                }), description: intl.formatMessage({
                                    id: "settings.plugin.skills.emptyInstalledDescription",
                                }), actions: _jsxs(_Fragment, { children: [_jsxs(Button, { type: "button", variant: "default", size: "lg", onClick: handleCreateSkill, children: [_jsx(Plus, { "data-icon": "inline-start", "aria-hidden": "true" }), intl.formatMessage({
                                                    id: "settings.plugin.skills.newSkill",
                                                })] }), _jsxs(Button, { type: "button", variant: "outline", size: "lg", disabled: !capability?.userScopeAvailable, onClick: () => setImportDialogOpen(true), children: [_jsx(Import, { "data-icon": "inline-start", "aria-hidden": "true" }), intl.formatMessage({
                                                    id: "settings.skills.import.action",
                                                })] })] }) })) : null] }), skillSourceGroups
                        .filter((group) => group.id.startsWith("plugin:"))
                        .map((group) => (_jsxs("section", { className: "space-y-4", children: [_jsx(SettingsResourceGroupHeader, { count: group.skills.length, title: resolvePluginDisplayName({
                                    name: group.label,
                                    listing: (group.pluginId ? pluginListingById.get(group.pluginId) : undefined) ??
                                        resolveUniquePluginListingByName(availablePlugins, group.label),
                                }, locale) }), renderSkillList(group.skills)] }, group.id)))] })), _jsx(Dialog, { open: selectedSkill !== null, onOpenChange: (open) => {
                    if (!open) {
                        setSelectedSkill(null);
                    }
                }, children: _jsx(DialogContent, { className: "max-h-[min(80vh,640px)] max-w-xl overflow-hidden p-0", children: detailSkill ? (_jsxs("div", { className: "flex min-h-0 flex-col", children: [_jsx(DialogHeader, { className: "border-b border-popover-border px-4 pt-4 pb-3", children: _jsx(DialogTitle, { className: "truncate pr-8 text-ui-lg", children: detailSkill.name }) }), _jsxs("div", { className: "min-h-0 space-y-4 overflow-auto px-4 py-5", children: [_jsxs("div", { className: "grid gap-1.5", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({
                                                    id: "settings.skills.detail.description",
                                                }) }), _jsx("div", { className: "max-h-40 overflow-auto whitespace-pre-wrap text-ui-base/relaxed text-foreground-subtle", children: detailSkill.description ||
                                                    intl.formatMessage({
                                                        id: "settings.skills.noDescription",
                                                    }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-x-6 gap-y-3", children: [_jsx(SkillDetailField, { label: intl.formatMessage({
                                                    id: "settings.skills.detail.scope",
                                                }), value: renderScopeLabel(detailSkill) }), _jsx(SkillDetailField, { label: intl.formatMessage({
                                                    id: "settings.skills.detail.status",
                                                }), value: detailSkill.enabled
                                                    ? intl.formatMessage({
                                                        id: "settings.skills.detail.enabled",
                                                    })
                                                    : intl.formatMessage({
                                                        id: "settings.skills.detail.disabled",
                                                    }) }), _jsx(SkillDetailField, { label: intl.formatMessage({
                                                    id: "settings.skills.detail.version",
                                                }), value: detailSkill.metadata?.version, mono: true }), _jsx(SkillDetailField, { label: intl.formatMessage({
                                                    id: "settings.skills.detail.slug",
                                                }), value: detailSkill.metadata?.slug, mono: true }), _jsx(SkillDetailField, { label: intl.formatMessage({
                                                    id: "settings.skills.detail.publishedAt",
                                                }), value: selectedSkillPublishedAt, mono: true }), _jsx(SkillDetailField, { label: intl.formatMessage({
                                                    id: "settings.skills.detail.ownerId",
                                                }), value: detailSkill.metadata?.ownerId, mono: true, className: "col-span-2" }), _jsx(SkillPathDetailField, { label: intl.formatMessage({
                                                    id: "settings.skills.detail.path",
                                                }), path: detailSkill.path, openLabel: intl.formatMessage({
                                                    id: "settings.skills.detail.openPath",
                                                }), onOpen: () => void openSkillFilePath(detailSkill.path) })] })] })] })) : null }) }), _jsx(SkillsImportDialog, { open: importDialogOpen && targetServiceResolution.rpcReady, workspacePath: activeWorkspacePath, workspaceIdentity: activeWorkspaceIdentity, settingsSyncService: targetServiceResolution.services.settingsSyncService, onOpenChange: setImportDialogOpen, onImported: async () => {
                    await invalidateDeferredDraftSessionForSkillChange({
                        zcodeSessionService,
                        workspacePath: activeWorkspacePath,
                        workspaceIdentity: activeWorkspaceIdentity,
                        reason: "settings-skill-import",
                    });
                    await refresh();
                } }), _jsx(RemoteSyncDialogs, { canSyncSkills: Boolean(targetServiceResolution.rpcReady &&
                    connectedRemoteSyncTarget &&
                    activeWorkspacePath), canSyncMcp: false, skillOpen: remoteSkillSyncOpen && targetServiceResolution.rpcReady, mcpOpen: false, onSkillOpenChange: setRemoteSkillSyncOpen, onMcpOpenChange: () => { }, localSkillSyncService: baseServices.skillSyncService, remoteSkillSyncService: skillSyncService, remoteTarget: connectedRemoteSyncTarget, skillWorkspacePath: activeWorkspacePath ?? "", mcpWorkspacePath: "", workspaceIdentity: activeWorkspaceIdentity, onSkillsSynced: async () => {
                    await invalidateDeferredDraftSessionForSkillChange({
                        zcodeSessionService,
                        workspacePath: activeWorkspacePath,
                        workspaceIdentity: activeWorkspaceIdentity,
                        reason: "settings-remote-skill-sync",
                    });
                    await Promise.all([
                        refresh(),
                        refreshSharedSkillStoreForCurrentWorkspace(),
                    ]);
                }, onMcpSynced: () => { } })] }));
}
//# sourceMappingURL=SkillsSection.js.map