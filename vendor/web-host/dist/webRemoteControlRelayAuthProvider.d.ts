import type { WebRemoteControlRelayRole } from "@zcode/shared";
export declare function calculateBrowserWebRemoteControlProof(passHash: string, nonce: string, role: WebRemoteControlRelayRole, deviceSid: string): Promise<string>;
export declare function createBrowserWebRemoteControlRelayAuthProvider(): {
    calculateProof: typeof calculateBrowserWebRemoteControlProof;
};
