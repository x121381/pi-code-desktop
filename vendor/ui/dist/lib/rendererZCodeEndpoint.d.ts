import { type RuntimeZCodeEndpointEnv } from "@zcode/shared";
interface RendererImportMetaEnv {
    VITE_ZCODE_BASE_URL?: string;
    VITE_ZCODE_ENDPOINT_ORIGIN?: string;
}
export declare function createRendererZCodeEndpointEnv(env?: RendererImportMetaEnv): RuntimeZCodeEndpointEnv;
export declare const RENDERER_ZCODE_ENDPOINT_URLS: import("@zcode/shared").ZCodeEndpointUrls;
export {};
//# sourceMappingURL=rendererZCodeEndpoint.d.ts.map