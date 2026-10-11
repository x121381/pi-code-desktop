import { type PluginUiSurfaceFeed } from "../domain/pluginUiToolFeed.js";
export declare function getPluginUiSurfaceFeed(key: string): PluginUiSurfaceFeed;
/** 合并后返回存储的快照；无变化时返回原引用且不通知。 */
export declare function offerPluginUiSurfaceFeed(key: string, candidate: PluginUiSurfaceFeed): PluginUiSurfaceFeed;
export declare function subscribePluginUiSurfaceFeeds(listener: () => void): () => void;
/** 测试用：清空全部记录。 */
export declare function resetPluginUiSurfaceFeedsForTest(): void;
export declare function clearPluginUiSurfaceFeed(key: string): void;
//# sourceMappingURL=pluginUiSurfaceFeedStore.d.ts.map