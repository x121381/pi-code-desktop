import { z } from "zod";
export declare const NETWORK_CAPTURE_LIMIT = 1000;
export declare const networkCaptureControlSchema: z.ZodObject<{
    captureId: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
export declare const networkRequestRecordSchema: z.ZodObject<{
    timestamp: z.ZodNumber;
    processType: z.ZodEnum<{
        main: "main";
        renderer: "renderer";
        host: "host";
        cli: "cli";
    }>;
    pid: z.ZodNumber;
    method: z.ZodString;
    url: z.ZodString;
}, z.core.$strict>;
export declare const networkCaptureBatchSchema: z.ZodObject<{
    captureId: z.ZodString;
    records: z.ZodArray<z.ZodObject<{
        timestamp: z.ZodNumber;
        processType: z.ZodEnum<{
            main: "main";
            renderer: "renderer";
            host: "host";
            cli: "cli";
        }>;
        pid: z.ZodNumber;
        method: z.ZodString;
        url: z.ZodString;
    }, z.core.$strict>>;
    dropped: z.ZodNumber;
}, z.core.$strict>;
export type NetworkRequestRecord = z.infer<typeof networkRequestRecordSchema>;
export type NetworkCaptureBatch = z.infer<typeof networkCaptureBatchSchema>;
export interface NetworkCaptureSnapshot {
    captureId: string;
    records: Array<NetworkRequestRecord & {
        id: number;
    }>;
    dropped: number;
}
export interface NetworkCaptureBridge {
    getSnapshot(): Promise<NetworkCaptureSnapshot>;
    clear(): Promise<void>;
}
/** 不保留凭据、fragment 或查询值；仍保留路径和查询键用于辨认请求。 */
export declare function sanitizeNetworkCaptureUrl(value: string): string | undefined;
//# sourceMappingURL=networkCapture.d.ts.map