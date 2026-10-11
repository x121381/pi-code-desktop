import { getAppUsageModelChartColor } from "@/settings/usage-stats/appUsageChartPalette.js";
const MAX_APP_USAGE_MODEL_PIE_SLICES = 6;
function resolvePieModelLabel(intl, modelId) {
    return modelId?.trim() || intl.formatMessage({ id: "settings.usage.unknownModel" });
}
export function buildAppUsageModelPieChartViewModel({ intl, snapshot, }) {
    const positiveModels = snapshot.models.filter((model) => model.totalTokens > 0);
    const totalModelTokens = positiveModels.reduce((sum, model) => sum + model.totalTokens, 0);
    const shouldMergeOther = positiveModels.length > MAX_APP_USAGE_MODEL_PIE_SLICES;
    const modelSliceLimit = shouldMergeOther
        ? MAX_APP_USAGE_MODEL_PIE_SLICES - 1
        : MAX_APP_USAGE_MODEL_PIE_SLICES;
    const modelSlices = positiveModels.slice(0, modelSliceLimit).map((model, index) => ({
        key: `model${index}`,
        label: resolvePieModelLabel(intl, model.modelId),
        color: getAppUsageModelChartColor(index),
        totalTokens: model.totalTokens,
        share: totalModelTokens > 0 ? model.totalTokens / totalModelTokens : 0,
    }));
    const otherModels = shouldMergeOther ? positiveModels.slice(modelSliceLimit) : [];
    const otherTotalTokens = otherModels.reduce((sum, model) => sum + model.totalTokens, 0);
    const otherSlice = otherTotalTokens > 0
        ? [
            {
                key: `model${modelSliceLimit}`,
                label: intl.formatMessage({ id: "settings.usage.modelChart.other" }),
                color: getAppUsageModelChartColor(modelSliceLimit),
                totalTokens: otherTotalTokens,
                share: totalModelTokens > 0 ? otherTotalTokens / totalModelTokens : 0,
            },
        ]
        : [];
    const chartData = [...modelSlices, ...otherSlice];
    const chartConfig = chartData.reduce((config, slice) => {
        config[slice.key] = {
            label: slice.label,
            color: slice.color,
        };
        return config;
    }, {});
    return {
        chartConfig,
        chartData,
        totalModelTokens,
    };
}
//# sourceMappingURL=appUsageModelPieChartViewModel.js.map