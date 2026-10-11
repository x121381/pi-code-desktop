export declare const MODEL_PROVIDER_TEXT_IDLE_TRIGGER_MS = 1200;
/**
 * Provider 文本保存与 Model Config Resolution 共用的“停止输入后执行”调度器。
 * 新输入只替换尚未执行的计时器；blur/Enter/save 通过 flush 立即执行同一动作。
 */
export declare function useIdleTrigger<TResult>(action: () => TResult | Promise<TResult>, delayMs?: number): {
    readonly cancel: () => void;
    readonly flush: () => Promise<TResult>;
    readonly schedule: () => void;
    readonly scheduled: boolean;
};
//# sourceMappingURL=useIdleTrigger.d.ts.map