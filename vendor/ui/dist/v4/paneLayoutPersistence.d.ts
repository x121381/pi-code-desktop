import { type PaneLayoutSnapshot } from "@/v4/paneLayoutTree.js";
export declare const PANE_LAYOUT_STORAGE_KEY = "zcode-v4-pane-layout:v2";
/** 一期单值分屏的旧 key（只读迁移，不再写入）。 */
export declare const PANE_LAYOUT_STORAGE_KEY_V1 = "zcode-v4-pane-layout:v1";
/** v1 迁移用的保留 pane id（一期 split pane 固定 id，e2e/testid 契约沿用）。 */
export declare const V4_LEGACY_SPLIT_PANE_ID = "split";
/**
 * 把任意（可能损坏的）v2 持久化值归一为合法布局快照；不可救回 null（调用方回初始布局）。
 * 完整性要求（任一不满足即整体丢弃）：树结构合法、叶子 id 唯一、恰含一个 primary、
 * 叶子数 ≤ 上限、每个非 primary 叶子有合法绑定。恢复出的 session 绑定补
 * restoredUnvalidated（等 sessions-index 验证）；focusedPaneId 不在树中回 primary。
 */
export declare function sanitizePersistedPaneLayout(raw: unknown): PaneLayoutSnapshot | null;
/**
 * 旧版 v1（单值 splitPane）→ v2 迁移：v1 只存了 workspaceKey（identity ?? path），
 * 无法还原远程 scope——仅当它是可信本地路径时迁移为双叶子树，否则丢弃回单 pane（null）。
 */
export declare function migratePersistedPaneLayoutV1(raw: unknown): PaneLayoutSnapshot | null;
/** 读取持久化布局（v2 优先，缺失时尝试 v1 迁移）；无记录/损坏/无 storage 环境返回 null。 */
export declare function readPersistedPaneLayout(): PaneLayoutSnapshot | null;
export declare function persistPaneLayout(snapshot: PaneLayoutSnapshot): void;
//# sourceMappingURL=paneLayoutPersistence.d.ts.map