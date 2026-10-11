/** 句中的值画成一枚芯片：平时是一小块 surface，悬停才出边框与输入底色（composer 模型触发器的语汇）。 */
export declare const WORKFLOW_ASK_CHIP_CLASS_NAME = "h-6 min-w-0 max-w-[260px] gap-1 rounded-md border border-transparent bg-surface pl-[7px] pr-1 text-ui-sm text-foreground hover:border-border-hover hover:bg-input focus-visible:border-input-border-focused data-[state=open]:border-border-hover data-[state=open]:bg-input [&_svg]:size-3";
export declare const WORKFLOW_ASK_LINE_CLASS_NAME = "flex min-h-6 min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-ui-sm text-foreground-subtle";
export declare const WORKFLOW_ASK_TAIL_CLASS_NAME = "text-foreground-subtlest";
/** 「· 原为 X ↺」：改过的那一行才有；↺ 把这一行放回起点。 */
export declare function WorkflowAskWasTail({ disabled, onReset, testId, value, }: {
    disabled: boolean;
    onReset: () => void;
    testId: string;
    value: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function WorkflowAskBoundLine({ bound, changed, defaultConcurrency, disabled, initial, onChange, onReset, }: {
    bound: number | null;
    changed: boolean;
    /** 默认并发 D：只用来写「· 默认 N」与判「= 默认」，不是步进器的上界。 */
    defaultConcurrency: number | undefined;
    disabled: boolean;
    initial: number | null;
    onChange: (bound: number) => void;
    onReset: () => void;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 块缺席时的纯文本条件行（旧 agent）：只有调用设了的字段，模型在上、上界在下，`text-ui-xs` 最淡色。
 * 与可调的两行同一个次序，好让新旧两种窗读起来是同一件事。模型说解析好的名字，规范串只进 tooltip。
 */
export declare function WorkflowAskPlainSettings({ maxConcurrency, scriptNamesModels, subagentModel, }: {
    maxConcurrency: number | undefined;
    /** 脚本给某些子代理点名了模型：模型那一句说「默认」（它不再替每一个子代理说话）。 */
    scriptNamesModels?: boolean;
    subagentModel: {
        text: string;
        tooltip: string;
    } | undefined;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkflowAskSettingsParts.d.ts.map