import { z } from "zod";
export declare const topicWireBase64Schema: z.ZodString;
export declare function crc32WireBytes(bytes: Uint8Array): string;
export declare function encodeWireBytesBase64(bytes: Uint8Array): string;
export declare function decodeWireBase64(value: string): Uint8Array | null;
//# sourceMappingURL=wire-binary.d.ts.map