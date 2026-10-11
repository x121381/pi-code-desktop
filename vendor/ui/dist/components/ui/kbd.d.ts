/**
 * 键帽组件（对齐 shadcn Kbd）：每个按键独立成 chip，固定高度 + 最小方形宽度 +
 * flex 居中，保证 ⌘/⇧ 等单符号键与字母键视觉尺寸一致；font-sans 避免符号从
 * 等宽字体回落造成的字形宽度参差（数据来自平台格式化 label，见 shortcuts/label.ts）。
 */
declare function Kbd({ className, ...props }: React.ComponentProps<"kbd">): import("react/jsx-runtime").JSX.Element;
/** 键帽组合容器：把一次组合的多个键横排（gap-1），如 ⌘ + K。 */
declare function KbdGroup({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
export { Kbd, KbdGroup };
//# sourceMappingURL=kbd.d.ts.map