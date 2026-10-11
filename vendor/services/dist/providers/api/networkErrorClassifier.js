// feedback 与模型连通性曾分别维护错误码列表，导致 Undici 建连超时只在部分链路被识别。
// 统一沿 cause/AggregateError 链归一化错误，避免调用方再次因运行时包装层级不同而漏判。
const NETWORK_FAILURE_CODES = new Set([
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_CONNECT_ERROR",
    "ENOTFOUND",
    "ETIMEDOUT",
    "ENETUNREACH",
    "EHOSTUNREACH",
    "ECONNREFUSED",
    "ECONNRESET",
]);
const RETRYABLE_CONNECTION_ESTABLISHMENT_CODES = new Set([
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_CONNECT_ERROR",
    "ENOTFOUND",
    "ENETUNREACH",
    "EHOSTUNREACH",
    "ECONNREFUSED",
]);
export function getNetworkErrorCodes(error) {
    return [...collectNetworkErrorDetails(error).codes].sort();
}
export function isNetworkFailure(error) {
    const { codes } = collectNetworkErrorDetails(error);
    return [...codes].some((code) => NETWORK_FAILURE_CODES.has(code));
}
export function isRetryableConnectionEstablishmentError(error) {
    const { codes, messages } = collectNetworkErrorDetails(error);
    if ([...codes].some((code) => RETRYABLE_CONNECTION_ESTABLISHMENT_CODES.has(code))) {
        return true;
    }
    // ETIMEDOUT 也可能发生在 POST 请求体已经发出后，不能只凭错误码重试创建工单。
    // Node 的建连超时会明确包含 connection attempts/connect ETIMEDOUT，只有该证据存在时才安全重试。
    if (codes.has("ETIMEDOUT") &&
        messages.some((message) => /connection attempts timed out|connect ETIMEDOUT/i.test(message))) {
        return true;
    }
    return (codes.has("ECONNRESET") &&
        messages.some((message) => /before secure TLS connection was established/i.test(message)));
}
function collectNetworkErrorDetails(error) {
    const details = { codes: new Set(), messages: [] };
    const seen = new Set();
    const pending = [error];
    while (pending.length > 0) {
        const current = pending.pop();
        if (!current || typeof current !== "object" || seen.has(current)) {
            continue;
        }
        seen.add(current);
        const record = current;
        if (typeof record.code === "string") {
            details.codes.add(record.code);
        }
        if (typeof record.message === "string") {
            details.messages.push(record.message);
        }
        if (record.cause !== undefined) {
            pending.push(record.cause);
        }
        if (Array.isArray(record.errors)) {
            pending.push(...record.errors);
        }
    }
    return details;
}
//# sourceMappingURL=networkErrorClassifier.js.map