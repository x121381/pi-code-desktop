import { useZCodeIntl } from "../../i18n/IntlProvider.js";
export function formatEnterpriseTier(tier, options = "en-US") {
    const normalized = tier.trim();
    if (!normalized) {
        return tier;
    }
    const { formatMessage } = normalizeEnterpriseTierFormatOptions(options);
    const upper = normalized.toUpperCase();
    const fallback = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
    const messageId = resolveEnterpriseTierMessageId(upper);
    if (messageId && formatMessage) {
        // Bugfix: 企业 pricing 只返回 PRO/MAX 这类技术档位，展示名必须走 i18n 文案。
        // 不能在 helper 里写死中文，否则团队套餐状态卡和购买页无法随 locale/运营命名一起更新。
        return formatMessage(messageId, fallback);
    }
    return fallback;
}
export function resolveEnterpriseTierMessageId(normalizedTier) {
    const key = normalizedTier.trim().toLowerCase();
    if (key === "lite" || key === "pro" || key === "max") {
        return `settings.modelProvider.codingPlan.enterprise.tier.${key}`;
    }
    return null;
}
function normalizeEnterpriseTierFormatOptions(options) {
    return typeof options === "string" ? { locale: options } : options;
}
export function createEnterpriseTierMessageFormatter(intl) {
    return (id, fallback) => {
        const message = intl.formatMessage({ id });
        return message === id ? fallback : message;
    };
}
function resolveEnterpriseTierRank(tier) {
    const normalized = tier.trim().toLowerCase();
    if (normalized === "lite") {
        return 0;
    }
    if (normalized === "pro") {
        return 1;
    }
    if (normalized === "max") {
        return 2;
    }
    return 99;
}
export function groupEnterpriseCodingPlanProductsByTier(products, options) {
    const formatOptions = normalizeEnterpriseTierFormatOptions(options);
    const groups = new Map();
    for (const product of products) {
        const key = product.tier.trim().toLowerCase() || product.productId;
        const current = groups.get(key);
        if (current) {
            current.products.push(product);
            continue;
        }
        groups.set(key, {
            key,
            title: (product.staticCatalogAvailable ? product.productName?.trim() : undefined) ||
                formatEnterpriseTier(product.tier, formatOptions),
            products: [product],
        });
    }
    return [...groups.values()].sort((left, right) => resolveEnterpriseTierRank(left.key) - resolveEnterpriseTierRank(right.key));
}
//# sourceMappingURL=codingPlanEnterpriseTiers.js.map