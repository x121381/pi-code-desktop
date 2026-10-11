/**
 * 获取稳定的设备 ID。
 *
 * 桌面端：deviceMid（进程内单例）
 * 手机端：物理属性指纹（browserPlatform | screen.width | screen.height | colorDepth）
 */
export declare function getStreamClientId(): string;
/**
 * 设置稳定的设备 ID（由 platform.getDeviceId() 提供）。
 * 必须在首次调用 getStreamClientId() 之前调用。
 */
export declare function setStreamClientId(deviceId: string): void;
/**
 * 生成手机端物理属性指纹。
 * 用于手机端在 platform.getDeviceId() 返回之前自行生成稳定的设备 ID。
 */
export declare function generateMobileDeviceFingerprint(): string;
//# sourceMappingURL=streamClientId.d.ts.map