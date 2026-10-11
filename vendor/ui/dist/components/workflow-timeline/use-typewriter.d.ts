/**
 * 草稿的笔。
 *
 * 模型的脚本按块到达，扫描器看到的是跳变：一整个 `phase("implement")` 在一个 delta 里，有时
 * 两个阶段一起到。笔把跳变还原成书写：一次只写一站、每字 `PEN_MS`，写完一站停 `PEN_GAP_MS`
 * 再揭示下一站——笔没到的站还不在轨道上，哪怕扫描器已经知道它。名字在写到一半时变长（未闭合的
 * `phase("ver` 又来了字）笔接着写；名字变短或前缀变了（不该发生，但流式下要稳）退到公共前缀。
 *
 * `names` 是扫描器当前的站名序列；undefined 表示不是草稿，钩子静默。计时只认**内容**变化
 * （按内容键控），脚本每来一块都换一个数组也不会把正在走的笔打断。
 * `prefers-reduced-motion: reduce` 下整站立即写完（仍一站一站揭示，只是不逐字）。
 *
 * 修订（GUI 崩溃 React #185 的根因）：
 * 笔只在**有站可揭示**时揭示。「还没有任何站时立即揭示」不看站数的话，空草稿（脚本开头的 `meta`
 * 还没写到第一个 `phase(`）会揭示一个不存在的站、下一轮被裁回 0、再揭示……在 effect 里无限 setState。
 * 这个空转本身只烧 CPU，但它让 React 手里永远有一笔待处理的更新；投影帧一旦积压成几十次连续的
 * 同步提交，嵌套更新计数就过 50，React 抛 #185，整块聊天区被错误边界接管。
 */
export declare const PEN_MS = 24;
export declare const PEN_GAP_MS = 120;
export interface TypewriterState {
    /** 已揭示的站数（笔到过的站）；后面的站还不在轨道上。 */
    visible: number;
    /** 每个已揭示站已写出的字符数。 */
    shown: readonly number[];
    /** 笔追上了流（没有可写的字、没有可揭示的站）：光标闪烁。 */
    idle: boolean;
}
export declare function useTypewriter(names: readonly string[] | undefined): TypewriterState;
//# sourceMappingURL=use-typewriter.d.ts.map