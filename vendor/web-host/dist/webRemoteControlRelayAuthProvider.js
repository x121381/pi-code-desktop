"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBrowserWebRemoteControlProof = calculateBrowserWebRemoteControlProof;
exports.createBrowserWebRemoteControlRelayAuthProvider = createBrowserWebRemoteControlRelayAuthProvider;
function base64UrlNoPadding(bytes) {
    const base64 = btoa(String.fromCharCode(...bytes));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function calculateBrowserWebRemoteControlProof(passHash, nonce, role, deviceSid) {
    const encoder = new TextEncoder();
    const key = await globalThis.crypto.subtle.importKey("raw", encoder.encode(passHash), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(`${nonce}|${role}|${deviceSid}`));
    return base64UrlNoPadding(new Uint8Array(signature));
}
function createBrowserWebRemoteControlRelayAuthProvider() {
    return {
        calculateProof: calculateBrowserWebRemoteControlProof,
    };
}
//# sourceMappingURL=webRemoteControlRelayAuthProvider.js.map