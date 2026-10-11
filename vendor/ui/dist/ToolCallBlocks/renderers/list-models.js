import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Cpu } from "lucide-react";
import { useCallback, useMemo } from "react";
import { getModelProviderFamilySpec, resolveModelProviderFamilyIdByProviderId, } from "@zcode/shared";
import { thoughtLevelLabelId } from "@/chat-input-toolbar/thoughtLevelOptions.js";
import { useWorkflowSubagentModelProviderName } from "@/hooks/useWorkflowSubagentModelProviderName.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ToolSnapshotFieldNotice } from "@/ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { FallbackToolCallBlock } from "@/ToolCallBlocks/renderers/fallback.js";
import { readToolResultDisplay } from "@/ToolCallBlocks/toolResultDisplay.js";
import { ToolLayout } from "../ToolLayout.js";
const LIST_MODELS_TOOL_ICON = _jsx(Cpu, { className: "size-4 shrink-0 text-foreground-subtle" });
function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readTrimmedString(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
function readStringArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.filter((entry) => typeof entry === "string");
}
function parseJsonCandidate(value) {
    if (typeof value !== "string") {
        return value;
    }
    const trimmed = value.trim();
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
        return undefined;
    }
    try {
        return JSON.parse(trimmed);
    }
    catch {
        return undefined;
    }
}
function readResultRecord(value) {
    const normalized = parseJsonCandidate(value);
    if (!isPlainRecord(normalized) || !Array.isArray(normalized.models)) {
        return null;
    }
    const models = [];
    for (const entry of normalized.models) {
        if (!isPlainRecord(entry)) {
            continue;
        }
        const id = readTrimmedString(entry.id);
        const providerId = readTrimmedString(entry.providerId);
        const modelId = readTrimmedString(entry.modelId);
        if (id === undefined || providerId === undefined || modelId === undefined) {
            continue;
        }
        models.push({
            id,
            providerId,
            modelId,
            providerLabel: readTrimmedString(entry.providerLabel),
            reasoningLevels: readStringArray(entry.reasoningLevels),
            defaultReasoningLevel: readTrimmedString(entry.defaultReasoningLevel),
            contextWindow: typeof entry.contextWindow === "number" ? entry.contextWindow : undefined,
            disabledReason: readTrimmedString(entry.disabledReason),
        });
    }
    return {
        current: readTrimmedString(normalized.current),
        models,
        truncated: normalized.truncated === true,
    };
}
/**
 * 结果读取顺序与 list-saved-workflows 同一条：**display 通道优先**（`list_models` kind——
 * v4 wire 上 output.text 是 formatModelContent 的 `<models>` 投影，下面的 JSON 探针对它永不
 * 命中，正是今天掉进 raw 兜底卡的根因）；legacy JSON 探针兜老会话与非 v4 宿主。一个都读不
 * 出来就回 null——「这台机器没有模型」与「读不懂这次结果」必须可分辨。
 */
export function readListModelsResult(toolCall) {
    const display = readToolResultDisplay(toolCall.raw);
    if (display?.kind === "list_models") {
        return {
            current: display.current,
            models: display.models.map((model) => ({
                id: model.id,
                providerId: model.providerId,
                modelId: model.modelId,
                providerLabel: model.providerLabel,
                reasoningLevels: [...model.reasoningLevels],
                defaultReasoningLevel: model.defaultReasoningLevel,
                contextWindow: model.contextWindow,
                disabledReason: model.disabledReason,
            })),
            truncated: display.truncated === true,
        };
    }
    const raw = isPlainRecord(toolCall.raw) ? toolCall.raw : null;
    for (const candidate of [toolCall.output, raw?.rawOutput, raw?.output, raw?.result]) {
        const result = readResultRecord(candidate);
        if (result) {
            return result;
        }
    }
    return null;
}
/**
 * 组名 = provider 的**名字**，与模型菜单同一条规则（subagent-model-label.ts 的同款纪律）：
 * 内置家族取家族名；否则取载荷里的 providerLabel；否则取会话模型清单里的名字；都没有就用
 * 「模型供应商」这个词本身。**永远不回 providerId**——团队套餐的它是一个 UUID，摆上屏幕
 * 等于让用户先跳过 36 个字符才看见模型名。
 */
function listModelsGroupName(providerId, providerLabel, providerName, formatMessage) {
    const familyId = resolveModelProviderFamilyIdByProviderId(providerId);
    if (familyId !== null) {
        return getModelProviderFamilySpec(familyId).label;
    }
    const label = providerLabel?.trim();
    if (label !== undefined && label.length > 0 && label !== providerId) {
        return label;
    }
    // 会话清单查不到时会退回 providerId 本身（zcodeSessionSettingsToConfigOptions），当作没查到。
    const resolved = providerName?.(providerId)?.trim();
    if (resolved !== undefined && resolved.length > 0 && resolved !== providerId) {
        return resolved;
    }
    return formatMessage({ id: "chat.toolCall.workflow.models.provider" });
}
/**
 * 上下文窗口的读法：千位以下原样，百万以下取整到 K，再往上到 M 且只在有小数时留一位
 * （`1M` / `1.5M`）。这一列是给人扫一眼比大小的，不是给人核对精确 token 数的。
 */
export function formatContextWindow(contextWindow) {
    if (contextWindow < 1_000) {
        return String(contextWindow);
    }
    if (contextWindow < 1_000_000) {
        return `${Math.round(contextWindow / 1_000)}K`;
    }
    const millions = contextWindow / 1_000_000;
    return Number.isInteger(millions) ? `${millions}M` : `${millions.toFixed(1)}M`;
}
function levelWord(level, formatMessage) {
    // 档位词与思考控件同一张表；表里没有的值原样显示（provider 自定义的档位名）。
    const labelId = thoughtLevelLabelId(level);
    return labelId === undefined ? level : formatMessage({ id: labelId });
}
/**
 * 行的 tooltip：第一行是思考强度档位（没有档位就说没有），换行后是规范 id。规范 id 是给
 * 机器回填 `subagent_model` 用的，它只该住在这里（subagent-model-label.ts 的同款分工）。
 */
function listModelsRowTooltip(model, formatMessage) {
    let levelsLine;
    if (model.reasoningLevels.length === 0) {
        levelsLine = formatMessage({ id: "chat.toolCall.workflow.models.noLevels" });
    }
    else {
        const levels = model.reasoningLevels
            .map((level) => levelWord(level, formatMessage))
            .join(" · ");
        levelsLine =
            model.defaultReasoningLevel === undefined
                ? formatMessage({ id: "chat.toolCall.workflow.models.levelsNoDefault" }, { levels })
                : formatMessage({ id: "chat.toolCall.workflow.models.levels" }, { default: levelWord(model.defaultReasoningLevel, formatMessage), levels });
    }
    return `${levelsLine}\n${model.id}`;
}
/** 按 providerId 分组，保持首次出现的顺序——目录的顺序是宿主注册表的顺序，卡不重排。 */
function groupModelsByProvider(models) {
    const groups = [];
    const byProviderId = new Map();
    for (const model of models) {
        let group = byProviderId.get(model.providerId);
        if (group === undefined) {
            group = { providerId: model.providerId, models: [] };
            byProviderId.set(model.providerId, group);
            groups.push(group);
        }
        group.models.push(model);
    }
    return groups;
}
/**
 * ListModels 的聊天卡。
 *
 * 为什么值得一个专用 renderer：这个工具名不在 shared 的已知工具表里，通用路径是
 * `FallbackToolCallBlock`，它会把模型面的 `<models>` 文本原样摊开——那段文本每行都以
 * providerId 开头（可能是 UUID 等长标识），「当前」藏在行尾方括号里。
 *
 * 卡只回答三件事：有哪些、来自哪里、哪个是当前。每行的档位表与规范 id 归 tooltip；
 * providerId 一个字符都不上屏。
 */
export function ListModelsToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall } = context.toolCallNode;
    const providerName = useWorkflowSubagentModelProviderName(context.workspacePath);
    const result = useMemo(() => readListModelsResult(toolCall), [toolCall]);
    const kindLabel = intl.formatMessage({
        id: context.isRunning
            ? "chat.toolCall.workflow.models.listing"
            : "chat.toolCall.workflow.models.listed",
    });
    const emptyLabel = intl.formatMessage({ id: "chat.toolCall.workflow.models.empty" });
    const currentLabel = intl.formatMessage({ id: "chat.toolCall.workflow.models.current" });
    const truncatedLabel = intl.formatMessage({ id: "chat.toolCall.workflow.models.truncated" });
    const modelCount = result?.models.length ?? 0;
    // 轻量 intl 没有 ICU 复数，单复数各用独立 message key（同 workflow.list.count 的先例）。
    const countLabel = intl.formatMessage({
        id: modelCount === 1
            ? "chat.toolCall.workflow.models.countOne"
            : "chat.toolCall.workflow.models.count",
    }, { count: modelCount });
    const groups = useMemo(() => (result === null ? [] : groupModelsByProvider(result.models)), [result]);
    // ToolLayout 是 memo 组件：内联 JSX prop 每次渲染都是新引用，会让记忆化失效。
    const primaryText = useMemo(() => (_jsx("span", { className: "truncate text-foreground-subtlest", children: modelCount === 0 ? emptyLabel : countLabel })), [countLabel, emptyLabel, modelCount]);
    const renderContent = useCallback(() => {
        if (result === null) {
            return null;
        }
        return (_jsxs("div", { className: "mb-2 space-y-2", "data-model-list": "true", children: [groups.map((group) => (_jsxs("div", { className: "min-w-0 space-y-0.5", children: [_jsx("div", { className: "text-ui-xs text-foreground-subtlest", children: listModelsGroupName(group.providerId, group.models.find((model) => model.providerLabel !== undefined)?.providerLabel, providerName, intl.formatMessage) }), group.models.map((model) => (_jsxs("div", { className: "flex min-w-0 items-baseline gap-x-2", title: listModelsRowTooltip(model, intl.formatMessage), "data-model-id": model.id, children: [_jsx("span", { className: model.disabledReason === undefined
                                        ? "min-w-0 truncate font-mono text-ui-base text-foreground-subtle"
                                        : "min-w-0 truncate font-mono text-ui-base text-foreground-subtlest", children: model.modelId }), model.id === result.current ? (_jsx("span", { className: "shrink-0 text-ui-xs text-foreground-subtlest", "data-model-current": "true", children: currentLabel })) : null, model.disabledReason === undefined ? null : (_jsx("span", { className: "min-w-0 truncate text-ui-xs text-warning", children: model.disabledReason })), model.contextWindow === undefined ? null : (_jsx("span", { className: "ml-auto shrink-0 font-mono text-ui-xs tabular-nums text-foreground-subtlest", children: formatContextWindow(model.contextWindow) }))] }, model.id)))] }, group.providerId))), result.truncated ? (_jsx("p", { className: "text-ui-sm text-foreground-subtlest", children: truncatedLabel })) : null] }));
    }, [currentLabel, groups, intl.formatMessage, providerName, result, truncatedLabel]);
    // 失败态**不**退回兜底卡：那张卡会摊开错误 JSON，而这里真正要说的是「这个会话读不到模型
    // 目录」。它与「一个模型也没有」是两回事，卡上既不画列表也不说那句空话（同
    // model_catalog_unavailable 在模型通道上的分辨）。
    if (result === null && toolCall.status === "failed") {
        return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: LIST_MODELS_TOOL_ICON, showIcon: context.showIcon !== false, canToggle: false, forceOpen: false, kindLabel: context.kindLabelOverride ?? kindLabel, sourceLabel: context.sourceLabel, 
                    // 失败时摘要行只有种类词与状态词：计数与那句「没有配置模型」在这里都是谎话。
                    primaryText: null, statusLabel: context.statusLabel, statusTooltip: context.errorText, showFailureStatus: true, isRunning: context.isRunning, title: toolCall.title }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                        ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                        : undefined })] }));
    }
    // 读不出结构化结果（老会话、降级路径）就交回通用卡，而不是画一张空目录。
    if (result === null) {
        return _jsx(FallbackToolCallBlock, { ...context, iconOverride: LIST_MODELS_TOOL_ICON });
    }
    // 一个模型也没有时摘要行就是那句话，没有可展开的内容——空卡体比没有卡体更难读。
    const hasDetails = modelCount > 0;
    return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: LIST_MODELS_TOOL_ICON, showIcon: context.showIcon !== false, canToggle: hasDetails && (context.canToggle ?? true), forceOpen: hasDetails && (context.forceOpen ?? false), kindLabel: context.kindLabelOverride ?? kindLabel, sourceLabel: context.sourceLabel, primaryText: primaryText, statusLabel: context.statusLabel, statusTooltip: context.errorText, showFailureStatus: toolCall.status === "failed", isRunning: context.isRunning, title: toolCall.title, renderContent: hasDetails ? renderContent : undefined }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                    ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                    : undefined })] }));
}
//# sourceMappingURL=list-models.js.map