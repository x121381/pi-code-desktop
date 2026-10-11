/**
 * 快捷键设置分区：命令表只读展示 + 键盘录入 + 冲突处理。
 * 只读写 shortcutBindings 覆盖数据，键位语义（匹配/录制/冲突/抢绑）全部经 shortcuts 内核。
 * 系统保留键直接拒绝；app 内命令占用提示占用者并支持二次确认抢绑。
 * 单行多绑定：一个命令一行，多组键帽在键位列纵向排列；每条可替换/删除，
 * 命令级「+」追加；同命令物理等价重复在录制入口拒绝。
 */
export declare function ShortcutSettingsSection({ isDesktop }: {
    isDesktop?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ShortcutSettingsSection.d.ts.map