import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {} from "@zcode/services";
import { TID_SETTINGS_MEMORY_SWITCH } from "@zcode/shared";
import { runUserAction, runUserActionAsync } from "../lib/userActionTelemetry.js";
import { Switch } from "../components/ui/switch.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { MemorySettingsViewer, } from "../settings/MemorySettingsViewer.js";
import { SettingsGroupCard, SettingsRow } from "../settings/SettingsPageParts.js";
function normalizeWorkspaceDisplayName(value) {
    const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 48);
    return slug || "project";
}
function buildWorkspaceDisplayNameMap(names) {
    const matches = new Map();
    const ambiguous = new Set();
    for (const candidate of names) {
        const displayName = candidate.trim();
        const slug = normalizeWorkspaceDisplayName(displayName);
        if (!displayName || !slug || ambiguous.has(slug))
            continue;
        const existing = matches.get(slug);
        if (existing && existing !== displayName) {
            matches.delete(slug);
            ambiguous.add(slug);
            continue;
        }
        matches.set(slug, displayName);
    }
    return matches;
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
export function MemorySettingsSection({ memoryEnabled, memoryService, onMemoryEnabledChange, projectMemoryViewerAvailable, workspaceDisplayNames = [], }) {
    const { intl } = useZCodeIntl();
    const catalogRequestIdRef = useRef(0);
    const [catalogState, setCatalogState] = useState("idle");
    const [catalogError, setCatalogError] = useState(null);
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
    const refreshCatalog = useCallback(async () => {
        const requestId = catalogRequestIdRef.current + 1;
        catalogRequestIdRef.current = requestId;
        setCatalogState("loading");
        setCatalogError(null);
        try {
            const result = await memoryService.listProjectMemories();
            if (catalogRequestIdRef.current !== requestId) {
                return null;
            }
            setWorkspaces(result);
            setCatalogState("ready");
            return result;
        }
        catch (error) {
            if (catalogRequestIdRef.current !== requestId) {
                return null;
            }
            setWorkspaces([]);
            setSelectedWorkspaceId(null);
            setCatalogError(getErrorMessage(error));
            setCatalogState("error");
            return null;
        }
    }, [memoryService]);
    useEffect(() => {
        if (memoryEnabled && projectMemoryViewerAvailable) {
            void refreshCatalog();
            return;
        }
        catalogRequestIdRef.current += 1;
        setCatalogState("idle");
        setCatalogError(null);
        setWorkspaces([]);
        setSelectedWorkspaceId(null);
    }, [memoryEnabled, projectMemoryViewerAvailable, refreshCatalog]);
    const displayWorkspaces = useMemo(() => {
        const displayNameBySlug = buildWorkspaceDisplayNameMap(workspaceDisplayNames);
        const orderBySlug = new Map();
        for (const [index, name] of workspaceDisplayNames.entries()) {
            const slug = normalizeWorkspaceDisplayName(name);
            if (!orderBySlug.has(slug))
                orderBySlug.set(slug, index);
        }
        return workspaces
            .map((workspace, catalogIndex) => {
            const slug = normalizeWorkspaceDisplayName(workspace.label);
            return {
                catalogIndex,
                order: orderBySlug.get(slug) ?? Number.POSITIVE_INFINITY,
                workspace: {
                    ...workspace,
                    label: displayNameBySlug.get(slug) ?? workspace.label,
                },
            };
        })
            .sort((left, right) => left.order - right.order || left.catalogIndex - right.catalogIndex)
            .map(({ workspace }) => workspace);
    }, [workspaceDisplayNames, workspaces]);
    const selectedWorkspace = useMemo(() => displayWorkspaces.find((workspace) => workspace.id === selectedWorkspaceId), [displayWorkspaces, selectedWorkspaceId]);
    useEffect(() => {
        const firstWorkspace = displayWorkspaces[0];
        if (!firstWorkspace) {
            setSelectedWorkspaceId(null);
            return;
        }
        if (!selectedWorkspaceId ||
            !displayWorkspaces.some((workspace) => workspace.id === selectedWorkspaceId)) {
            setSelectedWorkspaceId(firstWorkspace.id);
        }
    }, [displayWorkspaces, selectedWorkspaceId]);
    const handleRefresh = useCallback(async () => {
        await runUserActionAsync({
            input: { featureId: "settings.memory", action: "refresh_memory", trigger: "button" },
            operation: refreshCatalog,
            completed: { resultSource: "platform_result" },
            failureStage: "catalog_refresh",
        });
    }, [refreshCatalog]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(SettingsGroupCard, { children: _jsx(SettingsRow, { label: intl.formatMessage({
                        id: "settings.memory.workspaceMemory",
                    }), description: intl.formatMessage({
                        id: "settings.memoryDescription",
                    }), control: _jsx(Switch, { "aria-label": intl.formatMessage({
                            id: "settings.memory.workspaceMemory",
                        }), checked: memoryEnabled, "data-testid": TID_SETTINGS_MEMORY_SWITCH, onCheckedChange: (checked) => {
                            void onMemoryEnabledChange(checked);
                        } }) }) }), !projectMemoryViewerAvailable ? (_jsx("div", { className: "rounded-xl border border-dashed border-border bg-transparent px-4 py-8 text-center text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.memory.viewer.localOnly" }) })) : !memoryEnabled ? null : (_jsx(MemorySettingsViewer, { catalogError: catalogError, catalogState: catalogState, selectedWorkspace: selectedWorkspace, workspaces: displayWorkspaces, onRefresh: handleRefresh, onScopeKeyChange: (workspaceId) => runUserAction({
                    input: {
                        featureId: "settings.memory",
                        action: "change_memory_scope",
                        trigger: "select",
                    },
                    operation: () => setSelectedWorkspaceId(workspaceId),
                    completed: { resultSource: "local_commit" },
                    failureStage: "local_commit",
                }) }))] }));
}
//# sourceMappingURL=MemorySettingsSection.js.map