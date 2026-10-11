import { ServiceChannels } from "@zcode/shared";
import { Event as RpcEvent } from "@zcode/rpc";
import { createServiceDescriptor } from "../descriptors.js";
function inferFailureReasonCode(message) {
    if (/Running turns/iu.test(message))
        return "running_turn";
    if (/Streaming rows/iu.test(message))
        return "streaming_row";
    if (/Active tool calls/iu.test(message))
        return "active_tool_call";
    if (/Active subagents|subagent detail/iu.test(message))
        return "active_subagent";
    if (/attachments?|public input contains local write identity/iu.test(message)) {
        return "input_attachment";
    }
    if (/Inline tool images/iu.test(message))
        return "inline_tool_image";
    if (/Timeline|fork|checkpoint|summary references/iu.test(message)) {
        return "unsupported_timeline";
    }
    if (/Local and inline URLs/iu.test(message))
        return "unsafe_url";
    if (/missing its product turn|product turn identity/iu.test(message)) {
        return "missing_product_turn";
    }
    if (/Selected product turns|selected row|selection/iu.test(message)) {
        return "invalid_selection";
    }
    if (/not allowed by server capabilities/iu.test(message))
        return "artifact_type_not_allowed";
    if (/extension is missing/iu.test(message))
        return "artifact_extension_missing";
    if (/outside the workspace/iu.test(message))
        return "artifact_outside_workspace";
    if (/changed after|file changed|size\/mtime/iu.test(message))
        return "artifact_changed";
    // 本地/远程 artifact source 的兜底消息是 "artifact cannot be read"，
    // 旧正则只覆盖 ended|source|chunk|readable，读失败因此被误判为 invalid_conversation。
    if (/artifact (?:ended|source|chunk|readable|cannot be read)/iu.test(message)) {
        return "artifact_read_failed";
    }
    if (/artifact (?:identifiers|manifest|acknowledgement|missing)/iu.test(message)) {
        return "artifact_manifest";
    }
    if (/payload|too many rows|too many artifacts/iu.test(message))
        return "payload_limit";
    return "invalid_conversation";
}
const SAFE_FAILURE_DIAGNOSTIC_KEYS = new Set([
    "rowKind",
    "rowId",
    "field",
    "artifactType",
    "extension",
    "phase",
    "expectedBytes",
    "actualBytes",
    "errno",
]);
const MAX_FAILURE_ISSUES = 5;
function sanitizeFailureIssue(issue) {
    const safeString = (value) => value && value.length <= 128 && !/[\\/]|:\/\//u.test(value) ? value : undefined;
    const safeMimeType = (value) => value && value.length <= 128 && /^[A-Za-z0-9.+-]+\/[A-Za-z0-9.+-]+$/u.test(value)
        ? value
        : undefined;
    const artifactDisplayName = issue.artifactDisplayName?.trim();
    // displayName 含路径/URL 或超长时，整条 issue 返回 null 会被过滤——脱敏目标是
    // 不泄露路径，而不是丢掉整条诊断信息。改为只剥离该字段，保留 code/scope 等定位信息。
    const safeArtifactDisplayName = artifactDisplayName &&
        artifactDisplayName.length <= 128 &&
        !/[\\/]|:\/\//u.test(artifactDisplayName)
        ? artifactDisplayName
        : undefined;
    const allowedFormats = issue.allowedFormats
        ?.map((value) => value.trim())
        .filter((value) => value.length > 0 && value.length <= 128 && !/[\\/]|:\/\//u.test(value));
    const allowedArtifacts = issue.allowedArtifacts
        ?.map((artifact) => ({
        type: artifact.type.trim(),
        extensions: artifact.extensions
            .map((extension) => extension.trim().replace(/^\./u, ""))
            .filter((extension) => extension.length > 0 && extension.length <= 32),
        mimeTypes: artifact.mimeTypes
            .map((mimeType) => mimeType.trim().toLowerCase())
            .filter((mimeType) => /^[A-Za-z0-9.+-]+\/[A-Za-z0-9.+-]+$/u.test(mimeType)),
        ...(artifact.displayName &&
            artifact.displayName.length <= 64 &&
            !/[\\/]|:\/\//u.test(artifact.displayName)
            ? { displayName: artifact.displayName.trim() }
            : {}),
    }))
        .filter((artifact) => artifact.type.length > 0 &&
        !/[\\/]|:\/\//u.test(artifact.type) &&
        artifact.extensions.length > 0);
    return {
        code: issue.code,
        scope: issue.scope,
        ...(issue.rowId === undefined ? {} : { rowId: issue.rowId }),
        ...(issue.turnOrdinal === undefined ? {} : { turnOrdinal: issue.turnOrdinal }),
        ...(typeof issue.productTurnId === "string" && issue.productTurnId.length > 0
            ? { productTurnId: issue.productTurnId }
            : {}),
        ...(safeArtifactDisplayName ? { artifactDisplayName: safeArtifactDisplayName } : {}),
        ...(safeString(issue.artifactType) ? { artifactType: safeString(issue.artifactType) } : {}),
        ...(safeString(issue.extension) ? { extension: safeString(issue.extension) } : {}),
        ...(safeMimeType(issue.mimeType) ? { mimeType: safeMimeType(issue.mimeType) } : {}),
        ...(issue.actual === undefined ? {} : { actual: issue.actual }),
        ...(issue.limit === undefined ? {} : { limit: issue.limit }),
        ...(issue.retryAfterMs === undefined ? {} : { retryAfterMs: issue.retryAfterMs }),
        ...(issue.phase === undefined ? {} : { phase: issue.phase }),
        ...(allowedFormats && allowedFormats.length > 0 ? { allowedFormats } : {}),
        ...(allowedArtifacts && allowedArtifacts.length > 0 ? { allowedArtifacts } : {}),
        ...(issue.availability === undefined ? {} : { availability: issue.availability }),
    };
}
/**
 * 把 issue 列表裁剪并清洗成可安全跨 RPC 的载荷，返回被省略的条数。
 * 非阻断 warning 与阻断 issue 共用同一套脱敏规则。
 */
export function sanitizeConversationShareIssues(issues) {
    const sanitized = issues
        .slice(0, MAX_FAILURE_ISSUES)
        .map(sanitizeFailureIssue)
        .filter((issue) => issue !== null);
    return {
        issues: sanitized,
        issueCount: issues.length,
        omittedIssueCount: Math.max(0, issues.length - sanitized.length),
    };
}
function sanitizeFailureDiagnostics(diagnostics) {
    if (!diagnostics)
        return undefined;
    const safe = {};
    for (const [key, value] of Object.entries(diagnostics)) {
        if (!SAFE_FAILURE_DIAGNOSTIC_KEYS.has(key))
            continue;
        if (typeof value === "string" && (/[\\/]|:\/\//u.test(value) || value.length > 128))
            continue;
        safe[key] = value;
    }
    return Object.keys(safe).length > 0 ? safe : undefined;
}
export class ConversationShareServiceError extends Error {
    kind;
    requestId;
    status;
    code;
    reasonCode;
    diagnostics;
    issues;
    issueCount;
    omittedIssueCount;
    /** 通过现有 RPC details 字段传给 Renderer 的安全错误载荷。 */
    details;
    constructor(kind, message, details = {}) {
        super(message, ...(details.cause === undefined ? [] : [{ cause: details.cause }]));
        this.name = "ConversationShareServiceError";
        this.kind = kind;
        const requestId = details.requestId?.trim();
        if (requestId && /^[A-Za-z0-9._:-]{1,128}$/u.test(requestId)) {
            this.requestId = requestId;
        }
        if (Number.isSafeInteger(details.status))
            this.status = details.status;
        if (Number.isSafeInteger(details.code))
            this.code = details.code;
        this.reasonCode = details.reasonCode ?? inferFailureReasonCode(message);
        const diagnostics = sanitizeFailureDiagnostics(details.diagnostics);
        if (diagnostics) {
            this.diagnostics = diagnostics;
        }
        const sanitized = sanitizeConversationShareIssues(details.issues ?? []);
        this.issueCount = sanitized.issueCount;
        this.omittedIssueCount = sanitized.omittedIssueCount;
        if (sanitized.issues.length > 0) {
            this.issues = sanitized.issues;
        }
        const safeDetails = {
            ...(this.requestId === undefined ? {} : { requestId: this.requestId }),
            ...(this.status === undefined ? {} : { status: this.status }),
            ...(this.code === undefined ? {} : { code: this.code }),
            reasonCode: this.reasonCode,
            ...(this.diagnostics === undefined ? {} : { diagnostics: this.diagnostics }),
            ...(this.issues === undefined ? {} : { issues: this.issues }),
            ...(this.issueCount > 0 ? { issueCount: this.issueCount } : {}),
            ...(this.issueCount > 0 ? { omittedIssueCount: this.omittedIssueCount } : {}),
        };
        if (Object.keys(safeDetails).length > 0) {
            this.details = safeDetails;
        }
    }
}
export const IConversationShareService = createServiceDescriptor(ServiceChannels.ConversationShare);
/**
 * 分享能力不可用时的统一门禁实现。
 *
 * 每个不支持分享的宿主（desktop-attached remote、server remote 等）都要拒绝全部
 * 写操作并返回空事件流。手写会让 IConversationShareService 新增方法时漏改某个宿主，
 * 所以由这里集中生成。
 */
export function createUnsupportedConversationShareService(options) {
    const reject = (action) => async () => {
        options.onRejected?.(action);
        throw new ConversationShareServiceError("feature_disabled", options.message);
    };
    const noEvents = () => RpcEvent.None;
    return {
        getCapabilities: reject("getCapabilities"),
        preflight: reject("preflight"),
        publish: reject("publish"),
        onDynamicPublishProgress: noEvents,
        importShare: reject("importShare"),
        onDynamicImportProgress: noEvents,
        // 只读查询：不可用环境下返回 null 而不是抛错，会话里就是不渲染只读块。
        getImportedConversation: async () => null,
        getPreview: reject("getPreview"),
        getContinuation: reject("getContinuation"),
    };
}
//# sourceMappingURL=conversationShare.js.map