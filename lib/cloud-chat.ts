import { getSessionEntries, resolveSessionPath } from "@/lib/session-reader";
import type { AgentMessage, SessionEntry } from "@/lib/types";
import {
  feishuConfigured,
  githubConfigured,
  readCloudChatStore,
  updateCloudChatStore,
  webdavConfigured,
  type CloudDestination,
  type CloudChatStore,
  type FeishuMode,
  type FeishuReceiveIdType,
} from "@/lib/cloud-chat-store";
import { cloudChatErrorKey, safePublishedCloudUrl } from "@/lib/cloud-chat-ui";

export { cloudChatErrorKey, safePublishedCloudUrl };

export const MAX_CLOUD_CHAT_MARKDOWN_BYTES = 512 * 1024;
const MAX_UPSTREAM_RESPONSE_BYTES = 256 * 1024;
const UPSTREAM_TIMEOUT_MS = 20_000;
const MAX_REDIRECTS = 5;
const GITHUB_DEVICE_SCOPE = "gist read:user";

function githubOAuthClientId(): string {
  return process.env.PI_GITHUB_CLIENT_ID?.trim() || "";
}

export class CloudChatError extends Error {
  constructor(
    public readonly code:
      | "SESSION_NOT_FOUND"
      | "MISSING_CREDENTIALS"
      | "INVALID_CREDENTIALS"
      | "INVALID_DESTINATION"
      | "UPSTREAM_AUTH_FAILED"
      | "UPSTREAM_HTML_RESPONSE"
      | "UPSTREAM_CHALLENGE"
      | "UPSTREAM_UNAVAILABLE"
      | "UPSTREAM_RESPONSE_TOO_LARGE"
      | "UPSTREAM_REDIRECT_BLOCKED"
      | "UPSTREAM_ERROR"
      | "GITHUB_CLIENT_MISSING"
      | "GITHUB_DEVICE_PENDING"
      | "GITHUB_DEVICE_EXPIRED"
      | "GITHUB_DEVICE_DENIED"
      | "WEBDAV_LOGIN_UNSUPPORTED"
      | "WEBDAV_LOGIN_PENDING"
      | "WEBDAV_LOGIN_EXPIRED",
    public readonly status = 400,
  ) {
    super(code);
    this.name = "CloudChatError";
  }
}

export interface CloudChatDocument {
  title: string;
  markdown: string;
  filename: string;
}

export interface CloudPublishResult {
  destination: CloudDestination;
  url?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJsonMediaType(response: Response): boolean {
  const mediaType = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  return mediaType === "application/json"
    || Boolean(mediaType?.startsWith("application/") && mediaType.endsWith("+json"));
}

function isHtmlMediaType(response: Response): boolean {
  const mediaType = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  return mediaType === "text/html" || mediaType === "application/xhtml+xml";
}

function sanitizeTitle(value: string): string {
  const cleaned = value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.slice(0, 80) || "Untitled chat";
}

function contentToText(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content.map((block) => {
    if (!isRecord(block)) return "";
    if (block.type === "text" && typeof block.text === "string") return block.text;
    if (block.type === "thinking" && typeof block.thinking === "string") return block.thinking;
    if (block.type === "image") return "[image]";
    if (block.type === "toolCall") {
      const name = typeof block.toolName === "string" ? block.toolName : "tool";
      return `[tool ${name}]`;
    }
    return "";
  }).filter(Boolean).join("\n\n");
}

function messageToMarkdown(message: AgentMessage): string | null {
  if (message.role === "user") {
    const text = contentToText(message.content).trim();
    return text ? `### User\n\n${text}` : null;
  }
  if (message.role === "assistant") {
    const text = contentToText(message.content).trim();
    return text ? `### Assistant\n\n${text}` : null;
  }
  if (message.role === "custom") {
    const text = contentToText(message.content).trim();
    return text ? `### Note\n\n${text}` : null;
  }
  if (message.role === "bashExecution") {
    const output = message.output?.trim() ? `\n\n\`\`\`\n${message.output.trim()}\n\`\`\`` : "";
    return `### Command\n\n\`\`\`\n${message.command}\n\`\`\`${output}`;
  }
  return null;
}

function entryToMarkdown(entry: SessionEntry): string | null {
  if (entry.type === "message") return messageToMarkdown(entry.message);
  if (entry.type === "custom_message") {
    const text = contentToText(entry.content).trim();
    return text ? `### Note\n\n${text}` : null;
  }
  if (entry.type === "compaction") {
    const summary = entry.summary.trim();
    return summary ? `### Compaction\n\n${summary}` : null;
  }
  return null;
}

export function buildCloudChatDocument(
  sessionId: string,
  entries: SessionEntry[],
  options: { name?: string | null; firstMessage?: string | null } = {},
): CloudChatDocument {
  const firstUser = entries.find((entry) => entry.type === "message" && entry.message.role === "user");
  const firstText = firstUser && firstUser.type === "message" && firstUser.message.role === "user"
    ? contentToText(firstUser.message.content).trim()
    : (options.firstMessage ?? "");
  const title = sanitizeTitle(options.name || firstText.split("\n")[0] || sessionId);
  const sections = entries.map(entryToMarkdown).filter((section): section is string => Boolean(section));
  let markdown = `# ${title}\n\n_Session ${sessionId}_\n\n${sections.join("\n\n")}\n`;
  const bytes = Buffer.byteLength(markdown, "utf8");
  if (bytes > MAX_CLOUD_CHAT_MARKDOWN_BYTES) {
    markdown = `${markdown.slice(0, Math.max(0, MAX_CLOUD_CHAT_MARKDOWN_BYTES - 80))}\n\n_Truncated to keep the export within size limits._\n`;
  }
  const filename = `pi-chat-${sessionId.replace(/[^A-Za-z0-9._-]+/g, "-").slice(0, 48)}.md`;
  return { title, markdown, filename };
}

async function loadCloudChatDocument(sessionId: string): Promise<CloudChatDocument> {
  const filePath = await resolveSessionPath(sessionId);
  if (!filePath) throw new CloudChatError("SESSION_NOT_FOUND", 404);
  return buildCloudChatDocument(sessionId, getSessionEntries(filePath));
}

function parseHttpUrl(value: string, allowDav = false): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new CloudChatError("INVALID_CREDENTIALS", 400);
  }
  const allowed = allowDav
    ? url.protocol === "http:" || url.protocol === "https:" || url.protocol === "webdav:" || url.protocol === "webdavs:"
    : url.protocol === "http:" || url.protocol === "https:";
  if (!allowed || url.username || url.password) {
    throw new CloudChatError("INVALID_CREDENTIALS", 400);
  }
  if (url.protocol === "webdav:") url.protocol = "http:";
  if (url.protocol === "webdavs:") url.protocol = "https:";
  return url;
}

function isRedirectStatus(status: number): boolean {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}

function validateRedirect(current: URL, location: string): URL {
  let next: URL;
  try {
    next = new URL(location, current);
  } catch {
    throw new CloudChatError("UPSTREAM_REDIRECT_BLOCKED", 502);
  }
  if (
    next.origin !== current.origin
    || (next.protocol !== "http:" && next.protocol !== "https:")
    || next.username
    || next.password
  ) {
    throw new CloudChatError("UPSTREAM_REDIRECT_BLOCKED", 502);
  }
  return next;
}

async function cancelBody(response: Response): Promise<void> {
  await response.body?.cancel().catch(() => undefined);
}

async function readResponseBytes(response: Response, maxBytes: number): Promise<Uint8Array> {
  const contentLength = response.headers.get("content-length");
  if (contentLength && /^\d+$/.test(contentLength) && Number(contentLength) > maxBytes) {
    await cancelBody(response);
    throw new CloudChatError("UPSTREAM_RESPONSE_TOO_LARGE", 502);
  }
  const reader = response.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (size + value.byteLength > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new CloudChatError("UPSTREAM_RESPONSE_TOO_LARGE", 502);
      }
      chunks.push(value);
      size += value.byteLength;
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function errorForStatus(response: Response): CloudChatError {
  if (response.headers.get("cf-mitigated")?.toLowerCase() === "challenge") {
    return new CloudChatError("UPSTREAM_CHALLENGE", 502);
  }
  if (response.status === 401 || response.status === 403) {
    return new CloudChatError("UPSTREAM_AUTH_FAILED", 502);
  }
  if (response.status >= 500) return new CloudChatError("UPSTREAM_UNAVAILABLE", 502);
  return new CloudChatError("UPSTREAM_ERROR", 502);
}

async function fetchUpstream(
  initialUrl: URL,
  init: RequestInit,
  fetchImpl: typeof fetch,
  options: { allowClientErrors?: boolean } = {},
): Promise<{ response: Response; body: Uint8Array }> {
  const signal = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);
  let url = new URL(initialUrl);
  for (let redirects = 0; ; redirects += 1) {
    const response = await fetchImpl(url, { ...init, cache: "no-store", redirect: "manual", signal });
    if (isRedirectStatus(response.status)) {
      await cancelBody(response);
      if (redirects >= MAX_REDIRECTS) throw new CloudChatError("UPSTREAM_REDIRECT_BLOCKED", 502);
      const location = response.headers.get("location");
      if (!location) throw new CloudChatError("UPSTREAM_REDIRECT_BLOCKED", 502);
      url = validateRedirect(url, location);
      continue;
    }
    const body = await readResponseBytes(response, MAX_UPSTREAM_RESPONSE_BYTES);
    if (isHtmlMediaType(response) || response.headers.get("cf-mitigated")?.toLowerCase() === "challenge") {
      throw new CloudChatError(response.headers.get("cf-mitigated")?.toLowerCase() === "challenge" ? "UPSTREAM_CHALLENGE" : "UPSTREAM_HTML_RESPONSE", 502);
    }
    if (!response.ok && !(options.allowClientErrors && response.status >= 400 && response.status < 500)) {
      throw errorForStatus(response);
    }
    return { response, body };
  }
}

function decodeJson(bytes: Uint8Array): unknown {
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    throw new CloudChatError("UPSTREAM_ERROR", 502);
  }
}

export interface GitHubDeviceStart {
  loginId: string;
  userCode: string;
  verificationUri: string;
  expiresInSeconds: number;
  intervalSeconds: number;
}

const githubDeviceLogins = new Map<string, { deviceCode: string; expiresAt: number }>();

function pruneGitHubDeviceLogins(now = Date.now()): void {
  for (const [id, pending] of githubDeviceLogins) {
    if (pending.expiresAt <= now) githubDeviceLogins.delete(id);
  }
}

export interface GitHubAccountLink {
  login: string;
  authMode: "account";
}

function githubDeviceHeaders(): Record<string, string> {
  return {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "pi-code-desktop",
  };
}

function parseDevicePayload(payload: unknown): Record<string, unknown> {
  if (!isRecord(payload)) throw new CloudChatError("UPSTREAM_ERROR", 502);
  return payload;
}

function rememberGitHubDeviceLogin(deviceCode: string, expiresInSeconds: number): string {
  pruneGitHubDeviceLogins();
  const loginId = crypto.randomUUID();
  githubDeviceLogins.set(loginId, {
    deviceCode,
    expiresAt: Date.now() + Math.max(30, expiresInSeconds) * 1000,
  });
  return loginId;
}

export async function startGitHubDeviceLogin(
  fetchImpl: typeof fetch = fetch,
): Promise<GitHubDeviceStart> {
  const clientId = githubOAuthClientId();
  if (!clientId) throw new CloudChatError("GITHUB_CLIENT_MISSING", 500);
  const { response, body } = await fetchUpstream(new URL("https://github.com/login/device/code"), {
    method: "POST",
    headers: githubDeviceHeaders(),
    body: new URLSearchParams({
      client_id: clientId,
      scope: GITHUB_DEVICE_SCOPE,
    }).toString(),
  }, fetchImpl);
  const asText = new TextDecoder().decode(body);
  const payload = isJsonMediaType(response)
    ? parseDevicePayload(decodeJson(body))
    : Object.fromEntries(new URLSearchParams(asText).entries());
  const userCode = typeof payload.user_code === "string" ? payload.user_code : "";
  const deviceCode = typeof payload.device_code === "string" ? payload.device_code : "";
  const verificationUri = safePublishedCloudUrl(payload.verification_uri ?? payload.verification_uri_complete);
  const expiresIn = Number(payload.expires_in ?? 900);
  const interval = Number(payload.interval ?? 5);
  if (!userCode || !deviceCode || !verificationUri) throw new CloudChatError("UPSTREAM_ERROR", 502);
  const expiresInSeconds = Number.isFinite(expiresIn) ? expiresIn : 900;
  return {
    loginId: rememberGitHubDeviceLogin(deviceCode, expiresInSeconds),
    userCode,
    verificationUri,
    expiresInSeconds,
    intervalSeconds: Number.isFinite(interval) ? Math.max(5, interval) : 5,
  };
}

export async function pollGitHubDeviceLogin(
  loginId: string,
  fetchImpl: typeof fetch = fetch,
  storePath?: string,
): Promise<GitHubAccountLink | { pending: true; intervalSeconds?: number }> {
  const clientId = githubOAuthClientId();
  if (!clientId) throw new CloudChatError("GITHUB_CLIENT_MISSING", 500);
  pruneGitHubDeviceLogins();
  const pendingLogin = githubDeviceLogins.get(loginId.trim());
  if (!pendingLogin) throw new CloudChatError("GITHUB_DEVICE_EXPIRED", 400);
  const { response, body } = await fetchUpstream(new URL("https://github.com/login/oauth/access_token"), {
    method: "POST",
    headers: githubDeviceHeaders(),
    body: new URLSearchParams({
      client_id: clientId,
      device_code: pendingLogin.deviceCode,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    }).toString(),
  }, fetchImpl, { allowClientErrors: true });
  const payload = isJsonMediaType(response)
    ? parseDevicePayload(decodeJson(body))
    : Object.fromEntries(new URLSearchParams(new TextDecoder().decode(body)).entries());
  const error = typeof payload.error === "string" ? payload.error : "";
  if (error === "authorization_pending" || error === "slow_down") {
    const interval = Number(payload.interval);
    return { pending: true, ...(Number.isFinite(interval) ? { intervalSeconds: Math.max(5, interval) } : {}) };
  }
  githubDeviceLogins.delete(loginId);
  if (error === "expired_token") throw new CloudChatError("GITHUB_DEVICE_EXPIRED", 400);
  if (error === "access_denied") throw new CloudChatError("GITHUB_DEVICE_DENIED", 400);
  if (error) throw new CloudChatError("UPSTREAM_AUTH_FAILED", 502);
  const token = typeof payload.access_token === "string" ? payload.access_token.trim() : "";
  if (!token) throw new CloudChatError("UPSTREAM_AUTH_FAILED", 502);
  const user = await fetchUpstream(new URL("https://api.github.com/user"), {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "pi-code-desktop",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  }, fetchImpl);
  const profile = decodeJson(user.body);
  const login = isRecord(profile) && typeof profile.login === "string" ? profile.login.trim() : "";
  if (!login) throw new CloudChatError("UPSTREAM_ERROR", 502);
  await updateCloudChatStore({ github: { token, login, authMode: "account" } }, storePath);
  return { login, authMode: "account" };
}

export interface WebDavLoginStart {
  loginId: string;
  loginUrl: string;
  expiresInSeconds: number;
  intervalSeconds: number;
}

export interface WebDavAccountLink {
  username: string;
  url: string;
}

const webdavAccountLogins = new Map<string, {
  pollUrl: string;
  token: string;
  folderUrl: string;
  expiresAt: number;
}>();

function pruneWebDavAccountLogins(now = Date.now()): void {
  for (const [id, pending] of webdavAccountLogins) {
    if (pending.expiresAt <= now) webdavAccountLogins.delete(id);
  }
}

function rememberWebDavAccountLogin(
  pollUrl: string,
  token: string,
  folderUrl: string,
): string {
  pruneWebDavAccountLogins();
  const loginId = crypto.randomUUID();
  webdavAccountLogins.set(loginId, {
    pollUrl,
    token,
    folderUrl,
    expiresAt: Date.now() + 20 * 60 * 1000,
  });
  return loginId;
}

function nextcloudLoginEndpoint(origin: string): URL {
  return new URL("/index.php/login/v2", `${origin}/`);
}

export async function startWebDavAccountLogin(
  folderUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<WebDavLoginStart> {
  const folder = parseHttpUrl(folderUrl, true);
  let response: Response;
  let body: Uint8Array;
  try {
    ({ response, body } = await fetchUpstream(nextcloudLoginEndpoint(folder.origin), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "User-Agent": "pi-code-desktop",
        "OCS-APIRequest": "true",
      },
    }, fetchImpl, { allowClientErrors: true }));
  } catch (error) {
    if (
      error instanceof CloudChatError
      && (error.code === "UPSTREAM_HTML_RESPONSE" || error.code === "UPSTREAM_CHALLENGE")
    ) {
      throw new CloudChatError("WEBDAV_LOGIN_UNSUPPORTED", 400);
    }
    throw error;
  }
  if (response.status === 404 || response.status === 405 || response.status === 400) {
    throw new CloudChatError("WEBDAV_LOGIN_UNSUPPORTED", 400);
  }
  if (!response.ok) throw errorForStatus(response);
  const payload = parseDevicePayload(decodeJson(body));
  const poll = isRecord(payload.poll) ? payload.poll : null;
  const loginUrl = safePublishedCloudUrl(payload.login);
  const pollToken = poll && typeof poll.token === "string" ? poll.token.trim() : "";
  const pollEndpoint = poll && typeof poll.endpoint === "string" ? safePublishedCloudUrl(poll.endpoint) : null;
  if (!loginUrl || !pollToken || !pollEndpoint) throw new CloudChatError("UPSTREAM_ERROR", 502);
  return {
    loginId: rememberWebDavAccountLogin(pollEndpoint, pollToken, folder.href),
    loginUrl,
    expiresInSeconds: 1200,
    intervalSeconds: 5,
  };
}

export async function pollWebDavAccountLogin(
  loginId: string,
  fetchImpl: typeof fetch = fetch,
  storePath?: string,
): Promise<WebDavAccountLink | { pending: true; intervalSeconds?: number }> {
  pruneWebDavAccountLogins();
  const pendingLogin = webdavAccountLogins.get(loginId.trim());
  if (!pendingLogin) throw new CloudChatError("WEBDAV_LOGIN_EXPIRED", 400);
  const { response, body } = await fetchUpstream(new URL(pendingLogin.pollUrl), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "pi-code-desktop",
    },
    body: new URLSearchParams({ token: pendingLogin.token }).toString(),
  }, fetchImpl, { allowClientErrors: true });
  if (response.status === 404) {
    return { pending: true, intervalSeconds: 5 };
  }
  if (!response.ok) throw errorForStatus(response);
  const payload = parseDevicePayload(decodeJson(body));
  const loginName = typeof payload.loginName === "string" ? payload.loginName.trim() : "";
  const appPassword = typeof payload.appPassword === "string" ? payload.appPassword.trim() : "";
  const server = typeof payload.server === "string" ? payload.server.trim() : "";
  if (!loginName || !appPassword) {
    return { pending: true, intervalSeconds: 5 };
  }
  webdavAccountLogins.delete(loginId);
  const folderUrl = pendingLogin.folderUrl || (server
    ? `${server.replace(/\/+$/, "")}/remote.php/dav/files/${encodeURIComponent(loginName)}/`
    : "");
  if (!folderUrl) throw new CloudChatError("UPSTREAM_ERROR", 502);
  await updateCloudChatStore({
    webdav: { url: folderUrl, username: loginName, password: appPassword },
  }, storePath);
  return { username: loginName, url: folderUrl };
}

export async function connectWebDavAccount(
  input: { url: string; username: string; password: string },
  fetchImpl: typeof fetch = fetch,
  storePath?: string,
): Promise<WebDavAccountLink> {
  const folder = parseHttpUrl(input.url, true);
  const username = input.username.trim();
  const password = input.password.trim();
  if (!username || !password) throw new CloudChatError("MISSING_CREDENTIALS", 400);
  const credentials = Buffer.from(`${username}:${password}`, "utf8").toString("base64");
  const { response } = await fetchUpstream(folder, {
    method: "PROPFIND",
    headers: {
      Authorization: `Basic ${credentials}`,
      Depth: "0",
      "Content-Type": "application/xml; charset=utf-8",
      "User-Agent": "pi-code-desktop",
    },
    body: "<?xml version=\"1.0\" encoding=\"utf-8\"?><d:propfind xmlns:d=\"DAV:\"><d:prop><d:current-user-principal/></d:prop></d:propfind>",
  }, fetchImpl, { allowClientErrors: true });
  if (response.status === 401 || response.status === 403) {
    throw new CloudChatError("UPSTREAM_AUTH_FAILED", 502);
  }
  if (!response.ok && response.status !== 207) throw errorForStatus(response);
  await updateCloudChatStore({
    webdav: { url: folder.href, username, password },
  }, storePath);
  return { username, url: folder.href };
}

export async function connectFeishuAccount(
  input: {
    mode: FeishuMode;
    webhookUrl?: string;
    appId?: string;
    appSecret?: string;
    receiveId?: string;
    receiveIdType?: FeishuReceiveIdType;
  },
  fetchImpl: typeof fetch = fetch,
  storePath?: string,
): Promise<{ mode: FeishuMode }> {
  if (input.mode === "bot") {
    const appId = input.appId?.trim() ?? "";
    const appSecret = input.appSecret?.trim() ?? "";
    const receiveId = input.receiveId?.trim() ?? "";
    if (!appId || !appSecret || !receiveId) throw new CloudChatError("MISSING_CREDENTIALS", 400);
    await feishuTenantToken(appId, appSecret, fetchImpl);
    await updateCloudChatStore({
      feishu: {
        mode: "bot",
        appId,
        appSecret,
        receiveId,
        receiveIdType: input.receiveIdType ?? "chat_id",
      },
    }, storePath);
    return { mode: "bot" };
  }
  const webhookUrl = input.webhookUrl?.trim() ?? "";
  if (!webhookUrl) throw new CloudChatError("MISSING_CREDENTIALS", 400);
  const url = parseHttpUrl(webhookUrl);
  const host = url.hostname.toLowerCase();
  if (!host.endsWith("feishu.cn") && !host.endsWith("larksuite.com") && !host.endsWith("feishu.net")) {
    throw new CloudChatError("INVALID_CREDENTIALS", 400);
  }
  await updateCloudChatStore({ feishu: { mode: "webhook", webhookUrl } }, storePath);
  return { mode: "webhook" };
}

function encodeWebDavPath(url: URL, filename: string): URL {
  const next = new URL(url.href);
  const base = next.pathname.endsWith("/") ? next.pathname : `${next.pathname}/`;
  next.pathname = `${base}${encodeURIComponent(filename)}`;
  return next;
}

async function publishGitHub(
  store: CloudChatStore,
  document: CloudChatDocument,
  fetchImpl: typeof fetch,
): Promise<CloudPublishResult> {
  if (!githubConfigured(store.github) || !store.github?.token) {
    throw new CloudChatError("MISSING_CREDENTIALS", 400);
  }
  const { response, body } = await fetchUpstream(new URL("https://api.github.com/gists"), {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${store.github.token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "pi-code-desktop",
    },
    body: JSON.stringify({
      description: document.title,
      public: Boolean(store.github.public),
      files: {
        [document.filename]: { content: document.markdown },
      },
    }),
  }, fetchImpl);
  if (!isJsonMediaType(response)) throw new CloudChatError("UPSTREAM_HTML_RESPONSE", 502);
  const payload = decodeJson(body);
  const url = isRecord(payload) ? safePublishedCloudUrl(payload.html_url) : null;
  return { destination: "github", ...(url ? { url } : {}) };
}

async function publishWebDav(
  store: CloudChatStore,
  document: CloudChatDocument,
  fetchImpl: typeof fetch,
): Promise<CloudPublishResult> {
  if (!webdavConfigured(store.webdav) || !store.webdav?.url || !store.webdav.username || !store.webdav.password) {
    throw new CloudChatError("MISSING_CREDENTIALS", 400);
  }
  const folder = parseHttpUrl(store.webdav.url, true);
  const target = encodeWebDavPath(folder, document.filename);
  const credentials = Buffer.from(`${store.webdav.username}:${store.webdav.password}`, "utf8").toString("base64");
  await fetchUpstream(target, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "text/markdown; charset=utf-8",
    },
    body: document.markdown,
  }, fetchImpl);
  const url = safePublishedCloudUrl(target.href);
  return { destination: "webdav", ...(url ? { url } : {}) };
}

function chunkFeishuText(markdown: string): string[] {
  const limit = 3500;
  if (markdown.length <= limit) return [markdown];
  const chunks: string[] = [];
  for (let offset = 0; offset < markdown.length; offset += limit) {
    chunks.push(markdown.slice(offset, offset + limit));
  }
  return chunks;
}

async function publishFeishuWebhook(
  webhookUrl: string,
  document: CloudChatDocument,
  fetchImpl: typeof fetch,
): Promise<CloudPublishResult> {
  const url = parseHttpUrl(webhookUrl);
  const host = url.hostname.toLowerCase();
  if (!host.endsWith("feishu.cn") && !host.endsWith("larksuite.com") && !host.endsWith("feishu.net")) {
    throw new CloudChatError("INVALID_CREDENTIALS", 400);
  }
  const chunks = chunkFeishuText(`**${document.title}**\n\n${document.markdown}`);
  for (const text of chunks) {
    await fetchUpstream(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ msg_type: "text", content: { text } }),
    }, fetchImpl);
  }
  return { destination: "feishu" };
}

async function feishuTenantToken(appId: string, appSecret: string, fetchImpl: typeof fetch): Promise<string> {
  const { response, body } = await fetchUpstream(new URL("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"), {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  }, fetchImpl);
  if (!isJsonMediaType(response)) throw new CloudChatError("UPSTREAM_HTML_RESPONSE", 502);
  const payload = decodeJson(body);
  const token = isRecord(payload) && typeof payload.tenant_access_token === "string"
    ? payload.tenant_access_token
    : "";
  if (!token) throw new CloudChatError("UPSTREAM_AUTH_FAILED", 502);
  return token;
}

async function publishFeishuBot(
  config: NonNullable<CloudChatStore["feishu"]>,
  document: CloudChatDocument,
  fetchImpl: typeof fetch,
): Promise<CloudPublishResult> {
  if (!config.appId || !config.appSecret || !config.receiveId) {
    throw new CloudChatError("MISSING_CREDENTIALS", 400);
  }
  const token = await feishuTenantToken(config.appId, config.appSecret, fetchImpl);
  const receiveIdType: FeishuReceiveIdType = config.receiveIdType ?? "chat_id";
  const chunks = chunkFeishuText(`**${document.title}**\n\n${document.markdown}`);
  for (const text of chunks) {
    const { response, body } = await fetchUpstream(new URL(`https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=${encodeURIComponent(receiveIdType)}`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        receive_id: config.receiveId,
        msg_type: "text",
        content: JSON.stringify({ text }),
      }),
    }, fetchImpl);
    if (!isJsonMediaType(response)) throw new CloudChatError("UPSTREAM_HTML_RESPONSE", 502);
    const payload = decodeJson(body);
    if (isRecord(payload) && payload.code !== 0 && payload.code !== undefined) {
      throw new CloudChatError("UPSTREAM_ERROR", 502);
    }
  }
  return { destination: "feishu" };
}

export async function publishCloudChat(
  sessionId: string,
  destination: CloudDestination,
  options: {
    fetchImpl?: typeof fetch;
    store?: CloudChatStore;
    document?: CloudChatDocument;
  } = {},
): Promise<CloudPublishResult> {
  if (destination !== "github" && destination !== "webdav" && destination !== "feishu") {
    throw new CloudChatError("INVALID_DESTINATION", 400);
  }
  const store = options.store ?? await readCloudChatStore();
  const document = options.document ?? await loadCloudChatDocument(sessionId);
  const fetchImpl = options.fetchImpl ?? fetch;
  if (destination === "github") return publishGitHub(store, document, fetchImpl);
  if (destination === "webdav") return publishWebDav(store, document, fetchImpl);
  if (!feishuConfigured(store.feishu)) throw new CloudChatError("MISSING_CREDENTIALS", 400);
  if ((store.feishu?.mode ?? "webhook") === "bot") {
    return publishFeishuBot(store.feishu!, document, fetchImpl);
  }
  if (!store.feishu?.webhookUrl) throw new CloudChatError("MISSING_CREDENTIALS", 400);
  return publishFeishuWebhook(store.feishu.webhookUrl, document, fetchImpl);
}

