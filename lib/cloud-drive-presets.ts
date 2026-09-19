export const NUTSTORE_DAV_URL = "https://dav.jianguoyun.com/dav/";

export const CLOUD_ACCOUNT_PROVIDERS = [
  "github",
  "nutstore",
  "nextcloud",
  "feishu",
  "drive123",
  "baidu",
  "aliyun",
] as const;

export type CloudAccountProvider = (typeof CLOUD_ACCOUNT_PROVIDERS)[number];

export const CLOUD_ACCOUNT_OAUTH_PROVIDERS = ["github", "nutstore", "nextcloud", "feishu"] as const;
export const CLOUD_ACCOUNT_UNAVAILABLE_PROVIDERS = ["drive123", "baidu", "aliyun"] as const;

export type CloudAccountOauthProvider = (typeof CLOUD_ACCOUNT_OAUTH_PROVIDERS)[number];
export type CloudAccountUnavailableProvider = (typeof CLOUD_ACCOUNT_UNAVAILABLE_PROVIDERS)[number];

export function isCloudAccountProvider(value: unknown): value is CloudAccountProvider {
  return typeof value === "string"
    && (CLOUD_ACCOUNT_PROVIDERS as readonly string[]).includes(value);
}

export function isUnavailableCloudProvider(value: unknown): value is CloudAccountUnavailableProvider {
  return typeof value === "string"
    && (CLOUD_ACCOUNT_UNAVAILABLE_PROVIDERS as readonly string[]).includes(value);
}

export function nutstoreFolderUrl(): string {
  return NUTSTORE_DAV_URL;
}
