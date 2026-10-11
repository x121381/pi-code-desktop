export function normalizeCodingPlanCardCopyItems(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.flatMap((item) => {
        if (typeof item !== "string" &&
            (!item || typeof item !== "object")) {
            return [];
        }
        const text = typeof item === "string"
            ? item.trim()
            : typeof item.text === "string"
                ? item.text.trim()
                : "";
        if (!text) {
            return [];
        }
        const tooltip = typeof item === "string" ||
            typeof item.tooltip !== "string"
            ? ""
            : item.tooltip.trim();
        return [{ text, ...(tooltip ? { tooltip } : {}) }];
    });
}
const CODING_PLAN_CURRENCY_LABELS_ZH = {
    CNY: "人民币",
    USD: "美元",
};
export const CODING_PLAN_PERIODS = [
    "monthly",
    "quarterly",
    "yearly",
];
export const CODING_PLAN_PERIOD_LABEL_IDS = {
    monthly: "settings.modelProvider.codingPlan.period.monthly",
    quarterly: "settings.modelProvider.codingPlan.period.quarterly",
    yearly: "settings.modelProvider.codingPlan.period.yearly",
};
export function groupProductsByPeriod(productList) {
    const groups = {
        monthly: [],
        quarterly: [],
        yearly: [],
    };
    for (const product of productList) {
        groups[inferBillingPeriod(product)].push(product);
    }
    for (const period of CODING_PLAN_PERIODS) {
        groups[period].sort(compareCodingPlanProduct);
    }
    return groups;
}
export function pickProductTitle(product) {
    return (product.productName?.trim() ||
        product.productBigTitle?.trim() ||
        product.productId);
}
export function pickProductDetails(product) {
    // 修复原因：套餐卡片的运营文案现在由静态配置的 description 控制；
    // 继续优先拼 productEquityList 会展示旧权益字段，和服务端配置的套餐说明不一致。
    const descriptionDetails = [
        product.productDescription?.trim(),
        product.productIntroduction?.trim(),
    ]
        .filter((value) => Boolean(value))
        .flatMap((value) => value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean))
        .slice(0, 4);
    if (descriptionDetails.length > 0) {
        return descriptionDetails;
    }
    return (product.productEquityList ?? [])
        .map((equity) => [equity.productEquityTitle?.trim(), equity.productEquityDetails?.trim()]
        .filter(Boolean)
        .join("："))
        .filter(Boolean)
        .slice(0, 4);
}
export function pickProductPrice(product) {
    return (product.payAmount ?? product.discountAmount ?? product.renewAmount ?? null);
}
export function normalizeCodingPlanCurrency(currency) {
    return currency?.trim().toUpperCase() === "USD" ? "USD" : "CNY";
}
export function formatCodingPlanAmount(amount, currency, locale) {
    const resolvedCurrency = normalizeCodingPlanCurrency(currency);
    const isChineseLocale = locale.toLowerCase().startsWith("zh");
    const formattedAmount = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
    const currencyPrefix = isChineseLocale
        ? resolvedCurrency === "USD"
            ? "$"
            : "¥"
        : resolvedCurrency === "USD"
            ? "US$"
            : "CN¥";
    const formatted = `${currencyPrefix}${formattedAmount}`;
    // 套餐页需要同时展示中英文和跨币种价格；依赖 Intl currency 会在不同 locale 下输出
    // 不一致的 ISO code/符号组合，因此这里按产品文案规范固定符号和中文币种名。
    return isChineseLocale
        ? `${formatted} ${CODING_PLAN_CURRENCY_LABELS_ZH[resolvedCurrency]}`
        : formatted;
}
export function inferBillingPeriod(product) {
    const explicitUnit = product.priceUnit;
    if (explicitUnit) {
        // Bugfix: Z.AI 海外套餐会直接返回 priceUnit，优先使用后端给出的计费周期，避免英文商品名或金额折算造成误判。
        return explicitUnit === "year"
            ? "yearly"
            : explicitUnit === "quarter"
                ? "quarterly"
                : "monthly";
    }
    const pack = product.relateResourcePack ?? "";
    if (/包年|-\s*年|year/i.test(pack)) {
        return "yearly";
    }
    if (/包季|-\s*季|quarter/i.test(pack)) {
        return "quarterly";
    }
    if (/包月|-\s*月|month/i.test(pack)) {
        return "monthly";
    }
    const monthlyAmount = product.monthlyOriginalAmount ?? product.monthlyPayAmount;
    const totalAmount = product.originalAmount ?? product.payAmount;
    if (typeof monthlyAmount === "number" && typeof totalAmount === "number") {
        const ratio = Math.round(totalAmount / monthlyAmount);
        if (ratio >= 10) {
            return "yearly";
        }
        if (ratio >= 2) {
            return "quarterly";
        }
    }
    return "monthly";
}
function compareCodingPlanProduct(left, right) {
    return productLevelRank(left) - productLevelRank(right);
}
function productLevelRank(product) {
    const name = product.productName?.toLowerCase() ?? "";
    if (name.includes("start")) {
        return -1;
    }
    if (name.includes("lite")) {
        return 0;
    }
    if (name.includes("pro")) {
        return 1;
    }
    if (name.includes("max")) {
        return 2;
    }
    return 3;
}
//# sourceMappingURL=codingPlanProductPresentation.js.map