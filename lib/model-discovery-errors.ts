const ERROR_KEYS: Record<string, string> = {
  INVALID_BASE_URL: "models.discoveryErrorInvalidUrl",
  API_KEY_UNAVAILABLE: "models.discoveryErrorKeyUnavailable",
  UPSTREAM_AUTH_FAILED: "models.discoveryErrorAuth",
  UPSTREAM_RATE_LIMITED: "models.discoveryErrorRateLimited",
  UPSTREAM_UNAVAILABLE: "models.discoveryErrorUnavailable",
  UPSTREAM_HTTP_ERROR: "models.discoveryErrorRequestFailed",
  UPSTREAM_TIMEOUT: "models.discoveryErrorTimeout",
  UPSTREAM_REDIRECT_BLOCKED: "models.discoveryErrorRedirectBlocked",
  UPSTREAM_TOO_MANY_REDIRECTS: "models.discoveryErrorTooManyRedirects",
  UPSTREAM_CHALLENGE: "models.discoveryErrorChallenge",
  UPSTREAM_HTML_RESPONSE: "models.discoveryErrorHtmlResponse",
  UPSTREAM_NOT_JSON: "models.discoveryErrorNotJson",
  UPSTREAM_INVALID_JSON: "models.discoveryErrorInvalidJson",
  UPSTREAM_RESPONSE_TOO_LARGE: "models.discoveryErrorResponseTooLarge",
  NO_MODELS_FOUND: "models.discoveryErrorNoModels",
  REQUEST_TOO_LARGE: "models.discoveryErrorRequestTooLarge",
};

export function modelDiscoveryErrorKey(code: unknown): string {
  return typeof code === "string" && ERROR_KEYS[code]
    ? ERROR_KEYS[code]
    : "models.discoveryErrorFailed";
}
