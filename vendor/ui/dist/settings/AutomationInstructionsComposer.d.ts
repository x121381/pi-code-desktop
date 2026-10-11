import { type ComponentProps, type ReactNode } from "react";
interface AutomationInstructionsComposerProps {
    invalid?: boolean;
    children: ReactNode;
}
/**
 * Instructions 底部功能 trigger 的统一交互契约。
 * 定时与闲时表单曾分别用 hover、focus-within 和不同圆角维护展开态，
 * 导致同一功能在两类自动化中出现胶囊/方圆角和打开背景不一致。
 * 行高使用 rem 语义类，避免固定像素值在界面字号调整后压缩文字行盒。
 */
export declare const AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME = "h-7 rounded-full text-ui-base font-normal leading-5 text-foreground-subtle hover:bg-hover hover:text-foreground aria-expanded:bg-hover aria-expanded:text-foreground";
/**
 * 定时与闲时设置页的输入内容统一使用 14px 正文字号。
 * 两页曾分别维护标题、调度和 Instructions 字号，部分小时调度分支会回退到 12px。
 */
export declare const AUTOMATION_FORM_INPUT_TYPOGRAPHY_CLASSNAME = "text-ui-base leading-5";
/**
 * Automations 共用的 Instructions 复合输入。
 * textarea 自身承担标准 Input 描边，父级只提供工具栏的 surface 层级。
 * 几何、表面层级及全局 Input 描边状态统一收口在这里，调用方只提供字段状态和工具条内容。
 */
export declare function AutomationInstructionsComposer({ invalid, children, }: AutomationInstructionsComposerProps): import("react/jsx-runtime").JSX.Element;
export declare function AutomationInstructionsTextarea({ rows, onInput, value, ...props }: Omit<ComponentProps<"textarea">, "className" | "ref">): import("react/jsx-runtime").JSX.Element;
export declare function AutomationInstructionsToolbar({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AutomationInstructionsComposer.d.ts.map