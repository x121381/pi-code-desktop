/**
 * Layer 0.5: 跨平台 Buffer 抽象
 *
 * VS Code 需要在 Node.js (Buffer) 和浏览器 (Uint8Array) 之间统一二进制操作。
 * VSBuffer 是对 Uint8Array 的薄封装，提供统一的读写接口。
 *
 * 这是序列化层和传输层的基础。
 */
export class VSBuffer {
    buffer;
    byteLength;
    constructor(buffer) {
        this.buffer = buffer;
        this.byteLength = buffer.byteLength;
    }
    /** 分配指定大小的空 buffer */
    static alloc(byteLength) {
        return new VSBuffer(new Uint8Array(byteLength));
    }
    /** 包装已有的 Uint8Array */
    static wrap(buffer) {
        return new VSBuffer(buffer);
    }
    /** 从字符串创建 buffer (UTF-8) */
    static fromString(str) {
        const encoder = new TextEncoder();
        return new VSBuffer(encoder.encode(str));
    }
    /** 拼接多个 buffer */
    static concat(buffers, totalLength) {
        const len = totalLength ?? buffers.reduce((sum, b) => sum + b.byteLength, 0);
        const result = VSBuffer.alloc(len);
        let offset = 0;
        for (const buf of buffers) {
            result.set(buf, offset);
            offset += buf.byteLength;
        }
        return result;
    }
    /** 转为 UTF-8 字符串 */
    toString() {
        const decoder = new TextDecoder();
        return decoder.decode(this.buffer);
    }
    /** 切片 */
    slice(start, end) {
        return new VSBuffer(this.buffer.slice(start, end));
    }
    /** 拷贝数据到 this buffer 的指定位置 */
    set(source, offset = 0) {
        const raw = source instanceof VSBuffer ? source.buffer : source;
        this.buffer.set(raw, offset);
    }
    readUInt8(offset) {
        return this.buffer[offset];
    }
    writeUInt8(value, offset) {
        this.buffer[offset] = value;
    }
    readUInt32BE(offset) {
        return (((this.buffer[offset] << 24) |
            (this.buffer[offset + 1] << 16) |
            (this.buffer[offset + 2] << 8) |
            this.buffer[offset + 3]) >>>
            0);
    }
    writeUInt32BE(value, offset) {
        this.buffer[offset] = (value >>> 24) & 0xff;
        this.buffer[offset + 1] = (value >>> 16) & 0xff;
        this.buffer[offset + 2] = (value >>> 8) & 0xff;
        this.buffer[offset + 3] = value & 0xff;
    }
}
//# sourceMappingURL=buffer.js.map