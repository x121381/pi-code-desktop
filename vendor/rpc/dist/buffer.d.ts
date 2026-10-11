/**
 * Layer 0.5: 跨平台 Buffer 抽象
 *
 * VS Code 需要在 Node.js (Buffer) 和浏览器 (Uint8Array) 之间统一二进制操作。
 * VSBuffer 是对 Uint8Array 的薄封装，提供统一的读写接口。
 *
 * 这是序列化层和传输层的基础。
 */
export declare class VSBuffer {
    readonly buffer: Uint8Array;
    readonly byteLength: number;
    private constructor();
    /** 分配指定大小的空 buffer */
    static alloc(byteLength: number): VSBuffer;
    /** 包装已有的 Uint8Array */
    static wrap(buffer: Uint8Array): VSBuffer;
    /** 从字符串创建 buffer (UTF-8) */
    static fromString(str: string): VSBuffer;
    /** 拼接多个 buffer */
    static concat(buffers: VSBuffer[], totalLength?: number): VSBuffer;
    /** 转为 UTF-8 字符串 */
    toString(): string;
    /** 切片 */
    slice(start: number, end?: number): VSBuffer;
    /** 拷贝数据到 this buffer 的指定位置 */
    set(source: VSBuffer | Uint8Array, offset?: number): void;
    readUInt8(offset: number): number;
    writeUInt8(value: number, offset: number): void;
    readUInt32BE(offset: number): number;
    writeUInt32BE(value: number, offset: number): void;
}
//# sourceMappingURL=buffer.d.ts.map