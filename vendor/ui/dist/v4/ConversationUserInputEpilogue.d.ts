/**
 * 用户消息里的引擎附加文本。
 *
 * dwf 子代理收到的每个 ask = 脚本写的指令正文 + driver 追加的尾注（结果标准、`submit_result`
 * 的 JSON Schema），nudge 轮整条都是引擎文本。读者打开子代理 transcript 想看的是「脚本让它干
 * 什么」，尾注是逐字重复的技术样板——所以折进一枚默认收起的披露，但**不抹掉**：调试时得能核对
 * 子代理到底被告知了什么。边界由引擎标记在行的 `epilogueStart` 上，这里只切分与折叠。
 */
/** 把行拆成正文与尾注。越界或缺席 → 无尾注：宁可多显示，也不把正文吃掉。 */
export declare function splitUserInputEpilogue(text: string, epilogueStart: number | undefined): {
    body: string;
    epilogue?: string;
};
export declare function ConversationUserInputEpilogue({ text }: {
    text: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConversationUserInputEpilogue.d.ts.map