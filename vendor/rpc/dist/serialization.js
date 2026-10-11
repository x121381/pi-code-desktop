/**
 * Layer 1: 二进制序列化
 *
 * RPC 消息需要编码为二进制才能通过 IMessagePassingProtocol 传输。
 * 这里实现了 VS Code 的自定义序列化协议：
 *
 * 格式: [1 byte 类型标签] [VQL 编码的长度] [数据]
 *
 * VQL (Variable-Length Quantity) 用 7 bit 存数据，最高位标记是否还有后续字节。
 * 小数字只需 1 byte，大数字按需扩展，比固定 4 byte 更紧凑。
 */
import { VSBuffer } from "./buffer.js";
/**
 * BufferReader: 从一个 VSBuffer 中按顺序读取数据。
 * 内部维护一个 pos 游标。
 */
export class BufferReader {
    buffer;
    pos = 0;
    constructor(buffer) {
        this.buffer = buffer;
    }
    read(bytes) {
        const result = this.buffer.slice(this.pos, this.pos + bytes);
        this.pos += result.byteLength;
        return result;
    }
}
/**
 * BufferWriter: 收集多个写入的 buffer，最后通过 .buffer 属性一次性拼接。
 * 避免了写入时频繁的内存拷贝。
 */
export class BufferWriter {
    buffers = [];
    get buffer() {
        return VSBuffer.concat(this.buffers);
    }
    write(buffer) {
        this.buffers.push(buffer);
    }
}
// ============================================================================
// VQL 编码
// ============================================================================
/**
 * 读取 VQL 编码的整数
 * @see https://en.wikipedia.org/wiki/Variable-length_quantity
 */
function readIntVQL(reader) {
    let value = 0;
    for (let n = 0;; n += 7) {
        const next = reader.read(1);
        value |= (next.buffer[0] & 0b01111111) << n;
        if (!(next.buffer[0] & 0b10000000)) {
            return value;
        }
    }
}
const vqlZero = createOneByteBuffer(0);
/**
 * 写入 VQL 编码的整数
 * 例: 0 → [0x00], 127 → [0x7F], 128 → [0x80, 0x01]
 */
function writeInt32VQL(writer, value) {
    if (value === 0) {
        writer.write(vqlZero);
        return;
    }
    let len = 0;
    for (let v = value; v !== 0; v = v >>> 7) {
        len++;
    }
    const scratch = VSBuffer.alloc(len);
    for (let i = 0; value !== 0; i++) {
        scratch.buffer[i] = value & 0b01111111;
        value = value >>> 7;
        if (value > 0) {
            scratch.buffer[i] |= 0b10000000;
        }
    }
    writer.write(scratch);
}
// ============================================================================
// 数据类型标签
// ============================================================================
var DataType;
(function (DataType) {
    DataType[DataType["Undefined"] = 0] = "Undefined";
    DataType[DataType["String"] = 1] = "String";
    DataType[DataType["Buffer"] = 2] = "Buffer";
    DataType[DataType["VSBuffer"] = 3] = "VSBuffer";
    DataType[DataType["Array"] = 4] = "Array";
    DataType[DataType["Object"] = 5] = "Object";
    DataType[DataType["Int"] = 6] = "Int";
})(DataType || (DataType = {}));
function createOneByteBuffer(value) {
    const result = VSBuffer.alloc(1);
    result.writeUInt8(value, 0);
    return result;
}
/** 预创建的类型标签 buffer，避免每次序列化都分配内存 */
const BufferPresets = {
    Undefined: createOneByteBuffer(DataType.Undefined),
    String: createOneByteBuffer(DataType.String),
    Buffer: createOneByteBuffer(DataType.Buffer),
    VSBuffer: createOneByteBuffer(DataType.VSBuffer),
    Array: createOneByteBuffer(DataType.Array),
    Object: createOneByteBuffer(DataType.Object),
    Int: createOneByteBuffer(DataType.Int),
};
const RPC_NESTED_UINT8_ARRAY_MARKER = "__zcode_rpc_nested_uint8array_v1";
const RPC_NESTED_UINT8_ARRAY_BASE64_KEY = "base64";
// ============================================================================
// serialize / deserialize
// ============================================================================
/**
 * 序列化任意数据到 writer。
 *
 * 格式：[1 byte 类型] [VQL 长度(如果需要)] [数据]
 *
 * 每条 RPC 消息 = serialize(header) + serialize(body)
 * header 通常是 [RequestType, id, channelName, methodName]
 * body 是方法参数或返回值
 */
export function serialize(writer, data) {
    if (typeof data === "undefined") {
        writer.write(BufferPresets.Undefined);
    }
    else if (typeof data === "string") {
        const buffer = VSBuffer.fromString(data);
        writer.write(BufferPresets.String);
        writeInt32VQL(writer, buffer.byteLength);
        writer.write(buffer);
    }
    else if (data instanceof VSBuffer) {
        writer.write(BufferPresets.VSBuffer);
        writeInt32VQL(writer, data.byteLength);
        writer.write(data);
    }
    else if (data instanceof Uint8Array) {
        const buffer = VSBuffer.wrap(data);
        writer.write(BufferPresets.Buffer);
        writeInt32VQL(writer, buffer.byteLength);
        writer.write(buffer);
    }
    else if (Array.isArray(data)) {
        writer.write(BufferPresets.Array);
        writeInt32VQL(writer, data.length);
        for (const el of data) {
            serialize(writer, el);
        }
    }
    else if (typeof data === "number" && (data | 0) === data) {
        // 整数用 VQL 编码，比 JSON 更紧凑
        writer.write(BufferPresets.Int);
        writeInt32VQL(writer, data);
    }
    else {
        // 对象字段里的 Uint8Array 之前会被 JSON.stringify 展开成 {"0":...}，
        // 远端 RPC 收到后不再是二进制，skill sync 这类归档传输会在解压阶段失败。
        // 这里保持 Object JSON fallback 的协议形态，只对嵌套 Uint8Array 加标记并在反序列化时恢复。
        const buffer = VSBuffer.fromString(JSON.stringify(data, encodeRpcJsonValue));
        writer.write(BufferPresets.Object);
        writeInt32VQL(writer, buffer.byteLength);
        writer.write(buffer);
    }
}
/**
 * 从 reader 反序列化数据
 */
export function deserialize(reader) {
    const type = reader.read(1).readUInt8(0);
    switch (type) {
        case DataType.Undefined:
            return undefined;
        case DataType.String:
            return reader.read(readIntVQL(reader)).toString();
        case DataType.Buffer:
            return reader.read(readIntVQL(reader)).buffer;
        case DataType.VSBuffer:
            return reader.read(readIntVQL(reader));
        case DataType.Array: {
            const length = readIntVQL(reader);
            const result = [];
            for (let i = 0; i < length; i++) {
                result.push(deserialize(reader));
            }
            return result;
        }
        case DataType.Object:
            return JSON.parse(reader.read(readIntVQL(reader)).toString(), decodeRpcJsonValue);
        case DataType.Int:
            return readIntVQL(reader);
    }
}
function encodeRpcJsonValue(_key, value) {
    if (value instanceof Uint8Array) {
        return {
            [RPC_NESTED_UINT8_ARRAY_MARKER]: true,
            [RPC_NESTED_UINT8_ARRAY_BASE64_KEY]: bytesToBase64(value),
        };
    }
    return value;
}
function decodeRpcJsonValue(_key, value) {
    if (!isRpcEncodedUint8Array(value)) {
        return value;
    }
    return base64ToBytes(value[RPC_NESTED_UINT8_ARRAY_BASE64_KEY]);
}
function isRpcEncodedUint8Array(value) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }
    const record = value;
    return (record[RPC_NESTED_UINT8_ARRAY_MARKER] === true &&
        typeof record[RPC_NESTED_UINT8_ARRAY_BASE64_KEY] === "string" &&
        Object.keys(record).length === 2);
}
function bytesToBase64(bytes) {
    const bufferCtor = globalThis.Buffer;
    if (bufferCtor) {
        return bufferCtor.from(bytes).toString("base64");
    }
    let binary = "";
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
        const chunk = bytes.subarray(offset, offset + chunkSize);
        binary += String.fromCharCode(...chunk);
    }
    return globalThis.btoa(binary);
}
function base64ToBytes(base64) {
    const bufferCtor = globalThis.Buffer;
    if (bufferCtor) {
        return new Uint8Array(bufferCtor.from(base64, "base64"));
    }
    const binary = globalThis.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
}
//# sourceMappingURL=serialization.js.map