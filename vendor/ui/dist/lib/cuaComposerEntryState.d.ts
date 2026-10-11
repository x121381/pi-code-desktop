/**
 * CUA 输入框常驻入口按钮的状态推导（零依赖纯函数）。
 *
 * 为什么抽成纯函数：状态组合是「平台 × 隐藏开关 × 插件态 × 权限态 × session busy」的笛卡尔积，
 * 放在组件或 hook 里就只能靠搭 store mock 来测，覆盖不全。这里不 import React、不读 store，
 * 全部输入由调用方（useCuaComposerEntry）注入。
 */
import { type CuaPermissionStatusResult } from "@zcode/services";
import type { StatusDotTone } from "@/settings/StatusDot.js";
/**
 * 对外 4 个 UI 态；内部细分状态只用于日志，不直接暴露给用户。
 *
 * 无 "disabled"（插件未启用）态：电脑控制默认关闭后，未启用
 * 不再渲染成灰点拉新按钮，而是整个不渲染（见 isEntryVisible 的插件门），该态因此不可达。
 */
export type CuaComposerEntryUiState = "starting"
/** 懒启动：Helper 未运行（正常空闲，首次使用自动启动）——中性灰点，不是错误。 */
 | "idle" | "permission-required" | "ready" | "error";
export interface CuaComposerEntryInputs {
    /** macOS 本地桌面且具备 CUA onboarding 能力（UA + preload capability 双判）。 */
    macLocalDesktop: boolean;
    /** Windows 本地桌面。 */
    windowsLocalDesktop: boolean;
    /** 设置页「在输入框显示电脑操作按钮」已关闭（内部 hidden 态）。 */
    hiddenBySettings: boolean;
    /** cuaPermissionService 是否存在；远端 host 上为 false。 */
    permissionServiceAvailable: boolean;
    /** zcode-cua 插件启用态。 */
    pluginEnabled: boolean;
    /** zcode-cua 插件正在切换中。 */
    pluginToggling: boolean;
    /** 最近一次 zcode-cua 插件操作失败。 */
    pluginError: boolean;
    /** Helper 权限状态。入口不查询权限，恒为 null（idle 中性态）；真值只在设置页读。 */
    permissionStatus: CuaPermissionStatusResult | null;
    /** 当前 workspace 内任一 task 的 turn 正在运行。 */
    sessionBusy: boolean;
}
export type CuaComposerEntryView = {
    visible: false;
} | {
    visible: true;
    uiState: CuaComposerEntryUiState;
    tone: StatusDotTone;
    spinning: boolean;
    tooltipMessageId: string;
    /**
     * open-settings = 跳设置页 computerUse 区；none = 仅 hover tooltip。
     * 可见态一律 open-settings，只有 session-busy 覆盖时为 none（见 resolve 函数尾部注释）。
     */
    clickAction: "open-settings" | "none";
    /** session-busy 覆盖：置灰且不响应点击。不改 uiState 与 tone。 */
    interactionDisabled: boolean;
};
export declare function resolveCuaComposerEntryView(inputs: CuaComposerEntryInputs): CuaComposerEntryView;
//# sourceMappingURL=cuaComposerEntryState.d.ts.map