/**
 * 分屏和多窗口内容树可能同时挂载多个 Composer。修饰键是 window 事实，
 * 每个 Composer 各绑一套 keydown/keyup 会重复处理；这里用单一外部 store 广播瞬时状态。
 */
export declare function subscribePrimaryFollowupModifier(listener: () => void): () => void;
export declare function getPrimaryFollowupModifierSnapshot(): boolean;
export declare function usePrimaryFollowupModifier(): boolean;
//# sourceMappingURL=usePrimaryFollowupModifier.d.ts.map