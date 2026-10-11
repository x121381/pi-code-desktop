export declare const WEB_REMOTE_CONTROL_HEARTBEAT_INTERVAL_MS = 10000;
export declare const WEB_REMOTE_CONTROL_HEARTBEAT_JITTER_MS = 2000;
export declare const WEB_REMOTE_CONTROL_HEARTBEAT_ACK_TIMEOUT_MS = 30000;
export declare const WEB_REMOTE_CONTROL_RECONNECT_JITTER_MS = 2000;
export declare function getWebRemoteControlHeartbeatJitterMs(baseIntervalMs?: number, configuredJitterMs?: number): number;
export declare function getWebRemoteControlHeartbeatDelayMs(baseIntervalMs?: number, configuredJitterMs?: number, random?: () => number): number;
export declare function getWebRemoteControlReconnectJitterMs(configuredJitterMs?: number, random?: () => number): number;
//# sourceMappingURL=web-remote-control-heartbeat.d.ts.map