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
export interface IReader {
    read(bytes: number): VSBuffer;
}
export interface IWriter {
    write(buffer: VSBuffer): void;
}
/**
 * BufferReader: 从一个 VSBuffer 中按顺序读取数据。
 * 内部维护一个 pos 游标。
 */
export declare class BufferReader implements IReader {
    private buffer;
    private pos;
    constructor(buffer: VSBuffer);
    read(bytes: number): VSBuffer;
}
/**
 * BufferWriter: 收集多个写入的 buffer，最后通过 .buffer 属性一次性拼接。
 * 避免了写入时频繁的内存拷贝。
 */
export declare class BufferWriter implements IWriter {
    private buffers;
    get buffer(): VSBuffer;
    write(buffer: VSBuffer): void;
}
/**
 * 序列化任意数据到 writer。
 *
 * 格式：[1 byte 类型] [VQL 长度(如果需要)] [数据]
 *
 * 每条 RPC 消息 = serialize(header) + serialize(body)
 * header 通常是 [RequestType, id, channelName, methodName]
 * body 是方法参数或返回值
 */
export declare function serialize(writer: IWriter, data: any): void;
/**
 * 从 reader 反序列化数据
 */
export declare function deserialize(reader: IReader): any;
//# sourceMappingURL=serialization.d.ts.map