import { ESTIMATED_TOKEN_CHAR_DIVISOR } from "@zcode/shared";
const CREDIT_USAGE_BREAKDOWN_BUCKET_CODES = new Set([
    "cached_input",
    "cachedInput",
    "cache_input",
    "cacheInput",
    "uncached_input",
    "uncachedInput",
    "output",
    "output_tokens",
    "outputTokens",
]);
export function buildUsageStatsSnapshotFromMonitor(request, modelData, toolData) {
    const xTime = modelData.x_time ?? [];
    const tokensUsage = modelData.tokensUsage ?? [];
    const modelCallCount = modelData.modelCallCount ?? [];
    const daily = xTime.map((date, index) => {
        const totalEstimatedTokens = tokensUsage[index] ?? 0;
        const messageCount = modelCallCount[index] ?? 0;
        return {
            date,
            label: date,
            totalCharacters: totalEstimatedTokens * ESTIMATED_TOKEN_CHAR_DIVISOR,
            totalEstimatedTokens,
            sessionCount: messageCount > 0 ? 1 : 0,
            messageCount,
            activityScore: totalEstimatedTokens,
        };
    });
    const totalTokens = modelData.totalUsage?.totalTokensUsage ?? 0;
    const totalCalls = modelData.totalUsage?.totalModelCallCount ?? 0;
    const activeDayCount = daily.filter((day) => day.totalEstimatedTokens > 0).length;
    const mostActiveDay = daily.reduce((best, day) => {
        if (!best || day.totalEstimatedTokens > best.totalEstimatedTokens) {
            return day;
        }
        return best;
    }, null) ?? null;
    const firstActiveDay = daily.find((day) => day.totalEstimatedTokens > 0) ?? null;
    const lastActiveDay = [...daily].reverse().find((day) => day.totalEstimatedTokens > 0) ?? null;
    const summaryList = modelData.totalUsage?.modelSummaryList ?? modelData.modelSummaryList ?? [];
    const models = summaryList
        .filter((entry) => Boolean(entry?.modelName))
        .map((entry) => {
        const totalEstimatedTokens = entry.totalTokens ?? 0;
        return {
            modelId: entry.modelName ?? null,
            totalCharacters: totalEstimatedTokens * ESTIMATED_TOKEN_CHAR_DIVISOR,
            totalEstimatedTokens,
            inputCharacters: 0,
            inputEstimatedTokens: 0,
            outputCharacters: 0,
            outputEstimatedTokens: 0,
            sessionCount: 0,
            messageCount: 0,
            share: totalTokens > 0 ? totalEstimatedTokens / totalTokens : 0,
        };
    })
        .sort((left, right) => right.totalEstimatedTokens - left.totalEstimatedTokens);
    const favoriteModel = models[0]
        ? {
            modelId: models[0].modelId,
            totalCharacters: models[0].totalCharacters,
            totalEstimatedTokens: models[0].totalEstimatedTokens,
            share: models[0].share,
        }
        : null;
    return {
        range: request.range,
        generatedAt: Date.now(),
        timeZone: request.timeZone ?? "UTC",
        estimatedTokenCharDivisor: ESTIMATED_TOKEN_CHAR_DIVISOR,
        summary: {
            totalSessions: totalCalls,
            totalCharacters: totalTokens * ESTIMATED_TOKEN_CHAR_DIVISOR,
            totalEstimatedTokens: totalTokens,
            totalMessages: totalCalls,
            activeDays: activeDayCount,
            mostActiveDay,
            favoriteModel,
            longestSessionMs: 0,
            longestStreakDays: 0,
            currentStreakDays: 0,
            firstActivityDate: firstActiveDay?.date ?? null,
            lastActivityDate: lastActiveDay?.date ?? null,
            peakHour: null,
        },
        daily,
        // 热力图已从设置页移除;保留空结构以满足类型,避免下游消费方报错。
        heatmap: {
            startDate: firstActiveDay?.date ?? null,
            endDate: lastActiveDay?.date ?? null,
            maxActivityScore: daily.reduce((max, day) => (day.activityScore > max ? day.activityScore : max), 0),
            weeks: [],
            monthLabels: [],
        },
        models,
        source: "bigmodel-monitor",
        tools: buildToolUsages(toolData),
    };
}
export function buildCodingPlanUsageSnapshotFromMonitor(params) {
    const modelUsage = params.modelDetailData?.modelUsage ?? null;
    const toolUsage = params.toolDetailData?.mcpUsage ?? null;
    const modelSummaryList = modelUsage
        ? normalizeCreditModelSummaryList(modelUsage)
        : normalizeModelSummaryList(params.modelData ?? {});
    const toolSummaryList = toolUsage
        ? normalizeCreditToolSummaryList(toolUsage)
        : normalizeToolSummaryList(params.toolData ?? {});
    const modelDataList = modelUsage
        ? normalizeCreditModelDataList(modelUsage, params.xTime, params.granularity)
        : normalizeModelDataList(params.modelData ?? {}, params.xTime, params.granularity);
    const toolDataList = toolUsage
        ? normalizeCreditToolDataList(toolUsage, params.xTime, params.granularity)
        : normalizeToolDataList(params.toolData ?? {}, params.xTime, params.granularity);
    const totalTokensUsage = modelUsage
        ? sumCreditModelTokens(modelUsage)
        : (params.modelData?.totalUsage?.totalTokensUsage ?? 0);
    const activity = buildCodingPlanActivitySnapshot(params.activityData);
    return {
        range: params.request.range,
        rangeStartDate: params.startDateKey,
        rangeEndDate: params.endDateKey,
        generatedAt: Date.now(),
        sourceProvider: params.provider,
        quota: params.quota,
        activity: {
            ...activity,
            summary: { ...activity.summary, favoriteModelName: modelSummaryList[0]?.modelName ?? null },
        },
        detail: buildCodingPlanUsageDetailSnapshot(params.modelDetailData, params.toolDetailData),
        modelUsage: {
            xTime: params.xTime,
            granularity: params.granularity,
            totalModelCallCount: modelUsage?.modelDataList?.length ?? params.modelData?.totalUsage?.totalModelCallCount ?? 0,
            totalTokensUsage,
            modelDataList,
            modelSummaryList,
        },
        toolUsage: {
            xTime: params.xTime,
            granularity: params.granularity,
            toolDataList,
            toolSummaryList,
        },
        health: buildCodingPlanHealthSnapshot(params.healthData),
    };
}
function buildCodingPlanActivitySnapshot(payload) {
    const heatmap = buildCodingPlanActivityHeatmap(payload?.series ?? []);
    return {
        summary: {
            totalTokens: toFiniteNumber(payload?.summary?.totalTokens) ?? 0,
            peakDailyTokens: toFiniteNumber(payload?.summary?.peakDailyTokens) ?? 0,
            peakDailyTokensDate: payload?.summary?.peakDailyTokensDate?.trim() || null,
            totalUsageDurationMs: toFiniteNumber(payload?.summary?.totalUsageDurationMs) ?? 0,
            currentStreakDays: toFiniteNumber(payload?.summary?.currentStreakDays) ?? 0,
            longestStreakDays: toFiniteNumber(payload?.summary?.longestStreakDays) ?? 0,
            favoriteModelName: null,
        },
        heatmap,
    };
}
function buildCodingPlanActivityHeatmap(series) {
    const cells = series
        .map((item) => {
        const date = item.date?.trim() ?? "";
        const totalTokens = toFiniteNumber(item.totalTokens) ?? 0;
        const turnCount = toFiniteNumber(item.modelCallCount) ?? 0;
        if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) {
            return null;
        }
        return {
            date,
            totalTokens,
            turnCount,
            toolCallCount: toFiniteNumber(item.mcpCalls) ?? 0,
        };
    })
        .filter((cell) => cell !== null)
        .sort((left, right) => left.date.localeCompare(right.date));
    const maxTokens = Math.max(0, ...cells.map((cell) => cell.totalTokens));
    const weeks = buildAppUsageHeatmapWeeks(cells, maxTokens);
    return {
        startDate: cells[0]?.date ?? null,
        endDate: cells.at(-1)?.date ?? null,
        maxTokens,
        weeks,
    };
}
function buildAppUsageHeatmapWeeks(cells, maxTokens) {
    const byDate = new Map(cells.map((cell) => [cell.date, cell]));
    const weekStarts = new Map();
    for (const cell of cells) {
        const dayIndex = dateKeyToUtcDayIndex(cell.date);
        if (dayIndex === null)
            continue;
        const weekStart = dayIndex - new Date(dayIndex * DAY_MS).getUTCDay();
        let week = weekStarts.get(weekStart);
        if (!week) {
            week = {
                weekIndex: weekStarts.size,
                days: Array.from({ length: 7 }, (_, index) => {
                    const date = utcDayIndexToDateKey(weekStart + index);
                    const source = byDate.get(date);
                    return source
                        ? { ...source, level: levelForTokens(source.totalTokens, maxTokens) }
                        : null;
                }),
            };
            weekStarts.set(weekStart, week);
        }
    }
    return [...weekStarts.entries()]
        .sort(([left], [right]) => left - right)
        .map(([, week], index) => ({ ...week, weekIndex: index }));
}
const DAY_MS = 86_400_000;
function dateKeyToUtcDayIndex(dateKey) {
    const date = new Date(`${dateKey}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()))
        return null;
    return Math.floor(date.getTime() / DAY_MS);
}
function utcDayIndexToDateKey(dayIndex) {
    return new Date(dayIndex * DAY_MS).toISOString().slice(0, 10);
}
function levelForTokens(value, max) {
    if (value <= 0 || max <= 0)
        return 0;
    return Math.min(4, Math.max(1, Math.ceil((value / max) * 4)));
}
function buildCodingPlanUsageDetailSnapshot(modelDetailData, toolDetailData) {
    return {
        model: buildCodingPlanUsageDetailSummary(modelDetailData?.summary),
        tool: buildCodingPlanUsageDetailSummary(toolDetailData?.summary),
    };
}
function buildCodingPlanUsageDetailSummary(summary) {
    return {
        cacheHitRate: toFiniteNumber(summary?.cacheHitRate?.value),
        cacheHitRateTrend: toFiniteNumber(summary?.cacheHitRate?.trend),
        totalCredits: toFiniteNumber(summary?.totalCredits?.value) ?? 0,
        totalCreditsTrend: toFiniteNumber(summary?.totalCredits?.trend),
        averageDailyCredits: toFiniteNumber(summary?.averageDailyCredits?.value) ?? 0,
        averageDailyCreditsTrend: toFiniteNumber(summary?.averageDailyCredits?.trend),
    };
}
function buildCodingPlanHealthSnapshot(payload) {
    return {
        xTime: payload?.x_time ?? payload?.xTime ?? [],
        proMaxDecodeSpeed: normalizeNumberSeries(payload?.proMaxDecodeSpeed),
        liteDecodeSpeed: normalizeNumberSeries(payload?.liteDecodeSpeed),
    };
}
function normalizeModelDataList(payload, xTime, granularity) {
    return (payload.modelDataList ?? [])
        .filter((item) => Boolean(item?.modelName?.trim()))
        .map((item, index) => ({
        modelName: item.modelName.trim(),
        sortOrder: item.sortOrder ?? index,
        tokensUsage: alignUsageSeries(payload.x_time ?? [], xTime, item.tokensUsage, granularity),
        totalTokens: item.totalTokens ?? 0,
    }))
        .sort((left, right) => left.sortOrder - right.sortOrder);
}
function normalizeCreditModelDataList(payload, xTime, granularity) {
    return (payload.modelDataList ?? [])
        .filter((item) => Boolean(item?.modelName?.trim() || item?.modelCode?.trim()))
        .filter((item) => !isCreditUsageBreakdownBucket(item))
        .map((item, index) => {
        const cachedInputTokensUsage = alignUsageSeries(payload.xTime ?? [], xTime, item.cachedInputTokensUsage, granularity);
        const uncachedInputTokensUsage = alignUsageSeries(payload.xTime ?? [], xTime, item.uncachedInputTokensUsage, granularity);
        const outputTokensUsage = alignUsageSeries(payload.xTime ?? [], xTime, item.outputTokensUsage, granularity);
        const cachedInputCreditsUsage = alignUsageSeries(payload.xTime ?? [], xTime, item.cachedInputCreditsUsage, granularity);
        const uncachedInputCreditsUsage = alignUsageSeries(payload.xTime ?? [], xTime, item.uncachedInputCreditsUsage, granularity);
        const outputCreditsUsage = alignUsageSeries(payload.xTime ?? [], xTime, item.outputCreditsUsage, granularity);
        const tokenSeries = pickFirstNonEmptySeries([
            item.totalTokensUsage,
            item.tokensUsage,
            sumSeries([
                item.cachedInputTokensUsage,
                item.uncachedInputTokensUsage,
                item.outputTokensUsage,
            ]),
        ]) ?? [];
        const creditSeries = pickFirstNonEmptySeries([
            item.totalCreditsUsage,
            sumSeries([
                item.cachedInputCreditsUsage,
                item.uncachedInputCreditsUsage,
                item.outputCreditsUsage,
            ]),
        ]) ?? [];
        const modelName = item.modelName?.trim() || item.modelCode?.trim() || "unknown";
        return {
            modelName,
            sortOrder: item.sortOrder ?? index,
            tokensUsage: alignUsageSeries(payload.xTime ?? [], xTime, tokenSeries, granularity),
            creditsUsage: alignUsageSeries(payload.xTime ?? [], xTime, creditSeries, granularity),
            cachedInputTokensUsage,
            uncachedInputTokensUsage,
            outputTokensUsage,
            cachedInputCreditsUsage,
            uncachedInputCreditsUsage,
            outputCreditsUsage,
            totalTokens: toFiniteNumber(item.totalTokens) ?? sumNumbers(tokenSeries),
            totalCredits: toFiniteNumber(item.totalCredits) ?? sumNumbers(creditSeries),
        };
    })
        .sort((left, right) => left.sortOrder - right.sortOrder);
}
function isCreditUsageBreakdownBucket(item) {
    const code = item.modelCode?.trim();
    if (code && CREDIT_USAGE_BREAKDOWN_BUCKET_CODES.has(code)) {
        return true;
    }
    const name = item.modelName?.trim().toLowerCase();
    // BigModel usage-detail 的 MODEL 数据有时返回“缓存/未缓存/输出”
    // 这种 token 拆分桶。它们是计费组成，不是模型维度，不能作为使用详情的模型图例。
    return name === "缓存" || name === "未缓存" || name === "输出";
}
function sumCreditModelTokens(payload) {
    // usage-detail 有时会同时返回真实模型行和“缓存/未缓存/输出”拆分桶，
    // 桶是全部模型 token 的计费组成而非模型维度，直接全量求和会把总用量算成约 2 倍。
    // 存在真实模型行时只统计模型行；仅返回拆分桶时才用桶求和兜底（保持原有语义）。
    const items = payload.modelDataList ?? [];
    const hasRealModelRow = items.some((item) => !isCreditUsageBreakdownBucket(item));
    const effectiveItems = hasRealModelRow
        ? items.filter((item) => !isCreditUsageBreakdownBucket(item))
        : items;
    return sumNumbers(effectiveItems.flatMap((item) => {
        const tokenSeries = pickFirstNonEmptySeries([
            item.totalTokensUsage,
            item.tokensUsage,
            sumSeries([
                item.cachedInputTokensUsage,
                item.uncachedInputTokensUsage,
                item.outputTokensUsage,
            ]),
        ]) ?? [];
        const totalTokens = toFiniteNumber(item.totalTokens);
        return totalTokens === null ? tokenSeries : [totalTokens];
    }));
}
function normalizeModelSummaryList(payload) {
    return (payload.modelSummaryList ?? payload.totalUsage?.modelSummaryList ?? [])
        .filter((item) => Boolean(item?.modelName?.trim()))
        .map((item, index) => ({
        modelName: item.modelName.trim(),
        totalTokens: item.totalTokens ?? 0,
        sortOrder: item.sortOrder ?? index,
    }))
        .sort((left, right) => left.sortOrder - right.sortOrder);
}
function normalizeCreditModelSummaryList(payload) {
    return normalizeCreditModelDataList(payload, payload.xTime ?? [], (payload.xTime ?? []).some((value) => /\d{2}:\d{2}/u.test(value)) ? "hour" : "day").map((item) => ({
        modelName: item.modelName,
        totalTokens: item.totalTokens,
        totalCredits: item.totalCredits,
        sortOrder: item.sortOrder,
    }));
}
function normalizeToolDataList(payload, xTime, granularity) {
    return (payload.toolDataList ?? [])
        .filter((item) => Boolean(item?.toolCode?.trim() || item?.toolName?.trim()))
        .map((item, index) => ({
        toolCode: item.toolCode?.trim() || item.toolName?.trim() || "unknown",
        toolName: item.toolName?.trim() || item.toolCode?.trim() || "Unknown",
        sortOrder: item.sortOrder ?? index,
        usageCount: alignUsageSeries(payload.x_time ?? [], xTime, item.usageCount, granularity),
        totalUsageCount: item.totalUsageCount ?? 0,
    }))
        .sort((left, right) => left.sortOrder - right.sortOrder);
}
function normalizeCreditToolDataList(payload, xTime, granularity) {
    return (payload.mcpDataList ?? [])
        .filter((item) => Boolean(item?.mcpCode?.trim() ||
        item?.mcpName?.trim() ||
        item?.toolCode?.trim() ||
        item?.toolName?.trim()))
        .map((item, index) => {
        const usageSeries = pickFirstNonEmptySeries([item.mcpCallCount, item.usageCount]) ?? [];
        const creditSeries = item.creditsUsage ?? [];
        const toolCode = item.mcpCode?.trim() || item.toolCode?.trim() || item.mcpName?.trim() || "unknown";
        const toolName = item.mcpName?.trim() || item.toolName?.trim() || item.mcpCode?.trim() || toolCode;
        return {
            toolCode,
            toolName,
            sortOrder: item.sortOrder ?? index,
            usageCount: alignUsageSeries(payload.xTime ?? [], xTime, usageSeries, granularity),
            creditsUsage: alignUsageSeries(payload.xTime ?? [], xTime, creditSeries, granularity),
            totalUsageCount: toFiniteNumber(item.totalUsageCount) ?? sumNumbers(usageSeries),
            totalCredits: toFiniteNumber(item.totalCredits) ?? sumNumbers(creditSeries),
        };
    })
        .sort((left, right) => left.sortOrder - right.sortOrder);
}
function normalizeToolSummaryList(payload) {
    return (payload.toolSummaryList ?? payload.totalUsage?.toolSummaryList ?? [])
        .filter((item) => Boolean(item?.toolCode?.trim() || item?.toolName?.trim()))
        .map((item, index) => ({
        toolCode: item.toolCode?.trim() || item.toolName?.trim() || "unknown",
        toolName: item.toolName?.trim() || item.toolCode?.trim() || "Unknown",
        totalUsageCount: item.totalUsageCount ?? 0,
        sortOrder: item.sortOrder ?? index,
    }))
        .sort((left, right) => left.sortOrder - right.sortOrder);
}
function normalizeCreditToolSummaryList(payload) {
    return normalizeCreditToolDataList(payload, payload.xTime ?? [], (payload.xTime ?? []).some((value) => /\d{2}:\d{2}/u.test(value)) ? "hour" : "day").map((item) => ({
        toolCode: item.toolCode,
        toolName: item.toolName,
        totalUsageCount: item.totalUsageCount,
        totalCredits: item.totalCredits,
        sortOrder: item.sortOrder,
    }));
}
function toFiniteNumber(value) {
    const numericValue = typeof value === "number"
        ? value
        : typeof value === "string" && value.trim().length > 0
            ? Number(value)
            : Number.NaN;
    return Number.isFinite(numericValue) ? numericValue : null;
}
function normalizeNumberSeries(values) {
    return (values ?? []).map((value) => toFiniteNumber(value) ?? 0);
}
function sumNumbers(values) {
    return (values ?? []).reduce((sum, value) => sum + (toFiniteNumber(value) ?? 0), 0);
}
function sumSeries(seriesList) {
    const maxLength = Math.max(0, ...seriesList.map((series) => series?.length ?? 0));
    if (maxLength === 0)
        return undefined;
    return Array.from({ length: maxLength }, (_, index) => seriesList.reduce((sum, series) => sum + (toFiniteNumber(series?.[index]) ?? 0), 0));
}
function pickFirstNonEmptySeries(seriesList) {
    const series = seriesList.find((item) => Array.isArray(item) && item.some((value) => (toFiniteNumber(value) ?? 0) > 0));
    return series ? normalizeNumberSeries(series) : undefined;
}
function alignUsageSeries(sourceXTime, targetXTime, values, granularity) {
    const sourceValues = normalizeNumberSeries(values);
    if (sourceXTime.length === 0 && sourceValues.length === targetXTime.length) {
        return sourceValues;
    }
    const valuesByTime = new Map();
    sourceXTime.forEach((time, index) => {
        valuesByTime.set(normalizeCodingPlanAxisValue(time, granularity), sourceValues[index] ?? 0);
    });
    return targetXTime.map((time, index) => {
        const normalizedTime = normalizeCodingPlanAxisValue(time, granularity);
        return (valuesByTime.get(normalizedTime) ??
            (sourceXTime.length === 0 ? (sourceValues[index] ?? 0) : 0));
    });
}
function normalizeCodingPlanAxisValue(value, granularity) {
    if (granularity === "hour") {
        const timeMatch = /(\d{2}):(\d{2})(?::(\d{2}))?/.exec(value);
        if (timeMatch) {
            return `${timeMatch[1]}:${timeMatch[2]}:${timeMatch[3] ?? "00"}`;
        }
    }
    const dateMatch = /(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (dateMatch) {
        return `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
    }
    return value;
}
function buildToolUsages(toolData) {
    const tools = [];
    const definitions = [
        {
            toolCode: "network-search",
            displayName: "联网搜索 MCP",
            daily: toolData.networkSearchCount,
            total: toolData.totalUsage?.totalNetworkSearchCount,
        },
        {
            toolCode: "web-reader",
            displayName: "网页读取 MCP",
            daily: toolData.webReadMcpCount,
            total: toolData.totalUsage?.totalWebReadMcpCount,
        },
        {
            toolCode: "zread",
            displayName: "开源仓库 MCP",
            daily: toolData.zreadMcpCount,
            total: toolData.totalUsage?.totalZreadMcpCount,
        },
    ];
    for (const def of definitions) {
        const dailyCalls = Array.isArray(def.daily) ? def.daily : [];
        const totalCalls = typeof def.total === "number"
            ? def.total
            : dailyCalls.reduce((sum, value) => sum + (value ?? 0), 0);
        tools.push({
            toolCode: def.toolCode,
            displayName: def.displayName,
            totalCalls,
            dailyCalls,
        });
    }
    // search-mcp 没有按天数据,只有合计;有数值时单独追加一条。
    const totalSearchMcp = toolData.totalUsage?.totalSearchMcpCount ?? 0;
    if (totalSearchMcp > 0) {
        tools.push({
            toolCode: "search-mcp",
            // 该接口同时有 network-search 和 search-mcp 两个搜索类统计项。
            // 网页截图只明确了前者叫“联网搜索 MCP”，这里保留 Search MCP 避免两个搜索项重名。
            displayName: "Search MCP",
            totalCalls: totalSearchMcp,
            dailyCalls: [],
        });
    }
    return tools;
}
//# sourceMappingURL=bigmodelUsageMonitorMapper.js.map