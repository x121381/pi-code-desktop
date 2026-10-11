import { ApiError } from "@zcode/shared";
const DIAGNOSTIC_RESPONSE_HEADER_NAMES = ["x-request-id", "x-trace-id", "x-span-id"];
function resolveMethod(init) {
    return (init?.method ?? "GET").toUpperCase();
}
function resolveUrl(input) {
    return typeof input === "string" ? input : input.toString();
}
function readDiagnosticResponseHeaders(headers) {
    const responseHeaders = {};
    for (const name of DIAGNOSTIC_RESPONSE_HEADER_NAMES) {
        const value = headers.get(name)?.trim();
        if (value) {
            responseHeaders[name] = value;
        }
    }
    return Object.keys(responseHeaders).length > 0 ? responseHeaders : undefined;
}
async function readResponseMessage(response) {
    try {
        const body = await response.text();
        const trimmed = body.trim();
        if (!trimmed) {
            return `HTTP ${response.status}`;
        }
        try {
            const parsed = JSON.parse(trimmed);
            const message = typeof parsed.error === "string"
                ? parsed.error
                : typeof parsed.message === "string"
                    ? parsed.message
                    : typeof parsed.msg === "string"
                        ? parsed.msg
                        : typeof parsed.detail === "string"
                            ? parsed.detail
                            : "";
            return message.trim() || `HTTP ${response.status}`;
        }
        catch {
            return trimmed;
        }
    }
    catch {
        return `HTTP ${response.status}`;
    }
}
export async function readApiJson(apiClient, input, init) {
    const url = resolveUrl(input);
    const method = resolveMethod(init);
    const response = await apiClient.request(input, init);
    if (!response.ok) {
        const message = await readResponseMessage(response);
        throw new ApiError({
            message,
            url,
            method,
            status: response.status,
            responseHeaders: readDiagnosticResponseHeaders(response.headers),
        });
    }
    try {
        return (await response.json());
    }
    catch (error) {
        throw new ApiError({
            message: error instanceof Error ? error.message : "Invalid JSON response",
            url,
            method,
            status: response.status,
            responseHeaders: readDiagnosticResponseHeaders(response.headers),
            cause: error,
        });
    }
}
//# sourceMappingURL=apiJson.js.map