import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- 远端 plugin 同步弹窗集中维护加载、选择、风险提示、逐项进度和结果状态，保持与 Skill/MCP 同步弹窗一致。 */
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircleIcon, CheckCircle2, CircleStop, CircleX, Loader2, Cable, UploadCloud, } from "lucide-react";
import { ControlHintTooltip } from "../ControlHintTooltip.js";
import { cn } from "../components/lib/utils.js";
import { Button } from "../components/ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "../components/ui/dialog.js";
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "../components/ui/hover-card.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { formatRemoteSkillSyncTarget } from "../settings/RemoteSkillSyncDialog.js";
import { isRemoteSyncPreflightTimeoutError, runRemoteSyncPreflightWithTimeout, shouldStartRemoteSyncOperation, } from "../settings/RemoteSyncActions.js";
const REMOTE_PLUGIN_SYNC_CONFIG_SCOPE = "user";
export function shouldFinishRemotePluginSyncRun(currentRun, run) {
    return currentRun === run;
}
class RemotePluginSyncStoppedError extends Error {
    row;
    constructor(row) {
        super(`Stopped sync for ${row.candidate.pluginId}`);
        this.row = row;
        this.name = "RemotePluginSyncStoppedError";
    }
}
let remotePluginSyncOperationCounter = 0;
function createRemotePluginSyncOperationId(row) {
    remotePluginSyncOperationCounter += 1;
    const safePluginId = row.candidate.pluginId.replace(/[^a-z0-9._-]+/giu, "-");
    return `remote-plugin-sync-${remotePluginSyncOperationCounter}-${safePluginId}`;
}
function toInlineRemotePluginSyncCandidate(candidate) {
    return {
        id: `inline:${candidate.id}`,
        kind: "inline",
        name: candidate.name,
        pluginId: candidate.pluginId,
        marketplace: "inline",
        ...(candidate.description ? { description: candidate.description } : {}),
        ...(candidate.version ? { version: candidate.version } : {}),
        path: candidate.path,
        enabled: candidate.enabled,
        componentTypes: candidate.componentTypes,
        inlineCandidate: candidate,
    };
}
function createInlineStatusKey(pluginId, directoryName) {
    return `${pluginId.toLowerCase()}\u0000${directoryName}`;
}
export function buildRemotePluginSyncRows(candidates, statuses) {
    const statusByKey = new Map(statuses.map((status) => [
        createInlineStatusKey(status.pluginId, status.directoryName),
        status,
    ]));
    return buildRemotePluginSyncRowsForCandidates(candidates.map(toInlineRemotePluginSyncCandidate), candidates.map((candidate) => {
        const status = statusByKey.get(createInlineStatusKey(candidate.pluginId, candidate.directoryName));
        return {
            candidateId: `inline:${candidate.id}`,
            exists: status?.exists ?? false,
            ...(status?.path ? { path: status.path } : {}),
            ...(status?.reason ? { reason: status.reason } : {}),
        };
    }));
}
export function buildRemotePluginSyncRowsForCandidates(candidates, statuses) {
    const statusById = new Map(statuses.map((status) => [status.candidateId, status]));
    return candidates.map((candidate) => {
        const status = statusById.get(candidate.id);
        return {
            candidate,
            exists: status?.exists ?? false,
            ...(status?.path ? { path: status.path } : {}),
            ...(status?.reason ? { reason: status.reason } : {}),
            ...(status?.remoteMarketplaceExists !== undefined
                ? { remoteMarketplaceExists: status.remoteMarketplaceExists }
                : {}),
        };
    });
}
export function resolveDefaultRemotePluginSyncSelection(rows) {
    return new Set(rows.filter((row) => !row.exists).map((row) => row.candidate.id));
}
export function filterRemotePluginSyncRows(rows, showExistingRemotePlugins) {
    return showExistingRemotePlugins ? [...rows] : rows.filter((row) => !row.exists);
}
export function shouldAllowRemotePluginSyncDialogOpenChange(step, nextOpen) {
    return nextOpen || (step !== "preflighting" && step !== "syncing");
}
export function buildMarketplaceRemotePluginSyncCandidates(overview, plugins) {
    const pluginInfoById = new Map(plugins.map((plugin) => [plugin.id, plugin]));
    const marketplaceSourceById = new Map(overview.marketplaces.map((marketplace) => [
        marketplace.id,
        buildMarketplaceSourceSyncInfo(marketplace),
    ]));
    return overview.installedPlugins.map((plugin) => {
        const info = pluginInfoById.get(plugin.id);
        const componentTypes = plugin.componentTypes ?? componentTypesFromPluginInfo(info);
        const marketplaceSource = marketplaceSourceById.get(plugin.marketplace);
        const pluginOptions = buildRemotePluginSyncPluginOptions(info);
        return {
            id: `marketplace:${plugin.id}`,
            kind: "marketplace",
            name: plugin.name,
            pluginId: plugin.id,
            marketplace: plugin.marketplace,
            ...(plugin.description ?? info?.description
                ? { description: plugin.description ?? info?.description }
                : {}),
            ...(plugin.version ?? info?.version ? { version: plugin.version ?? info?.version } : {}),
            ...(plugin.installPath ?? info?.rootPath
                ? { path: plugin.installPath ?? info?.rootPath }
                : {}),
            enabled: plugin.enabled,
            componentTypes,
            ...(pluginOptions ? { pluginOptions } : {}),
            marketplacePlugin: {
                ...marketplaceSource,
                pluginName: plugin.name,
            },
        };
    });
}
export function buildMarketplaceRemotePluginStatuses(candidates, remoteOverview) {
    const installedById = new Map(remoteOverview.installedPlugins.map((plugin) => [plugin.id, plugin]));
    const remoteMarketplaceIds = new Set(remoteOverview.marketplaces.map((marketplace) => marketplace.id));
    return candidates.map((candidate) => {
        const installed = installedById.get(candidate.pluginId);
        return {
            candidateId: candidate.id,
            exists: Boolean(installed),
            ...(installed?.installPath ? { path: installed.installPath } : {}),
            ...(installed ? { reason: "samePluginId" } : {}),
            remoteMarketplaceExists: remoteMarketplaceIds.has(candidate.marketplace),
        };
    });
}
function componentTypesFromPluginInfo(plugin) {
    return plugin?.components?.map((component) => component.kind) ?? [];
}
function buildRemotePluginSyncPluginOptions(plugin) {
    const configuredOptions = plugin?.configuredOptions ?? {};
    if (Object.keys(configuredOptions).length === 0) {
        return undefined;
    }
    return {
        configuredOptions: { ...configuredOptions },
        userConfig: { ...(plugin?.userConfig ?? {}) },
    };
}
function applyPluginInfoToRemoteSyncCandidate(candidate, plugin) {
    const pluginOptions = buildRemotePluginSyncPluginOptions(plugin);
    return pluginOptions ? { ...candidate, pluginOptions } : candidate;
}
function enrichRemotePluginSyncCandidatesWithPluginInfo(candidates, plugins) {
    const pluginInfoById = new Map(plugins.map((plugin) => [plugin.id, plugin]));
    return candidates.map((candidate) => applyPluginInfoToRemoteSyncCandidate(candidate, pluginInfoById.get(candidate.pluginId)));
}
function summarizeLocalPluginOptionsForDisplay(pluginOptions) {
    if (!pluginOptions || Object.keys(pluginOptions.configuredOptions).length === 0) {
        return null;
    }
    let syncableCount = 0;
    let manualCount = 0;
    for (const [key, value] of Object.entries(pluginOptions.configuredOptions)) {
        const option = pluginOptions.userConfig[key];
        if (isPortablePluginOptionValue(value, option, option)) {
            syncableCount += 1;
        }
        else {
            manualCount += 1;
        }
    }
    return { manualCount, syncableCount };
}
function serializeMarketplaceSourceInput(marketplace) {
    const source = marketplace.source;
    const sourceKind = typeof source.source === "string" ? source.source : "";
    const refSuffix = typeof source.ref === "string" && source.ref.trim()
        ? `#${source.ref.trim()}`
        : "";
    if (sourceKind === "github" && typeof source.repo === "string" && source.repo.trim()) {
        return `${source.repo.trim()}${refSuffix}`;
    }
    if (sourceKind === "git" && typeof source.url === "string" && source.url.trim()) {
        return `${source.url.trim()}${refSuffix}`;
    }
    if (sourceKind === "url" && typeof source.url === "string" && source.url.trim()) {
        return source.url.trim();
    }
    return undefined;
}
function buildMarketplaceSourceSyncInfo(marketplace) {
    const sourceInput = serializeMarketplaceSourceInput(marketplace);
    if (sourceInput) {
        return { marketplaceSourceInput: sourceInput };
    }
    const sourceKind = typeof marketplace.source.source === "string" ? marketplace.source.source : "";
    if (["file", "directory", "settings"].includes(sourceKind)) {
        return {
            marketplaceSourceArchive: {
                marketplaceId: marketplace.id,
                source: marketplace.source,
            },
        };
    }
    return {};
}
async function loadRemotePluginSyncCandidates(params) {
    const localInlineResult = await params.localPluginSyncService.listLocalUserPluginCandidates();
    const inlineCandidates = localInlineResult.candidates.map(toInlineRemotePluginSyncCandidate);
    const remoteInlineResult = await params.remotePluginSyncService.listRemoteUserPluginStatuses({
        plugins: localInlineResult.candidates.map((candidate) => ({
            pluginId: candidate.pluginId,
            directoryName: candidate.directoryName,
        })),
    });
    const inlineStatuses = buildRemotePluginSyncRows(localInlineResult.candidates, remoteInlineResult.statuses).map((row) => ({
        candidateId: row.candidate.id,
        exists: row.exists,
        ...(row.path ? { path: row.path } : {}),
        ...(row.reason ? { reason: row.reason } : {}),
    }));
    if (!params.localZCodeAgentService || !params.remoteZCodeAgentService) {
        return { candidates: inlineCandidates, statuses: inlineStatuses };
    }
    const [localOverview, localPluginsResult, remoteOverview] = await Promise.all([
        params.localZCodeAgentService.getPluginsOverview({
            workspacePath: params.localWorkspacePath,
        }),
        params.localZCodeAgentService.listPlugins({
            workspacePath: params.localWorkspacePath,
        }),
        params.remoteZCodeAgentService.getPluginsOverview({
            workspacePath: params.remoteWorkspacePath,
            ...(params.remoteWorkspaceIdentity
                ? { workspaceIdentity: params.remoteWorkspaceIdentity }
                : {}),
        }),
    ]);
    const marketplaceCandidates = buildMarketplaceRemotePluginSyncCandidates(localOverview, localPluginsResult.plugins);
    return {
        candidates: [
            ...enrichRemotePluginSyncCandidatesWithPluginInfo(inlineCandidates, localPluginsResult.plugins),
            ...marketplaceCandidates,
        ],
        statuses: [
            ...inlineStatuses,
            ...buildMarketplaceRemotePluginStatuses(marketplaceCandidates, remoteOverview),
        ],
    };
}
function isRemotePluginSyncStoppedError(error) {
    return error instanceof RemotePluginSyncStoppedError;
}
function buildStoppedRemotePluginResult(row) {
    return {
        name: row.candidate.name,
        pluginId: row.candidate.pluginId,
        directoryName: row.candidate.kind === "inline"
            ? (row.candidate.inlineCandidate?.directoryName ?? row.candidate.name)
            : `${row.candidate.marketplace}/${row.candidate.name}`,
        status: "stopped",
        error: "stop requested; stopped waiting for this plugin sync. Any remote RPC that already started may still finish on the remote target.",
    };
}
function emitRemotePluginSyncProgress(params, row, status, log, result) {
    params.onItemProgress?.({
        candidateId: row.candidate.id,
        log,
        pluginId: row.candidate.pluginId,
        ...(result ? { result } : {}),
        status,
    });
}
function throwIfRemotePluginSyncStopped(params, row) {
    if (params.signal?.aborted || params.stopControl?.isStopped(row.candidate.id)) {
        throw new RemotePluginSyncStoppedError(row);
    }
}
async function awaitRemotePluginSyncStep(params, row, log, run, options = {}) {
    throwIfRemotePluginSyncStopped(params, row);
    const operationId = createRemotePluginSyncOperationId(row);
    emitRemotePluginSyncProgress(params, row, "syncing", `${log} (${operationId})`);
    const promise = run(operationId);
    const stopPromise = params.stopControl?.waitForStop?.(row.candidate.id);
    let removeAbortListener;
    const abortPromise = params.signal
        ? new Promise((resolve) => {
            if (params.signal?.aborted) {
                resolve();
                return;
            }
            const handleAbort = () => resolve();
            params.signal?.addEventListener("abort", handleAbort, { once: true });
            removeAbortListener = () => params.signal?.removeEventListener("abort", handleAbort);
        })
        : undefined;
    const interruptionPromises = [stopPromise, abortPromise].filter((candidate) => Boolean(candidate));
    if (interruptionPromises.length === 0) {
        return await promise;
    }
    try {
        return await Promise.race([
            promise,
            Promise.race(interruptionPromises).then(async () => {
                if (options.cancellableRemoteOperation === true &&
                    params.stopControl?.cancelOperation) {
                    emitRemotePluginSyncProgress(params, row, "stopped", `request cancel plugin sync operation ${operationId}`);
                    try {
                        await params.stopControl.cancelOperation(operationId);
                        emitRemotePluginSyncProgress(params, row, "stopped", `cancel request sent for ${operationId}`);
                    }
                    catch (error) {
                        emitRemotePluginSyncProgress(params, row, "stopped", `cancel request failed for ${operationId}: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
                throw new RemotePluginSyncStoppedError(row);
            }),
        ]);
    }
    finally {
        removeAbortListener?.();
    }
}
function isPathPluginOption(option) {
    return option?.type === "file" || option?.type === "directory";
}
function isPortablePluginOptionValue(value, localOption, remoteOption) {
    if (!localOption || !remoteOption) {
        return false;
    }
    if (localOption.sensitive === true || remoteOption.sensitive === true) {
        return false;
    }
    if (isPathPluginOption(localOption) || isPathPluginOption(remoteOption)) {
        return false;
    }
    const expectedType = remoteOption.type ?? localOption.type;
    if (expectedType === "boolean")
        return typeof value === "boolean";
    if (expectedType === "number")
        return typeof value === "number";
    if (expectedType === "string")
        return typeof value === "string";
    return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function buildPortablePluginOptionsSyncPlan(localOptions, remotePlugin) {
    const options = {};
    let skippedCount = 0;
    for (const [key, value] of Object.entries(localOptions.configuredOptions)) {
        if (isPortablePluginOptionValue(value, localOptions.userConfig[key], remotePlugin.userConfig?.[key])) {
            options[key] = value;
        }
        else {
            skippedCount += 1;
        }
    }
    return { options, skippedCount };
}
function arePluginOptionsEqual(left, right) {
    const leftEntries = Object.entries(left);
    if (leftEntries.length !== Object.keys(right).length) {
        return false;
    }
    return leftEntries.every(([key, value]) => right[key] === value);
}
async function syncPortablePluginOptions(params, row) {
    const localOptions = row.candidate.pluginOptions;
    if (!localOptions || Object.keys(localOptions.configuredOptions).length === 0) {
        return;
    }
    const remoteZCodeAgentService = params.remoteZCodeAgentService;
    if (!remoteZCodeAgentService) {
        emitRemotePluginSyncProgress(params, row, "syncing", "skip plugin options: remote plugin service is not available");
        return;
    }
    const workspace = {
        workspacePath: params.remoteWorkspacePath,
        ...(params.remoteWorkspaceIdentity
            ? { workspaceIdentity: params.remoteWorkspaceIdentity }
            : {}),
    };
    const remotePlugins = await awaitRemotePluginSyncStep(params, row, `RPC plugins/list for options ${row.candidate.pluginId}`, () => remoteZCodeAgentService.listPlugins(workspace));
    const remotePlugin = remotePlugins.plugins.find((plugin) => plugin.id === row.candidate.pluginId);
    if (!remotePlugin) {
        emitRemotePluginSyncProgress(params, row, "syncing", `skip plugin options: remote plugin schema not found for ${row.candidate.pluginId}`);
        return;
    }
    const plan = buildPortablePluginOptionsSyncPlan(localOptions, remotePlugin);
    if (plan.skippedCount > 0) {
        emitRemotePluginSyncProgress(params, row, "syncing", `skipped ${plan.skippedCount} non-portable plugin option(s)`);
    }
    const portableCount = Object.keys(plan.options).length;
    if (portableCount === 0) {
        emitRemotePluginSyncProgress(params, row, "syncing", "skip plugin options: no portable configured option values");
        return;
    }
    const mergedOptions = {
        ...(remotePlugin.configuredOptions ?? {}),
        ...plan.options,
    };
    if (arePluginOptionsEqual(remotePlugin.configuredOptions ?? {}, mergedOptions)) {
        emitRemotePluginSyncProgress(params, row, "syncing", `plugin options already synced (${portableCount} portable option(s))`);
        return;
    }
    await awaitRemotePluginSyncStep(params, row, `RPC plugins/configure ${portableCount} portable option(s) for ${row.candidate.pluginId}`, () => remoteZCodeAgentService.configurePlugin({
        ...workspace,
        options: mergedOptions,
        pluginId: row.candidate.pluginId,
        scope: REMOTE_PLUGIN_SYNC_CONFIG_SCOPE,
    }));
}
export async function syncSelectedRemotePlugins(params) {
    const results = [];
    for (const row of params.rows) {
        emitRemotePluginSyncProgress(params, row, "queued", "Queued plugin sync");
    }
    for (const row of params.rows) {
        if (row.candidate.kind !== "inline") {
            continue;
        }
        try {
            throwIfRemotePluginSyncStopped(params, row);
            const inlineCandidate = row.candidate.inlineCandidate;
            if (!inlineCandidate) {
                throw new Error("inline plugin metadata is not available");
            }
            const exported = await awaitRemotePluginSyncStep(params, row, `export inline plugin ${row.candidate.pluginId}`, () => params.localPluginSyncService.exportPluginsArchive({
                pluginIds: [inlineCandidate.id],
            }));
            const result = await awaitRemotePluginSyncStep(params, row, `import inline plugin ${row.candidate.pluginId} on remote`, () => params.remotePluginSyncService.importPluginsArchive({
                archive: exported.archive,
                overwrite: false,
            }));
            const item = result.results[0];
            if (!item) {
                throw new Error(`remote import did not return ${row.candidate.pluginId}`);
            }
            if (item.status === "synced") {
                await syncPortablePluginOptions(params, row);
            }
            results.push(item);
            emitRemotePluginSyncProgress(params, row, item.status, `inline plugin ${item.status}`, item);
        }
        catch (error) {
            const item = isRemotePluginSyncStoppedError(error)
                ? buildStoppedRemotePluginResult(row)
                : {
                    name: row.candidate.name,
                    pluginId: row.candidate.pluginId,
                    directoryName: row.candidate.inlineCandidate?.directoryName ?? row.candidate.name,
                    status: "failed",
                    error: error instanceof Error ? error.message : String(error),
                };
            results.push(item);
            emitRemotePluginSyncProgress(params, row, item.status, item.error ?? item.status, item);
        }
    }
    const selectedMarketplacePluginNames = buildSelectedMarketplacePluginNames(params.rows);
    const preparedMarketplaceSources = new Set();
    for (const row of params.rows) {
        if (row.candidate.kind !== "marketplace") {
            continue;
        }
        results.push(await syncMarketplaceRemotePlugin({
            ...params,
            preparedMarketplaceSources,
            selectedMarketplacePluginNames,
        }, row));
    }
    return { results };
}
async function syncMarketplaceRemotePlugin(params, row) {
    const candidate = row.candidate;
    const marketplacePlugin = candidate.marketplacePlugin;
    const directoryName = `${candidate.marketplace}/${candidate.name}`;
    try {
        throwIfRemotePluginSyncStopped(params, row);
        if (!params.remoteZCodeAgentService || !marketplacePlugin) {
            throw new Error("remote plugin install service is not available");
        }
        const remoteZCodeAgentService = params.remoteZCodeAgentService;
        const workspace = {
            workspacePath: params.remoteWorkspacePath,
            ...(params.remoteWorkspaceIdentity
                ? { workspaceIdentity: params.remoteWorkspaceIdentity }
                : {}),
        };
        if (!row.remoteMarketplaceExists &&
            !params.preparedMarketplaceSources.has(candidate.marketplace)) {
            await prepareRemoteMarketplaceSource({
                localPluginSyncService: params.localPluginSyncService,
                onItemProgress: params.onItemProgress,
                remotePluginSyncService: params.remotePluginSyncService,
                remoteZCodeAgentService,
                selectedMarketplacePluginNames: params.selectedMarketplacePluginNames,
                signal: params.signal,
                stopControl: params.stopControl,
            }, row, workspace);
            params.preparedMarketplaceSources.add(candidate.marketplace);
        }
        const installResult = await awaitRemotePluginSyncStep(params, row, `RPC plugins/install ${candidate.pluginId}`, (operationId) => remoteZCodeAgentService.installPlugin({
            ...workspace,
            marketplace: candidate.marketplace,
            operationId,
            pluginName: marketplacePlugin.pluginName,
            scope: REMOTE_PLUGIN_SYNC_CONFIG_SCOPE,
        }), { cancellableRemoteOperation: true });
        const installError = formatInstallError(installResult, candidate.pluginId);
        if (installError) {
            throw new Error(installError);
        }
        const installedPlugin = installResult.installedPlugins.find((plugin) => plugin.id === candidate.pluginId);
        if (!installedPlugin) {
            throw new Error(`remote install did not return ${candidate.pluginId}`);
        }
        await awaitRemotePluginSyncStep(params, row, `RPC plugins/setEnabled enabled=${String(candidate.enabled)} for ${candidate.pluginId}`, () => remoteZCodeAgentService.setPluginEnabled({
            ...workspace,
            enabled: candidate.enabled,
            pluginId: candidate.pluginId,
            scope: REMOTE_PLUGIN_SYNC_CONFIG_SCOPE,
        }));
        await syncPortablePluginOptions(params, row);
        const result = {
            name: candidate.name,
            pluginId: candidate.pluginId,
            directoryName,
            status: "synced",
            ...(installedPlugin.installPath ? { path: installedPlugin.installPath } : {}),
        };
        emitRemotePluginSyncProgress(params, row, "synced", "marketplace plugin synced", result);
        return result;
    }
    catch (error) {
        const result = isRemotePluginSyncStoppedError(error)
            ? buildStoppedRemotePluginResult(row)
            : {
                name: candidate.name,
                pluginId: candidate.pluginId,
                directoryName,
                status: "failed",
                error: error instanceof Error ? error.message : String(error),
            };
        emitRemotePluginSyncProgress(params, row, result.status, result.error ?? result.status, result);
        return result;
    }
}
function buildSelectedMarketplacePluginNames(rows) {
    const result = new Map();
    for (const row of rows) {
        const marketplacePlugin = row.candidate.marketplacePlugin;
        if (row.candidate.kind !== "marketplace" || !marketplacePlugin) {
            continue;
        }
        const names = result.get(row.candidate.marketplace) ?? [];
        names.push(marketplacePlugin.pluginName);
        result.set(row.candidate.marketplace, names);
    }
    return result;
}
async function prepareRemoteMarketplaceSource(params, row, workspace) {
    const candidate = row.candidate;
    const marketplacePlugin = candidate.marketplacePlugin;
    if (!marketplacePlugin) {
        throw new Error("marketplace plugin metadata is not available");
    }
    const marketplaceSourceInput = marketplacePlugin.marketplaceSourceInput;
    if (marketplaceSourceInput) {
        await awaitRemotePluginSyncStep(params, row, `RPC plugins/marketplace/add ${candidate.marketplace} from ${marketplaceSourceInput}`, (operationId) => params.remoteZCodeAgentService.addPluginMarketplace({
            ...workspace,
            operationId,
            source: marketplaceSourceInput,
        }), { cancellableRemoteOperation: true });
        return;
    }
    const marketplaceSourceArchive = marketplacePlugin.marketplaceSourceArchive;
    if (!marketplaceSourceArchive) {
        throw new Error(`marketplace source cannot be synchronized: ${candidate.marketplace}`);
    }
    const exported = await awaitRemotePluginSyncStep(params, row, `export marketplace source ${candidate.marketplace}`, () => params.localPluginSyncService.exportMarketplaceSourceArchive({
        marketplaceId: marketplaceSourceArchive.marketplaceId,
        pluginNames: params.selectedMarketplacePluginNames.get(candidate.marketplace) ?? [
            marketplacePlugin.pluginName,
        ],
        source: marketplaceSourceArchive.source,
    }));
    const imported = await awaitRemotePluginSyncStep(params, row, `import marketplace source ${candidate.marketplace} on remote`, () => params.remotePluginSyncService.importMarketplaceSourceArchive({
        archive: exported.archive,
        overwrite: false,
    }));
    await awaitRemotePluginSyncStep(params, row, `RPC plugins/marketplace/add mirrored ${candidate.marketplace} from ${imported.path}`, (operationId) => params.remoteZCodeAgentService.addPluginMarketplace({
        ...workspace,
        operationId,
        source: imported.path,
    }), { cancellableRemoteOperation: true });
}
function formatInstallError(result, pluginId) {
    const diagnostics = result.diagnostics.filter((diagnostic) => diagnostic.severity !== "warning");
    if (diagnostics.length === 0) {
        return null;
    }
    return diagnostics
        .map((diagnostic) => {
        const target = diagnostic.pluginId ?? pluginId;
        return `${target}: ${diagnostic.message}`;
    })
        .join("; ");
}
function RemotePluginSyncTitle() {
    const { intl } = useZCodeIntl();
    const [warningTooltipOpen, setWarningTooltipOpen] = useState(false);
    const warningTitle = intl.formatMessage({
        id: "settings.plugins.remoteSync.warningTitle",
    });
    return (_jsxs(DialogTitle, { className: "flex min-w-0 items-center gap-2 pr-8", children: [_jsx("span", { className: "min-w-0 truncate", children: intl.formatMessage({ id: "settings.plugins.remoteSync.title" }) }), _jsx(ControlHintTooltip, { open: warningTooltipOpen, title: warningTitle, description: intl.formatMessage({
                    id: "settings.plugins.remoteSync.warningDescription",
                }), side: "right", align: "center", children: _jsx("span", { "aria-label": warningTitle, className: "inline-flex size-5 items-center justify-center rounded-full text-warning transition-colors hover:bg-hover hover:text-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", onMouseEnter: () => setWarningTooltipOpen(true), onMouseLeave: () => setWarningTooltipOpen(false), role: "img", children: _jsx(AlertCircleIcon, { className: "size-3.5", "aria-hidden": "true" }) }) })] }));
}
function RemotePluginSyncExistingFilterCheckbox({ checked, onCheckedChange, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("label", { className: "inline-flex h-6 cursor-pointer items-center gap-2 rounded-md px-1 text-ui-base text-foreground-subtle hover:text-foreground", children: [_jsx("input", { type: "checkbox", className: "size-4", checked: checked, onChange: (event) => onCheckedChange(event.currentTarget.checked) }), _jsx("span", { children: intl.formatMessage({ id: "settings.plugins.remoteSync.showExisting" }) })] }));
}
function RemotePluginSyncTargetRow({ targetLabel, showExistingRemotePlugins, showExistingFilter, onShowExistingRemotePluginsChange, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [_jsx("p", { className: "min-w-0 break-words font-mono text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.remoteSync.target" }, { target: targetLabel }) }), showExistingFilter ? (_jsx("div", { className: "shrink-0", children: _jsx(RemotePluginSyncExistingFilterCheckbox, { checked: showExistingRemotePlugins, onCheckedChange: onShowExistingRemotePluginsChange }) })) : null] }));
}
function RemotePluginSyncBulkSelectionCheckbox({ selectedCount, totalSelectable, onSelectAll, onClearAll, }) {
    const { intl } = useZCodeIntl();
    const inputRef = useRef(null);
    const disabled = totalSelectable === 0;
    const checked = totalSelectable > 0 && selectedCount >= totalSelectable;
    const indeterminate = totalSelectable > 0 && selectedCount > 0 && selectedCount < totalSelectable;
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);
    return (_jsxs("label", { className: `inline-flex h-6 items-center gap-2 rounded-md px-1 text-ui-base text-foreground-subtle ${disabled ? "opacity-50" : "cursor-pointer hover:text-foreground"}`, children: [_jsx("input", { ref: inputRef, type: "checkbox", className: "size-4", checked: checked, disabled: disabled, "aria-checked": indeterminate ? "mixed" : checked ? "true" : "false", onChange: (event) => {
                    if (event.currentTarget.checked) {
                        onSelectAll();
                    }
                    else {
                        onClearAll();
                    }
                } }), _jsx("span", { children: intl.formatMessage({ id: "settings.plugins.remoteSync.selectAll" }) })] }));
}
function RemotePluginSyncSelectionList({ rows, selectedIds, emptyMessageId = "settings.plugins.remoteSync.empty", onToggle, }) {
    const { intl } = useZCodeIntl();
    if (rows.length === 0) {
        return (_jsx("div", { className: "rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: emptyMessageId }) }));
    }
    return (_jsx("div", { className: "grid gap-2", children: rows.map((row) => {
            const checkboxId = `remote-plugin-sync-${row.candidate.id}`;
            const labelId = `${checkboxId}-label`;
            const selected = !row.exists && selectedIds.has(row.candidate.id);
            const optionSummary = summarizeLocalPluginOptionsForDisplay(row.candidate.pluginOptions);
            return (_jsxs("label", { htmlFor: checkboxId, className: `grid grid-cols-[auto_auto_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-ui-base ${row.exists
                    ? "cursor-default"
                    : "cursor-pointer hover:border-border-hover hover:bg-surface-hover"}`, children: [_jsx("input", { id: checkboxId, type: "checkbox", "aria-labelledby": labelId, className: "mt-1 size-4", checked: selected, disabled: row.exists, onChange: (event) => onToggle(row.candidate.id, event.currentTarget.checked) }), _jsx("span", { className: "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-foreground-subtle", "aria-hidden": "true", children: _jsx(Cable, { className: "size-4" }) }), _jsxs("span", { className: "min-w-0", children: [_jsxs("span", { className: "flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1", children: [_jsx("span", { id: labelId, className: "font-medium text-foreground", children: row.candidate.name }), row.candidate.version ? (_jsx("span", { className: "rounded-md bg-secondary px-1.5 py-0.5 text-ui-xs font-medium text-foreground-subtle", children: row.candidate.version })) : null, row.candidate.componentTypes.map((type) => (_jsx("span", { className: "rounded-md bg-secondary px-1.5 py-0.5 text-ui-xs font-medium text-foreground-subtle", children: type }, type))), _jsx("span", { className: "rounded-md bg-secondary px-1.5 py-0.5 text-ui-xs font-medium text-foreground-subtle", children: row.candidate.kind === "inline"
                                            ? "inline"
                                            : row.candidate.marketplace }), row.exists ? (_jsx("span", { className: "text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: "settings.plugins.remoteSync.existing" }) })) : null] }), row.candidate.description ? (_jsx("span", { className: "mt-1 block text-ui-base text-foreground-subtle", children: row.candidate.description })) : null, row.candidate.path ? (_jsx("span", { className: "mt-1 block break-all font-mono text-ui-base text-foreground-subtlest", children: row.candidate.path })) : null, optionSummary ? (_jsx("span", { className: "mt-1 block text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.remoteSync.optionsSummary" }, {
                                    manual: String(optionSummary.manualCount),
                                    syncable: String(optionSummary.syncableCount),
                                }) })) : null] })] }, row.candidate.id));
        }) }));
}
function RemotePluginSyncStatusBadge({ status, }) {
    const { intl } = useZCodeIntl();
    const label = intl.formatMessage({ id: `settings.plugins.remoteSync.${status}` });
    const icon = status === "synced" ? (_jsx(CheckCircle2, { className: "size-3", "aria-hidden": "true" })) : status === "failed" ? (_jsx(CircleX, { className: "size-3", "aria-hidden": "true" })) : status === "stopped" ? (_jsx(CircleStop, { className: "size-3", "aria-hidden": "true" })) : null;
    return (_jsxs("span", { className: cn("inline-flex h-6 shrink-0 items-center gap-1 rounded-md border px-2 text-ui-xs font-medium", status === "synced" &&
            "border-success/30 bg-success/10 text-success dark:bg-success/14", status === "failed" &&
            "border-destructive/30 bg-destructive/10 text-destructive", status === "stopped" &&
            "border-warning/30 bg-warning/10 text-warning", status === "skipped" &&
            "border-border bg-secondary text-foreground-subtle", (status === "queued" || status === "syncing") &&
            "border-border bg-secondary text-foreground-subtle"), children: [icon, label] }));
}
function RemotePluginSyncLogHoverCard({ logs, }) {
    const { intl } = useZCodeIntl();
    const shownLogs = logs.length > 0 ? logs : ["Queued plugin sync"];
    return (_jsxs(HoverCard, { closeDelay: 160, openDelay: 120, children: [_jsx(HoverCardTrigger, { asChild: true, children: _jsx("span", { "aria-label": intl.formatMessage({ id: "settings.plugins.remoteSync.logTooltip" }), className: "inline-flex size-6 cursor-help items-center justify-center rounded-md text-foreground-subtle hover:bg-hover hover:text-foreground", role: "img", children: _jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" }) }) }), _jsxs(HoverCardContent, { align: "end", side: "left", sideOffset: 6, className: "flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 bg-popover p-3 text-left", children: [_jsx("div", { className: "text-ui-base font-medium text-popover-foreground", children: intl.formatMessage({ id: "settings.plugins.remoteSync.logTooltip" }) }), _jsx("pre", { className: "max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-md bg-secondary p-2 font-mono text-ui-xs/relaxed text-popover-foreground", children: shownLogs.join("\n") })] })] }));
}
function RemotePluginSyncProgressList({ progressById, rows, onStop, }) {
    const { intl } = useZCodeIntl();
    if (rows.length === 0) {
        return (_jsx("div", { className: "rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.remoteSync.resultEmpty" }) }));
    }
    return (_jsx("div", { className: "grid gap-2", children: rows.map((row) => {
            const progress = progressById.get(row.candidate.id) ?? {
                logs: ["Queued plugin sync"],
                status: "queued",
            };
            const optionSummary = summarizeLocalPluginOptionsForDisplay(row.candidate.pluginOptions);
            const canStop = progress.status === "queued" || progress.status === "syncing";
            return (_jsxs("div", { className: "grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-ui-base", children: [_jsx("span", { className: "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-foreground-subtle", "aria-hidden": "true", children: _jsx(Cable, { className: "size-4" }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1", children: [_jsx("span", { className: "font-medium text-foreground", children: row.candidate.name }), row.candidate.version ? (_jsx("span", { className: "rounded-md bg-secondary px-1.5 py-0.5 text-ui-xs font-medium text-foreground-subtle", children: row.candidate.version })) : null, row.candidate.componentTypes.map((type) => (_jsx("span", { className: "rounded-md bg-secondary px-1.5 py-0.5 text-ui-xs font-medium text-foreground-subtle", children: type }, type))), _jsx("span", { className: "rounded-md bg-secondary px-1.5 py-0.5 text-ui-xs font-medium text-foreground-subtle", children: row.candidate.kind === "inline"
                                            ? "inline"
                                            : row.candidate.marketplace })] }), progress.result?.error ? (_jsx("div", { className: "mt-1 break-words text-ui-base text-destructive", children: progress.result.error })) : row.candidate.path ? (_jsx("div", { className: "mt-1 break-all font-mono text-ui-base text-foreground-subtlest", children: row.candidate.path })) : null, optionSummary && !progress.result?.error ? (_jsx("div", { className: "mt-1 text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.remoteSync.optionsSummary" }, {
                                    manual: String(optionSummary.manualCount),
                                    syncable: String(optionSummary.syncableCount),
                                }) })) : null] }), _jsxs("div", { className: "flex shrink-0 items-start gap-1", children: [progress.status === "syncing" ? (_jsx(RemotePluginSyncLogHoverCard, { logs: progress.logs })) : null, _jsx(RemotePluginSyncStatusBadge, { status: progress.status }), canStop ? (_jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "settings.plugins.remoteSync.stop" }), side: "left", children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({
                                        id: "settings.plugins.remoteSync.stop",
                                    }), className: "text-foreground-subtle hover:text-warning", onClick: () => onStop(row.candidate.id), children: _jsx(CircleStop, { className: "size-3.5", "aria-hidden": "true" }) }) })) : null] })] }, row.candidate.id));
        }) }));
}
function RemotePluginSyncResultList({ result, }) {
    const { intl } = useZCodeIntl();
    const items = result?.results ?? [];
    if (items.length === 0) {
        return (_jsx("div", { className: "rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.remoteSync.resultEmpty" }) }));
    }
    return (_jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: _jsx("div", { className: "divide-y divide-border", children: items.map((item) => (_jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "truncate text-ui-base font-medium text-foreground", children: item.name }), item.error ? (_jsx("div", { className: "mt-0.5 break-words text-ui-base text-destructive", children: item.error })) : item.path ? (_jsx("div", { className: "mt-0.5 truncate font-mono text-ui-xs text-foreground-subtlest", children: item.path })) : null] }), _jsx(RemotePluginSyncStatusBadge, { status: item.status })] }, `${item.pluginId}-${item.directoryName}-${item.status}`))) }) }));
}
export function RemotePluginSyncDialog(props) {
    const { intl } = useZCodeIntl();
    const { localPluginSyncService, localWorkspacePath, localZCodeAgentService, onOpenChange, onSynced, open, remotePluginSyncService, remoteZCodeAgentService, remoteTarget, workspacePath, workspaceIdentity, } = props;
    const [step, setStep] = useState("loading");
    const [rows, setRows] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [showExistingRemotePlugins, setShowExistingRemotePlugins] = useState(true);
    const [importResult, setImportResult] = useState(null);
    const [syncProgressById, setSyncProgressById] = useState(new Map());
    const [syncRows, setSyncRows] = useState([]);
    const [error, setError] = useState(null);
    const stopRequestedRef = useRef(new Set());
    const stopWaitersRef = useRef(new Map());
    const syncInFlightRef = useRef(false);
    const syncAbortControllerRef = useRef(null);
    useEffect(() => {
        if (!open) {
            return;
        }
        let cancelled = false;
        setStep("loading");
        setRows([]);
        setSelectedIds(new Set());
        setShowExistingRemotePlugins(true);
        setImportResult(null);
        setSyncProgressById(new Map());
        setSyncRows([]);
        setError(null);
        syncAbortControllerRef.current?.abort();
        syncAbortControllerRef.current = null;
        stopRequestedRef.current = new Set();
        stopWaitersRef.current = new Map();
        syncInFlightRef.current = false;
        void (async () => {
            try {
                const { candidates, statuses } = await loadRemotePluginSyncCandidates({
                    localPluginSyncService,
                    localWorkspacePath: localWorkspacePath ?? workspacePath,
                    localZCodeAgentService,
                    remotePluginSyncService,
                    remoteWorkspaceIdentity: workspaceIdentity,
                    remoteWorkspacePath: workspacePath,
                    remoteZCodeAgentService,
                });
                if (cancelled) {
                    return;
                }
                const nextRows = buildRemotePluginSyncRowsForCandidates(candidates, statuses);
                setRows(nextRows);
                setSelectedIds(resolveDefaultRemotePluginSyncSelection(nextRows));
                setStep("selection");
            }
            catch (loadError) {
                if (cancelled) {
                    return;
                }
                setError(loadError instanceof Error ? loadError.message : String(loadError));
                setStep("selection");
            }
        })();
        return () => {
            cancelled = true;
            // 远端目标失效会直接卸载 Dialog，绕过“同步中禁止关闭”的交互保护。
            // 主动终止当前 run，避免旧目标上的后续步骤和结果继续落回已失效的 UI。
            syncAbortControllerRef.current?.abort();
            syncAbortControllerRef.current = null;
        };
    }, [
        localPluginSyncService,
        localWorkspacePath,
        localZCodeAgentService,
        open,
        remotePluginSyncService,
        remoteZCodeAgentService,
        workspaceIdentity,
        workspacePath,
    ]);
    const visibleRows = useMemo(() => filterRemotePluginSyncRows(rows, showExistingRemotePlugins), [rows, showExistingRemotePlugins]);
    const visibleMissingIds = useMemo(() => visibleRows.filter((row) => !row.exists).map((row) => row.candidate.id), [visibleRows]);
    const selectedSyncIds = useMemo(() => visibleMissingIds.filter((id) => selectedIds.has(id)), [selectedIds, visibleMissingIds]);
    const selectedCount = selectedSyncIds.length;
    const targetLabel = formatRemoteSkillSyncTarget(remoteTarget, workspacePath);
    const handleOpenChange = (nextOpen) => {
        // plugin 同步是逐项远端 RPC；同步中关闭弹窗会让下次打开时重置为 loading/0 项，
        // 但后台 RPC 仍在跑。同步中只拦截关闭请求，避免丢失进度状态。
        if (!shouldAllowRemotePluginSyncDialogOpenChange(step, nextOpen)) {
            return;
        }
        onOpenChange(nextOpen);
    };
    const togglePlugin = (pluginId, checked) => {
        setSelectedIds((current) => {
            const next = new Set(current);
            if (checked) {
                next.add(pluginId);
            }
            else {
                next.delete(pluginId);
            }
            return next;
        });
    };
    const stopPluginSync = (candidateId) => {
        stopRequestedRef.current.add(candidateId);
        stopWaitersRef.current.get(candidateId)?.();
        // 远端 marketplace install/add 会占用插件存储锁；只在远程同步生成的
        // operationId 上发送取消，避免误伤本地插件页的常规安装、启停和市场管理操作。
        setSyncProgressById((current) => {
            const next = new Map(current);
            const previous = next.get(candidateId) ?? { logs: [], status: "queued" };
            next.set(candidateId, {
                ...previous,
                logs: [
                    ...previous.logs,
                    "stop requested; cancelling the active remote plugin operation when possible",
                ],
                status: "stopped",
            });
            return next;
        });
    };
    const syncSelected = async () => {
        if (!shouldStartRemoteSyncOperation({
            inFlight: syncInFlightRef.current,
            selectedCount: selectedSyncIds.length,
        })) {
            if (selectedSyncIds.length === 0) {
                setError(intl.formatMessage({ id: "settings.plugins.remoteSync.noSelection" }));
            }
            return;
        }
        syncInFlightRef.current = true;
        const syncAbortController = new AbortController();
        syncAbortControllerRef.current?.abort();
        syncAbortControllerRef.current = syncAbortController;
        const finishSyncRun = () => {
            if (!shouldFinishRemotePluginSyncRun(syncAbortControllerRef.current, syncAbortController)) {
                return;
            }
            syncAbortControllerRef.current = null;
            syncInFlightRef.current = false;
        };
        setError(null);
        setStep("preflighting");
        const selectedRows = rows.filter((row) => !row.exists && selectedIds.has(row.candidate.id));
        try {
            const access = await runRemoteSyncPreflightWithTimeout(() => remotePluginSyncService.checkRemoteUserPluginWriteAccess());
            if (!access.ok) {
                throw new Error(intl.formatMessage({ id: "settings.remoteSync.preflightFailed" }, { path: access.path, error: access.error ?? "" }));
            }
        }
        catch (syncError) {
            if (syncAbortController.signal.aborted) {
                finishSyncRun();
                return;
            }
            setError(isRemoteSyncPreflightTimeoutError(syncError)
                ? intl.formatMessage({ id: "settings.remoteSync.preflightTimeout" }, { seconds: String(Math.ceil(syncError.timeoutMs / 1000)) })
                : syncError instanceof Error
                    ? syncError.message
                    : String(syncError));
            setStep("selection");
            finishSyncRun();
            return;
        }
        if (syncAbortController.signal.aborted) {
            finishSyncRun();
            return;
        }
        setStep("syncing");
        setSyncRows(selectedRows);
        setSyncProgressById(new Map(selectedRows.map((row) => [
            row.candidate.id,
            {
                logs: ["Queued plugin sync"],
                status: "queued",
            },
        ])));
        stopRequestedRef.current = new Set();
        stopWaitersRef.current = new Map();
        try {
            const result = await syncSelectedRemotePlugins({
                localPluginSyncService,
                onItemProgress: (event) => {
                    if (syncAbortController.signal.aborted) {
                        return;
                    }
                    setSyncProgressById((current) => {
                        const next = new Map(current);
                        const previous = next.get(event.candidateId) ?? {
                            logs: [],
                            status: "queued",
                        };
                        next.set(event.candidateId, {
                            logs: [...previous.logs, event.log],
                            ...(event.result
                                ? { result: event.result }
                                : previous.result
                                    ? { result: previous.result }
                                    : {}),
                            status: event.status,
                        });
                        return next;
                    });
                },
                remotePluginSyncService,
                remoteWorkspaceIdentity: workspaceIdentity,
                remoteWorkspacePath: workspacePath,
                remoteZCodeAgentService,
                rows: selectedRows,
                signal: syncAbortController.signal,
                stopControl: {
                    cancelOperation: async (operationId) => {
                        if (!remoteZCodeAgentService?.cancelPluginOperation) {
                            return;
                        }
                        await remoteZCodeAgentService.cancelPluginOperation({ operationId });
                    },
                    isStopped: (candidateId) => stopRequestedRef.current.has(candidateId),
                    waitForStop: (candidateId) => {
                        if (stopRequestedRef.current.has(candidateId)) {
                            return Promise.resolve();
                        }
                        return new Promise((resolve) => {
                            stopWaitersRef.current.set(candidateId, resolve);
                        });
                    },
                },
            });
            if (syncAbortController.signal.aborted) {
                return;
            }
            await onSynced();
            if (syncAbortController.signal.aborted) {
                return;
            }
            setImportResult(result);
            setStep("complete");
        }
        catch (syncError) {
            if (syncAbortController.signal.aborted) {
                return;
            }
            setError(syncError instanceof Error ? syncError.message : String(syncError));
            setStep("selection");
        }
        finally {
            finishSyncRun();
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: handleOpenChange, children: _jsxs(DialogContent, { showCloseButton: step !== "preflighting" && step !== "syncing", className: "h-[min(720px,calc(100dvh-2rem))] max-h-[min(720px,calc(100dvh-2rem))] max-w-2xl flex flex-col overflow-hidden", children: [_jsxs(DialogHeader, { children: [_jsx(RemotePluginSyncTitle, {}), _jsx(RemotePluginSyncTargetRow, { targetLabel: targetLabel, showExistingRemotePlugins: showExistingRemotePlugins, showExistingFilter: step === "selection" && rows.length > 0, onShowExistingRemotePluginsChange: setShowExistingRemotePlugins })] }), _jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto", children: [error ? (_jsx("div", { className: "mb-3 rounded-lg border border-destructive/40 bg-surface px-3 py-2 text-ui-base text-destructive", children: error })) : null, step === "loading" ? (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground-subtle", children: [_jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.plugins.remoteSync.loading" })] })) : null, step === "preflighting" ? (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground-subtle", children: [_jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.remoteSync.preflighting" })] })) : null, step === "selection" ? (_jsx(RemotePluginSyncSelectionList, { rows: visibleRows, selectedIds: selectedIds, emptyMessageId: rows.length > 0
                                ? "settings.plugins.remoteSync.filteredEmpty"
                                : undefined, onToggle: togglePlugin })) : null, step === "syncing" ? (_jsx(RemotePluginSyncProgressList, { progressById: syncProgressById, rows: syncRows, onStop: stopPluginSync })) : null, step === "complete" ? (_jsx(RemotePluginSyncResultList, { result: importResult })) : null] }), _jsxs("div", { className: "flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsx("div", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.remoteSync.selectionCount" }, { selected: String(selectedCount), total: String(visibleMissingIds.length) }) }), _jsxs("div", { className: "flex flex-wrap justify-end gap-2", children: [step === "selection" ? (_jsx(RemotePluginSyncBulkSelectionCheckbox, { selectedCount: selectedCount, totalSelectable: visibleMissingIds.length, onSelectAll: () => setSelectedIds(new Set(visibleMissingIds)), onClearAll: () => setSelectedIds(new Set()) })) : null, _jsxs(Button, { type: "button", size: "sm", disabled: step !== "selection" || selectedCount === 0, onClick: syncSelected, children: [_jsx(UploadCloud, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.plugins.remoteSync.start" })] })] })] })] }) }));
}
//# sourceMappingURL=RemotePluginSyncDialog.js.map