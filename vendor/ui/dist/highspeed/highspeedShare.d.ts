import type { GlobalNoticeEnvelope } from "@/global-notice/globalNoticeStore.js";
import type { HighspeedShareMetrics } from "@/highspeed/highspeedTurnStore.js";
export declare const HIGHSPEED_NOTICE_DISMISS_COOLDOWN_MS: number;
export declare const HIGHSPEED_NOTICE_AUTO_CLOSE_MS: number;
export declare const MIN_HIGHSPEED_SHARE_SPEEDUP = 1.2;
/**
 * 左下角分享卡通知的 payload。指标一律以毫秒事实携带（与发布门禁 isHighspeedShareEligible 同精度），
 * 秒级展示值由渲染侧派生；durationSeconds/savedDurationSeconds 只是 ≤24h 内遗留持久化通知的兼容读取字段。
 */
export interface HighspeedShareNoticePayload extends Record<string, unknown> {
    cardId: string;
    tokenUsage: number;
    durationMs?: number;
    savedDurationMs?: number;
    /** @deprecated 旧版秒级取整字段，只读兼容，不再写入。 */
    durationSeconds?: number;
    /** @deprecated 旧版秒级取整字段，只读兼容，不再写入。 */
    savedDurationSeconds?: number;
}
export declare function copyHighspeedShareText(text: string, writeText?: (value: string) => Promise<void>): Promise<void>;
/** 紧凑时长：>=60s 显示分钟，否则秒；加速标签与导出图片共用，跨语言保持一致的紧凑单位。 */
export declare function formatHighspeedDurationShort(durationMs: number): string;
/**
 * 分享入口只对完整且可信的卡级数据开放，避免低收益或缺少耗时的结果生成误导性分享卡。
 * 这里使用未四舍五入的倍率，确保 1.2x 边界稳定，展示层的格式化不会影响资格判断。
 */
export declare function isHighspeedShareEligible(metrics: HighspeedShareMetrics): boolean;
/** 优先使用 CLI 真实耗时；旧消息回退到工具 20% / 模型 80% 估算。 */
export declare function highspeedSpeedup(metrics: HighspeedShareMetrics): number;
/** 时间节省比例（%），按真实拆分或兼容的 20/80 口径计算。 */
export declare function highspeedSavedPercent(metrics: HighspeedShareMetrics): number;
export interface HighspeedShareImageLabels {
    benefit: string;
    standardSpeed: string;
    speedSummary: string;
    lessWaiting: string;
    imageSummary: string;
}
/** 将统计区渲染为独立 SVG，复制图片时不会把弹框底部文案和按钮带进去。 */
export declare function copyHighspeedCardImage(metrics: HighspeedShareMetrics, writeImage?: (blob: Blob) => Promise<void>, labels?: HighspeedShareImageLabels): Promise<void>;
export declare function buildHighspeedShareNotice(params: {
    cardId: string;
    metrics: HighspeedShareMetrics;
    now?: number;
}): GlobalNoticeEnvelope;
export declare function isHighspeedShareNoticePayload(payload: Record<string, unknown>): payload is HighspeedShareNoticePayload;
/**
 * 由通知 payload 还原分享指标：毫秒字段优先（与发布门禁同精度，复检结果必然一致）；
 * 遗留秒级 payload 按 ×1000 兜底。TPS 只为满足 isHighspeedShareEligible 的正数校验而合成，
 * 倍率与节省比例全部由 durationMs + savedDurationMs 计算，不依赖合成 TPS。
 */
export declare function resolveHighspeedShareNoticeMetrics(payload: HighspeedShareNoticePayload): HighspeedShareMetrics;
//# sourceMappingURL=highspeedShare.d.ts.map