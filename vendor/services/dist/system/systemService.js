import { homedir } from "node:os";
import { Socket } from "node:net";
import { listIntegratedTerminalShellOptions } from "./integratedTerminalShells.js";
const DEFAULT_PROBE_TIMEOUT_MS = 800;
const DEFAULT_PROBE_ATTEMPTS = 2;
const MAX_PROBE_ATTEMPTS = 3;
const DEFAULT_PROBE_PORT = 22;
function normalizeProbeAttempts(attempts) {
    if (typeof attempts !== "number" || !Number.isFinite(attempts)) {
        return DEFAULT_PROBE_ATTEMPTS;
    }
    return Math.min(MAX_PROBE_ATTEMPTS, Math.max(1, Math.floor(attempts)));
}
function normalizeRequiredSuccessCount(requiredSuccessCount, totalTargets) {
    if (totalTargets <= 0) {
        return 1;
    }
    if (typeof requiredSuccessCount !== "number" || !Number.isFinite(requiredSuccessCount)) {
        return 1;
    }
    return Math.min(totalTargets, Math.max(1, Math.floor(requiredSuccessCount)));
}
function normalizeProbeTimeout(timeoutMs) {
    return typeof timeoutMs === "number" && Number.isFinite(timeoutMs)
        ? Math.min(10_000, Math.max(100, Math.floor(timeoutMs)))
        : DEFAULT_PROBE_TIMEOUT_MS;
}
function normalizeTcpTarget(target) {
    const host = target.host.trim();
    if (host.length === 0) {
        return null;
    }
    const resolvedPort = typeof target.port === "number" &&
        Number.isInteger(target.port) &&
        target.port >= 1 &&
        target.port <= 65535
        ? target.port
        : DEFAULT_PROBE_PORT;
    return {
        kind: "tcp",
        targetId: target.id?.trim() || `${host}:${resolvedPort}`,
        host,
        port: resolvedPort,
        timeoutMs: normalizeProbeTimeout(target.timeoutMs),
    };
}
function normalizeServiceTarget(target) {
    const urlText = target.url.trim();
    if (urlText.length === 0) {
        return null;
    }
    let parsedUrl;
    try {
        parsedUrl = new URL(urlText);
    }
    catch {
        return null;
    }
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return null;
    }
    const expectedMarker = target.expectedMarker?.trim();
    const token = target.token?.trim();
    return {
        kind: "service",
        targetId: target.id?.trim() || parsedUrl.toString(),
        url: parsedUrl.toString(),
        expectedMarker: expectedMarker && expectedMarker.length > 0 ? expectedMarker : undefined,
        token: token && token.length > 0 ? token : undefined,
        timeoutMs: normalizeProbeTimeout(target.timeoutMs),
    };
}
function normalizeProbeTarget(target) {
    if (target.kind === "service") {
        return normalizeServiceTarget(target);
    }
    return normalizeTcpTarget(target);
}
async function runProbeWithRetry(target, attempts, tcpProbe) {
    let lastError = "";
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            const latencyMs = await tcpProbe({
                host: target.host,
                port: target.port,
                timeoutMs: target.timeoutMs,
            });
            return {
                targetId: target.targetId,
                kind: "tcp",
                host: target.host,
                port: target.port,
                reachable: true,
                attemptCount: attempt,
                latencyMs,
            };
        }
        catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
        }
    }
    return {
        targetId: target.targetId,
        kind: "tcp",
        host: target.host,
        port: target.port,
        reachable: false,
        attemptCount: attempts,
        latencyMs: null,
        error: lastError || "probe failed",
    };
}
function parseProbeServiceResponse(payload) {
    if (!payload || typeof payload !== "object") {
        throw new Error("invalid service response");
    }
    const response = payload;
    if (typeof response.ok !== "boolean") {
        throw new Error("invalid service response: missing ok");
    }
    if ("marker" in response &&
        response.marker !== undefined &&
        typeof response.marker !== "string") {
        throw new Error("invalid service response: marker must be string");
    }
    return response;
}
async function probeServiceEndpoint(params) {
    const startedAt = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), params.timeoutMs);
    try {
        const response = await fetch(params.url, {
            method: "GET",
            headers: params.token ? { "x-zcode-intranet-token": params.token } : undefined,
            signal: controller.signal,
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const responseBody = parseProbeServiceResponse(await response.json());
        if (!responseBody.ok) {
            throw new Error("service returned ok=false");
        }
        return {
            latencyMs: Math.max(0, Date.now() - startedAt),
            marker: responseBody.marker,
        };
    }
    catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            throw new Error(`timeout(${params.timeoutMs}ms)`);
        }
        throw error;
    }
    finally {
        clearTimeout(timeoutId);
    }
}
async function runServiceProbeWithRetry(target, attempts, serviceProbe) {
    let lastError = "";
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            const result = await serviceProbe({
                url: target.url,
                timeoutMs: target.timeoutMs,
                token: target.token,
            });
            if (target.expectedMarker && result.marker !== target.expectedMarker) {
                throw new Error(`marker mismatch(expected=${target.expectedMarker}, actual=${result.marker ?? "<empty>"})`);
            }
            return {
                targetId: target.targetId,
                kind: "service",
                url: target.url,
                reachable: true,
                attemptCount: attempt,
                latencyMs: result.latencyMs,
                marker: result.marker,
            };
        }
        catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
        }
    }
    return {
        targetId: target.targetId,
        kind: "service",
        url: target.url,
        reachable: false,
        attemptCount: attempts,
        latencyMs: null,
        error: lastError || "probe failed",
    };
}
function resolveProbeStrategy(targets) {
    if (targets.every((target) => target.kind === "tcp")) {
        return "tcp-connect";
    }
    if (targets.every((target) => target.kind === "service")) {
        return "service-http";
    }
    return "mixed";
}
function probeTcpPort(params) {
    const { host, port, timeoutMs } = params;
    const startedAt = Date.now();
    return new Promise((resolve, reject) => {
        const socket = new Socket();
        let settled = false;
        const finalize = (handler) => {
            if (settled) {
                return;
            }
            settled = true;
            socket.removeAllListeners();
            socket.destroy();
            handler();
        };
        socket.setTimeout(timeoutMs);
        socket.once("connect", () => {
            const latencyMs = Math.max(0, Date.now() - startedAt);
            finalize(() => resolve(latencyMs));
        });
        socket.once("timeout", () => {
            finalize(() => reject(new Error(`timeout(${timeoutMs}ms)`)));
        });
        socket.once("error", (error) => {
            finalize(() => reject(error));
        });
        socket.connect(port, host);
    });
}
export function createSystemService(options = {}) {
    const tcpProbe = options.tcpProbe ?? probeTcpPort;
    const serviceProbe = options.serviceProbe ?? probeServiceEndpoint;
    const now = options.now ?? Date.now;
    const env = options.env ?? process.env;
    const platform = options.platform ?? process.platform;
    return {
        async info() {
            return { homedir: homedir(), platform: process.platform };
        },
        async listIntegratedTerminalShells() {
            return listIntegratedTerminalShellOptions({
                env,
                isExecutable: options.isExecutable,
                platform,
            });
        },
        async probeIntranet(request) {
            const normalizedTargets = request.targets
                .map(normalizeProbeTarget)
                .filter((target) => target !== null);
            const attempts = normalizeProbeAttempts(request.attempts);
            const requiredSuccessCount = normalizeRequiredSuccessCount(request.requiredSuccessCount, normalizedTargets.length);
            const results = await Promise.all(normalizedTargets.map((target) => {
                if (target.kind === "service") {
                    return runServiceProbeWithRetry(target, attempts, serviceProbe);
                }
                return runProbeWithRetry(target, attempts, tcpProbe);
            }));
            const reachedTargetCount = results.filter((result) => result.reachable).length;
            return {
                isIntranet: normalizedTargets.length > 0 && reachedTargetCount >= requiredSuccessCount,
                reachedTargetCount,
                requiredSuccessCount,
                totalTargets: normalizedTargets.length,
                checkedAt: now(),
                strategy: resolveProbeStrategy(normalizedTargets),
                results,
            };
        },
    };
}
//# sourceMappingURL=systemService.js.map