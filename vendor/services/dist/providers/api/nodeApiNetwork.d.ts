import { type Dispatcher } from "undici";
export interface HostApiNetworkOptions {
    httpProxy?: string;
    noProxy?: string;
    caCertPath?: string;
}
export interface HostApiNetworkTransport {
    fetch: typeof fetch;
    dispose(): void;
    disposeAndWait(): Promise<void>;
}
type HostProxyRoute = {
    kind: "direct";
    noProxyMatched?: boolean;
} | {
    kind: "proxy";
    proxyUrl: string;
} | {
    kind: "invalid";
    reason: string;
};
export declare function mergeHostApiCaCertificates(customCa: string, defaultCa?: readonly string[]): string[];
export declare function resolveHostProxyForUrl(requestUrl: string | URL, options: HostApiNetworkOptions): HostProxyRoute;
interface HostApiNetworkTransportDependencies {
    createDispatcher?: typeof createDispatcher;
    fetchWithDispatcher?: (input: string, init: Omit<RequestInit, "dispatcher"> & {
        dispatcher: Dispatcher;
    }) => Promise<Response>;
}
export declare function createHostApiNetworkTransport(resolveOptions: () => Promise<HostApiNetworkOptions>, dependencies?: HostApiNetworkTransportDependencies): HostApiNetworkTransport;
declare function createDispatcher(route: Exclude<HostProxyRoute, {
    kind: "invalid";
}>, caCertPath: string | undefined): Promise<Dispatcher>;
export {};
//# sourceMappingURL=nodeApiNetwork.d.ts.map