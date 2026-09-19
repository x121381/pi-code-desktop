import { chmodSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import lockfile from "proper-lockfile";
import { writePrivateFileAtomicSync } from "@/lib/atomic-file";
import { userHome } from "@/lib/user-home";

export const CLOUD_DESTINATIONS = ["github", "webdav", "feishu"] as const;
export type CloudDestination = (typeof CLOUD_DESTINATIONS)[number];
export type FeishuMode = "webhook" | "bot";
export type FeishuReceiveIdType = "open_id" | "user_id" | "union_id" | "email" | "chat_id";

export type GitHubAuthMode = "account" | "token";

export interface GitHubCloudConfig {
  token?: string;
  public?: boolean;
  login?: string;
  authMode?: GitHubAuthMode;
}

export interface WebDavCloudConfig {
  url?: string;
  username?: string;
  password?: string;
}

export interface FeishuCloudConfig {
  mode?: FeishuMode;
  webhookUrl?: string;
  appId?: string;
  appSecret?: string;
  receiveId?: string;
  receiveIdType?: FeishuReceiveIdType;
}

export interface CloudChatStore {
  version: 1;
  github?: GitHubCloudConfig;
  webdav?: WebDavCloudConfig;
  feishu?: FeishuCloudConfig;
}

export interface CloudChatStatus {
  github: { configured: boolean; public: boolean; login?: string; authMode: GitHubAuthMode };
  webdav: { configured: boolean; url?: string; username?: string };
  feishu: { configured: boolean; mode: FeishuMode };
}

const FEISHU_RECEIVE_ID_TYPES = new Set<FeishuReceiveIdType>([
  "open_id",
  "user_id",
  "union_id",
  "email",
  "chat_id",
]);

function emptyStore(): CloudChatStore {
  return { version: 1 };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function parseGitHubAuthMode(value: unknown): GitHubAuthMode | undefined {
  return value === "account" || value === "token" ? value : undefined;
}

function parseFeishuMode(value: unknown): FeishuMode | undefined {
  return value === "webhook" || value === "bot" ? value : undefined;
}

function parseReceiveIdType(value: unknown): FeishuReceiveIdType | undefined {
  return typeof value === "string" && FEISHU_RECEIVE_ID_TYPES.has(value as FeishuReceiveIdType)
    ? value as FeishuReceiveIdType
    : undefined;
}

export function isCloudDestination(value: unknown): value is CloudDestination {
  return typeof value === "string" && (CLOUD_DESTINATIONS as readonly string[]).includes(value);
}

export function cloudChatStorePath(): string {
  return join(userHome(), ".pi", "agent", "cloud-chat.json");
}

function parseStore(value: unknown): CloudChatStore {
  if (!isRecord(value)) return emptyStore();
  const github = isRecord(value.github) ? {
    token: optionalString(value.github.token),
    public: optionalBoolean(value.github.public),
    login: optionalString(value.github.login),
    authMode: parseGitHubAuthMode(value.github.authMode),
  } : undefined;
  const webdav = isRecord(value.webdav) ? {
    url: optionalString(value.webdav.url),
    username: optionalString(value.webdav.username),
    password: optionalString(value.webdav.password),
  } : undefined;
  const feishu = isRecord(value.feishu) ? {
    mode: parseFeishuMode(value.feishu.mode),
    webhookUrl: optionalString(value.feishu.webhookUrl),
    appId: optionalString(value.feishu.appId),
    appSecret: optionalString(value.feishu.appSecret),
    receiveId: optionalString(value.feishu.receiveId),
    receiveIdType: parseReceiveIdType(value.feishu.receiveIdType),
  } : undefined;
  return {
    version: 1,
    ...(github ? { github } : {}),
    ...(webdav ? { webdav } : {}),
    ...(feishu ? { feishu } : {}),
  };
}

function readStoreUnlocked(path: string): CloudChatStore {
  if (!existsSync(path)) return emptyStore();
  try {
    return parseStore(JSON.parse(readFileSync(path, "utf8")));
  } catch {
    return emptyStore();
  }
}

function writeStoreUnlocked(path: string, store: CloudChatStore): void {
  const parent = dirname(path);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true, mode: 0o700 });
  writePrivateFileAtomicSync(path, `${JSON.stringify(store, null, 2)}\n`);
  chmodSync(path, 0o600);
}

async function withStoreLock<T>(path: string, update: (store: CloudChatStore) => T): Promise<T> {
  const parent = dirname(path);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true, mode: 0o700 });
  if (!existsSync(path)) writeStoreUnlocked(path, emptyStore());

  let lockCompromisedError: Error | undefined;
  const release = await lockfile.lock(path, {
    retries: {
      retries: 10,
      factor: 2,
      minTimeout: 100,
      maxTimeout: 10_000,
      randomize: true,
    },
    stale: 30_000,
    onCompromised: (error) => {
      lockCompromisedError = error;
    },
  });
  try {
    if (lockCompromisedError) throw lockCompromisedError;
    const result = update(readStoreUnlocked(path));
    if (lockCompromisedError) throw lockCompromisedError;
    return result;
  } finally {
    try {
      await release();
    } catch {
      // The compromised-lock error above is more useful than an unlock error.
    }
  }
}

export function githubConfigured(config: GitHubCloudConfig | undefined): boolean {
  return Boolean(config?.token);
}

export function webdavConfigured(config: WebDavCloudConfig | undefined): boolean {
  return Boolean(config?.url && config.username && config.password);
}

export function feishuConfigured(config: FeishuCloudConfig | undefined): boolean {
  if (!config) return false;
  if ((config.mode ?? "webhook") === "bot") {
    return Boolean(config.appId && config.appSecret && config.receiveId);
  }
  return Boolean(config.webhookUrl);
}

export function redactCloudChatStore(store: CloudChatStore): CloudChatStatus {
  return {
    github: {
      configured: githubConfigured(store.github),
      public: Boolean(store.github?.public),
      authMode: store.github?.authMode ?? (store.github?.login ? "account" : "token"),
      ...(store.github?.login ? { login: store.github.login } : {}),
    },
    webdav: {
      configured: webdavConfigured(store.webdav),
      ...(store.webdav?.url ? { url: store.webdav.url } : {}),
      ...(store.webdav?.username ? { username: store.webdav.username } : {}),
    },
    feishu: {
      configured: feishuConfigured(store.feishu),
      mode: store.feishu?.mode ?? "webhook",
    },
  };
}

export async function readCloudChatStore(path = cloudChatStorePath()): Promise<CloudChatStore> {
  return withStoreLock(path, (store) => store);
}

export async function readCloudChatStatus(path = cloudChatStorePath()): Promise<CloudChatStatus> {
  return redactCloudChatStore(await readCloudChatStore(path));
}

function mergeSecret(next: string | undefined, previous: string | undefined): string | undefined {
  return next === undefined ? previous : next || undefined;
}

export function applyCloudChatPatch(store: CloudChatStore, patch: Partial<CloudChatStore>): CloudChatStore {
  const next: CloudChatStore = { version: 1 };
  if (patch.github !== undefined) {
    if (patch.github === null as unknown) {
      // ignore
    } else {
      next.github = {
        token: mergeSecret(patch.github.token, store.github?.token),
        public: patch.github.public ?? store.github?.public,
        login: patch.github.login === undefined ? store.github?.login : (patch.github.login || undefined),
        authMode: patch.github.authMode ?? store.github?.authMode,
      };
    }
  } else if (store.github) {
    next.github = store.github;
  }
  if (patch.webdav !== undefined) {
    next.webdav = {
      url: patch.webdav.url ?? store.webdav?.url,
      username: patch.webdav.username ?? store.webdav?.username,
      password: mergeSecret(patch.webdav.password, store.webdav?.password),
    };
  } else if (store.webdav) {
    next.webdav = store.webdav;
  }
  if (patch.feishu !== undefined) {
    next.feishu = {
      mode: patch.feishu.mode ?? store.feishu?.mode,
      webhookUrl: mergeSecret(patch.feishu.webhookUrl, store.feishu?.webhookUrl),
      appId: patch.feishu.appId ?? store.feishu?.appId,
      appSecret: mergeSecret(patch.feishu.appSecret, store.feishu?.appSecret),
      receiveId: patch.feishu.receiveId ?? store.feishu?.receiveId,
      receiveIdType: patch.feishu.receiveIdType ?? store.feishu?.receiveIdType,
    };
  } else if (store.feishu) {
    next.feishu = store.feishu;
  }
  return next;
}

export async function updateCloudChatStore(
  patch: Partial<CloudChatStore>,
  path = cloudChatStorePath(),
): Promise<CloudChatStatus> {
  return withStoreLock(path, (store) => {
    const next = applyCloudChatPatch(store, patch);
    writeStoreUnlocked(path, next);
    return redactCloudChatStore(next);
  });
}

export async function clearCloudChatDestination(
  destination: CloudDestination,
  path = cloudChatStorePath(),
): Promise<CloudChatStatus> {
  return withStoreLock(path, (store) => {
    const next: CloudChatStore = { ...store };
    delete next[destination];
    writeStoreUnlocked(path, next);
    return redactCloudChatStore(next);
  });
}
