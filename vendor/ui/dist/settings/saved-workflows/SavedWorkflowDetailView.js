import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { TID_WORKFLOW_DETAIL, TID_WORKFLOW_DETAIL_SCRIPT, TID_WORKFLOW_DETAIL_TAB, } from "@zcode/shared";
import { CodeBlock } from "@/components/ai-elements/code-block.js";
import { Button } from "@/components/ui/button.js";
import { Spinner } from "@/components/ui/spinner.js";
import { toast } from "@/components/ui/toast.js";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { logger } from "@/logger.js";
import { SettingsBreadcrumbReporter } from "@/settings/SettingsHeaderBreadcrumb.js";
import { SETTINGS_FRAME_CONTENT_CLASSNAME } from "@/settings/SettingsPageParts.js";
import { SettingsSegmentedTabs } from "@/settings/SettingsSegmentedTabs.js";
import { argsDeclarationToRows, rowsToArgsDeclaration, } from "@/settings/saved-workflows/savedWorkflowArgsForm.js";
import { SavedWorkflowArtifactChips } from "@/settings/saved-workflows/SavedWorkflowArtifactChips.js";
import { SavedWorkflowDetailHeader } from "@/settings/saved-workflows/SavedWorkflowDetailHeader.js";
import { SavedWorkflowMetaForm, } from "@/settings/saved-workflows/SavedWorkflowMetaForm.js";
import { SavedWorkflowRunHistory, } from "@/settings/saved-workflows/SavedWorkflowRunHistoryPanel.js";
function draftFromMeta(meta) {
    return {
        description: meta.description,
        whenToUse: meta.whenToUse ?? "",
        rows: argsDeclarationToRows(meta.args),
    };
}
let rowKeySeq = 0;
/**
 * 工作流详情页：与定时任务编辑页同构——
 * 面包屑、标题、右上动作、分段标签。「定义」= 元数据行内编辑 + 只读脚本；「运行历史」= journal 行。
 */
export function SavedWorkflowDetailView({ target, agentService, name, projectLabel, entry, runs, now, busy, canOpenRun, onBack, onRun, onRevise, onCopyPath, onMove, onDelete, onOpenRun, onOpenArtifact, onMetaSaved, resolveRunProject, launchDialog, }) {
    const { intl } = useZCodeIntl();
    const [tab, setTab] = useState("definition");
    const [loadState, setLoadState] = useState({ status: "loading" });
    const [draft, setDraft] = useState(null);
    const [rowErrors, setRowErrors] = useState({});
    const [descriptionError, setDescriptionError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [reloadSeq, setReloadSeq] = useState(0);
    useEffect(() => {
        let cancelled = false;
        setLoadState({ status: "loading" });
        agentService
            .getSavedWorkflow({ ...target, name })
            .then((result) => {
            if (cancelled)
                return;
            if (!result.ok) {
                setLoadState({ status: "failed", reason: result.reason });
                return;
            }
            setLoadState({ status: "ready", detail: result });
            setDraft(draftFromMeta(result.meta));
            setRowErrors({});
            setDescriptionError(false);
        })
            .catch((error) => {
            if (cancelled)
                return;
            const message = error instanceof Error ? error.message : String(error);
            logger.warn("[SavedWorkflows] 读取工作流详情失败", { name, error: message });
            setLoadState({ status: "failed", reason: message });
        });
        return () => {
            cancelled = true;
        };
    }, [agentService, name, reloadSeq, target]);
    const detail = loadState.status === "ready" ? loadState.detail : null;
    const baseline = useMemo(() => (detail ? draftFromMeta(detail.meta) : null), [detail]);
    const dirty = useMemo(() => {
        if (!draft || !baseline)
            return false;
        return JSON.stringify(draft) !== JSON.stringify(baseline);
    }, [baseline, draft]);
    const updateDraft = useCallback((patch) => {
        setDraft((current) => (current ? { ...current, ...patch } : current));
    }, []);
    const updateRow = useCallback((key, patch) => {
        setDraft((current) => current
            ? {
                ...current,
                rows: current.rows.map((row) => (row.key === key ? { ...row, ...patch } : row)),
            }
            : current);
        setRowErrors((current) => {
            if (!(key in current))
                return current;
            const next = { ...current };
            delete next[key];
            return next;
        });
    }, []);
    const addRow = useCallback(() => {
        rowKeySeq += 1;
        setDraft((current) => current
            ? {
                ...current,
                rows: [
                    ...current.rows,
                    {
                        key: `new:${rowKeySeq}`,
                        name: "",
                        type: "string",
                        required: false,
                        defaultText: "",
                        description: "",
                    },
                ],
            }
            : current);
    }, []);
    const removeRow = useCallback((key) => {
        setDraft((current) => current ? { ...current, rows: current.rows.filter((row) => row.key !== key) } : current);
    }, []);
    const discard = useCallback(() => {
        if (baseline)
            setDraft(baseline);
        setRowErrors({});
        setDescriptionError(false);
    }, [baseline]);
    const save = useCallback(async () => {
        if (!draft)
            return;
        const description = draft.description.trim();
        const collected = rowsToArgsDeclaration(draft.rows);
        const descriptionMissing = description.length === 0;
        setDescriptionError(descriptionMissing);
        if (!collected.ok)
            setRowErrors(collected.errors);
        if (descriptionMissing || !collected.ok)
            return;
        const whenToUse = draft.whenToUse.trim();
        const meta = {
            description,
            ...(whenToUse.length === 0 ? {} : { whenToUse }),
            ...(collected.args === undefined ? {} : { args: collected.args }),
        };
        setSaving(true);
        try {
            const result = await agentService.updateSavedWorkflowMeta({ ...target, name, meta });
            if (!result.ok) {
                toast(intl.formatMessage({ id: "workflows.hub.detail.meta.saveFailed" }, { reason: intl.formatMessage({ id: `workflows.hub.reason.${result.reason}` }) }));
                return;
            }
            toast(intl.formatMessage({ id: "workflows.hub.detail.meta.saved" }));
            setReloadSeq((current) => current + 1);
            onMetaSaved();
        }
        catch (error) {
            toast(intl.formatMessage({ id: "workflows.hub.detail.meta.saveFailed" }, { reason: error instanceof Error ? error.message : String(error) }));
        }
        finally {
            setSaving(false);
        }
    }, [agentService, draft, intl, name, onMetaSaved, target]);
    const copyScript = useCallback(() => {
        if (!detail)
            return;
        void navigator.clipboard?.writeText(detail.script).catch(() => undefined);
    }, [detail]);
    // 「最近产物」条：**最近一次 completed run** 的
    // 产物。刻意不取「最近一次 run」——一次刚失败的运行往往什么都没交付，用它会让这条已经存在的
    // 交付物凭空消失一阵子。runs 已按 updatedAt 倒序（服务端 time_updated desc），取首个即可。
    const latestArtifactRun = useMemo(() => runs.find((run) => run.status === "completed" && (run.artifacts?.length ?? 0) > 0), [runs]);
    const path = detail?.path ?? entry?.path ?? "";
    const description = detail?.meta.description ?? entry?.description ?? "";
    return (_jsxs("div", { "data-testid": TID_WORKFLOW_DETAIL, className: cn(SETTINGS_FRAME_CONTENT_CLASSNAME, "flex flex-col gap-6"), children: [_jsx(SettingsBreadcrumbReporter, { items: [{ label: projectLabel }, { label: name }], onSectionSelect: onBack }), _jsx(SavedWorkflowDetailHeader, { name: name, description: description, entry: entry, busy: busy, onRun: onRun, onRevise: onRevise, onCopyPath: onCopyPath, onMove: onMove, onDelete: onDelete }), latestArtifactRun?.artifacts === undefined ? null : (_jsxs("div", { className: "flex flex-wrap items-center gap-2", "data-testid": "workflow-detail-artifacts", children: [_jsx("span", { className: "text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: "workflows.hub.artifacts.latest" }) }), _jsx(SavedWorkflowArtifactChips, { artifacts: latestArtifactRun.artifacts, size: "md", ...(onOpenArtifact === undefined || !latestArtifactRun.parentSessionId
                            ? {}
                            : {
                                onOpenArtifact: (artifactId) => onOpenArtifact(latestArtifactRun, artifactId),
                            }) })] })), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx("div", { "data-testid": TID_WORKFLOW_DETAIL_TAB, children: _jsx(SettingsSegmentedTabs, { value: tab, items: [
                                {
                                    value: "definition",
                                    label: intl.formatMessage({ id: "workflows.hub.detail.tab.definition" }),
                                },
                                {
                                    value: "history",
                                    label: `${intl.formatMessage({ id: "workflows.hub.detail.tab.history" })} ${runs.length > 0 ? runs.length : ""}`.trim(),
                                },
                            ], onValueChange: setTab }) }), path ? (_jsxs("div", { className: "flex min-w-0 items-center gap-1 text-foreground-subtle", children: [_jsx("span", { className: "min-w-0 truncate font-mono text-ui-sm", title: path, children: path }), _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({ id: "workflows.hub.detail.copyPath" }), onClick: onCopyPath, children: _jsx(Copy, { className: "size-3.5", "aria-hidden": "true" }) })] })) : null] }), tab === "history" ? (_jsx(SavedWorkflowRunHistory, { runs: runs, now: now, canOpenRun: canOpenRun, onOpenRun: onOpenRun, onOpenArtifact: onOpenArtifact, resolveRunProject: resolveRunProject })) : loadState.status === "loading" ? (_jsx("div", { className: "flex h-40 items-center justify-center", children: _jsx(Spinner, { className: "size-5" }) })) : loadState.status === "failed" ? (_jsx("p", { className: "text-ui-base text-destructive", children: loadState.reason === "not_found"
                    ? intl.formatMessage({ id: "workflows.hub.detail.notFound" })
                    : intl.formatMessage({ id: "workflows.hub.detail.loadError" }, {
                        reason: loadState.reason === "invalid_name" ||
                            loadState.reason === "parse_error" ||
                            loadState.reason === "read_error"
                            ? intl.formatMessage({ id: `workflows.hub.reason.${loadState.reason}` })
                            : loadState.reason,
                    }) })) : detail && draft ? (_jsxs(_Fragment, { children: [_jsx(SavedWorkflowMetaForm, { draft: draft, rowErrors: rowErrors, descriptionError: descriptionError, dirty: dirty, saving: saving, onDescriptionChange: (value) => {
                            setDescriptionError(false);
                            updateDraft({ description: value });
                        }, onWhenToUseChange: (value) => updateDraft({ whenToUse: value }), onRowChange: updateRow, onRowAdd: addRow, onRowRemove: removeRow, onDiscard: discard, onSave: () => void save() }), _jsxs("section", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-3", children: [_jsx("h2", { className: "text-ui-base font-medium leading-5 text-foreground-subtle", children: intl.formatMessage({ id: "workflows.hub.detail.script" }) }), _jsx("p", { className: "text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: "workflows.hub.detail.script.note" }) })] }), _jsxs("div", { "data-testid": TID_WORKFLOW_DETAIL_SCRIPT, className: "overflow-hidden rounded-lg border border-border bg-surface", children: [_jsxs("div", { className: "flex h-8 items-center justify-between border-b border-border px-3", children: [_jsx("span", { className: "font-mono text-ui-sm text-foreground-subtle", children: `${name}.dwf.ts · TypeScript` }), _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({ id: "workflows.hub.detail.script.copy" }), onClick: copyScript, children: _jsx(Copy, { className: "size-3.5", "aria-hidden": "true" }) })] }), _jsx("div", { className: "max-h-[480px] overflow-auto", children: _jsx(CodeBlock, { code: detail.script, language: "typescript" }) })] })] })] })) : null, launchDialog] }));
}
//# sourceMappingURL=SavedWorkflowDetailView.js.map