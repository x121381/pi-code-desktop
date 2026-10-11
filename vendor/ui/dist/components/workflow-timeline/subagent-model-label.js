import { thoughtLevelLabelId } from "../../chat-input-toolbar/thoughtLevelOptions.js";
import { parseModelPickerValue } from "../../lib/zcodeSessionProjection.js";
import { formatProviderModelLabel } from "../../v4/composer/modelTriggerDisplay.js";
/** 解析不出结构时的兜底取名：砍掉 `providerId/` 前缀与 `$level` 后缀，剩下的就是人能读的那截。 */
function fallbackName(canonical) {
    const separatorIndex = canonical.indexOf("/");
    const rest = separatorIndex > 0 ? canonical.slice(separatorIndex + 1) : canonical;
    const levelIndex = rest.indexOf("$");
    const name = levelIndex > 0 ? rest.slice(0, levelIndex) : rest;
    return name.length > 0 ? name : canonical;
}
/**
 * 规范串 → 屏幕上的词。解析失败（串缺 provider 段、或形状不合 schema）不抛：UI 不是第二个
 * 解析器，拿不准就退回裸 modelId。
 */
export function describeWorkflowSubagentModel(canonical, deps) {
    const trimmed = canonical.trim();
    let parsed;
    try {
        parsed = parseModelPickerValue(trimmed);
    }
    catch {
        parsed = undefined;
    }
    if (parsed === undefined) {
        return { canonical: trimmed, name: fallbackName(trimmed) };
    }
    // 会话清单里 providerName 查不到时会退回 providerId 本身（见 zcodeSessionSettingsToConfigOptions）；
    // 那种「名字」正是我们要挡的东西，当作没查到。
    const resolvedName = deps.providerName?.(parsed.providerId)?.trim();
    const providerName = resolvedName === undefined || resolvedName === parsed.providerId ? undefined : resolvedName;
    const name = formatProviderModelLabel(parsed.providerId, providerName, parsed.modelId);
    const rawLevel = parsed.options?.reasoningLevel;
    if (rawLevel === undefined) {
        return { canonical: trimmed, name };
    }
    // 档位词与思考控件同一张表；表里没有的值原样显示（provider 自定义的档位名）。
    const labelId = thoughtLevelLabelId(rawLevel);
    return {
        canonical: trimmed,
        level: labelId === undefined ? rawLevel : deps.formatMessage({ id: labelId }),
        name,
    };
}
/** 一句话说清模型与强度：没有档位时就是模型名本身（确认窗与 tooltip 共用）。 */
export function workflowSubagentModelText(formatMessage, label) {
    return label.level === undefined
        ? label.name
        : formatMessage({ id: "chat.toolCall.workflow.subagentModel.withLevel" }, { level: label.level, model: label.name });
}
/**
 * 三个面共用的 tooltip：一句解释（子代理跑在哪儿、主代理没变）+ 换行 + 规范串。
 * 规范串是给机器回填用的，它只该在这里出现。
 */
export function workflowSubagentModelTooltip(formatMessage, label) {
    const explained = formatMessage({ id: "chat.toolCall.workflow.subagentModel.tooltip" }, { model: workflowSubagentModelText(formatMessage, label) });
    return `${explained}\n${label.canonical}`;
}
/**
 * 卡与侧板要的两样东西：屏幕上的名字（只有名字，档位留给 tooltip）与 tooltip。
 * run 没指定过模型时缺席——跟随会话模型是常态，没有可说的。
 */
export function workflowSubagentModelCardLabel(canonical, deps) {
    if (canonical === undefined) {
        return undefined;
    }
    const label = describeWorkflowSubagentModel(canonical, deps);
    return { name: label.name, title: workflowSubagentModelTooltip(deps.formatMessage, label) };
}
/**
 * 脊线上子代理行要的模型词（docs/dynamic-workflow/presentation.md「The spine」）：persona 点名了
 * 模型的子代理，行尾计数后面跟上模型名，行的 tooltip 多一行规范串。按实例键 `siteId@ordinal`
 * 索引一次，行只查不算。跑在 run 模型上的子代理不进表——摘要行已经说过那个模型。
 */
export function workflowActorModelLabels(actors, deps) {
    const labels = new Map();
    for (const actor of actors ?? []) {
        if (actor.model === undefined)
            continue;
        const label = describeWorkflowSubagentModel(actor.model, deps);
        labels.set(`${actor.siteId}@${actor.ordinal}`, {
            name: label.name,
            canonical: label.canonical,
        });
    }
    return labels;
}
//# sourceMappingURL=subagent-model-label.js.map