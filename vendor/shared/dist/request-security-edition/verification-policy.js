export const requestVerificationReasons = ["model-request"];
export const requestVerificationTimeoutMessage = "Provider runtime headers request timed out. Please send your message again.";
export const REQUEST_VERIFICATION_REQUIRED = "request_verification_unavailable";
export function readRequestVerificationConfig(_configs) {
    return null;
}
export function requestVerificationClaimHeaders(_proof) {
    return {};
}
export function withoutRequestVerificationHeaders(headers) {
    return { ...headers };
}
export function allowRequestVerificationHeaders(_headers) {
    return {};
}
export function requiresRequestVerification(_access) {
    return false;
}
export function isRequestVerificationMessage(_message) {
    return false;
}
export function summarizeRequestVerificationHeaders(_headers) {
    return {};
}
export function requestVerificationDiagnostics(_input) {
    return {};
}
export const requestVerificationInteractionAvailable = false;
//# sourceMappingURL=verification-policy.js.map