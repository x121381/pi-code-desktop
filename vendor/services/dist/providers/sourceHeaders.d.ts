import { ZCODE_SOURCE_HEADERS } from "@zcode/shared";
export { ZCODE_SOURCE_HEADERS };
interface ZCodeSourceHeaderOptions {
    appVersion?: string;
    arch?: string;
    clientLanguage?: string;
    clientTimezone?: string;
    osVersion?: string;
    platform?: NodeJS.Platform;
    releaseChannel?: string;
}
export declare function buildZCodeSourceHeaders(options?: ZCodeSourceHeaderOptions): Record<string, string>;
//# sourceMappingURL=sourceHeaders.d.ts.map