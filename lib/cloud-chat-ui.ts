export function cloudChatErrorKey(code: string | undefined): string {
  switch (code) {
    case "SESSION_NOT_FOUND": return "cloud.errorSessionNotFound";
    case "MISSING_CREDENTIALS": return "cloud.errorMissingCredentials";
    case "INVALID_CREDENTIALS": return "cloud.errorInvalidCredentials";
    case "UPSTREAM_AUTH_FAILED": return "cloud.errorUpstreamAuth";
    case "UPSTREAM_HTML_RESPONSE":
    case "UPSTREAM_CHALLENGE": return "cloud.errorUpstreamHtml";
    case "UPSTREAM_UNAVAILABLE":
    case "UPSTREAM_RESPONSE_TOO_LARGE":
    case "UPSTREAM_REDIRECT_BLOCKED":
    case "UPSTREAM_ERROR": return "cloud.errorUpstream";
    case "UNTRUSTED_REQUEST": return "cloud.errorUntrusted";
    case "GITHUB_CLIENT_MISSING": return "cloud.errorGithubClient";
    case "GITHUB_DEVICE_PENDING": return "cloud.githubWaiting";
    case "GITHUB_DEVICE_EXPIRED": return "cloud.errorGithubExpired";
    case "GITHUB_DEVICE_DENIED": return "cloud.errorGithubDenied";
    case "WEBDAV_LOGIN_UNSUPPORTED": return "cloud.errorWebdavLogin";
    case "WEBDAV_LOGIN_PENDING": return "cloud.webdavWaiting";
    case "WEBDAV_LOGIN_EXPIRED": return "cloud.errorWebdavExpired";
    default: return "cloud.error";
  }
}

/** Only http(s) URLs without embedded credentials may be shown as a published link. */
export function safePublishedCloudUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value);
    if ((url.protocol !== "http:" && url.protocol !== "https:") || url.username || url.password) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}
