import { type ZCodeProvider } from "@zcode/shared";
import type { SessionConfigState, SessionPhase, SessionUsageState } from "@zcode/shared/zcode-protocol-v4";
import type { V4ComposerConfigPicker } from "@/v4/composer/configPickerState.js";
import type { ModelSelectionView } from "@zcode/services";
import type { ModelSelectionState } from "@/hooks/useModelSelectionView.js";
export { V4ComposerModeSwitch } from "@/v4/composer/V4ComposerModeControls.js";
export interface ModelSelectionSource {
    provider: string;
    model: string;
}
export interface V4ComposerToolbarProps {
    workspacePath: string;
    workspaceIdentity?: string;
    modelSelectionView?: ModelSelectionView | null;
    modelSelectionState?: ModelSelectionState;
    modelSelectionReload?: () => void;
    sessionId: string | null;
    phase: SessionPhase | null;
    provider?: ZCodeProvider;
    /** 当前工具条是否运行在 Web 远控壳中。 */
    isWebRemoteControl?: boolean;
    /** 当前视口是否为手机输入布局。 */
    isMobileViewport?: boolean;
    /** 草稿态（sessionId=null），仅区分新任务呈现，不改变选择来源。 */
    draftMode?: boolean;
    /** 当前 scope 的 Composer 选择；新任务与已有会话都只显示这份状态。 */
    draftConfig?: Partial<SessionConfigState>;
    usage: SessionUsageState | null;
    disabled: boolean;
    /** Highspeed 卡生效时固定本轮模型，禁止通过选择器或快捷键切换。 */
    modelLocked?: boolean;
    /** 扩散尾段开始后（恢复入场则立即）展示 Highspeed 模型与倒计时。 */
    highspeedPresented?: boolean;
    /** 本次入场是否为 draw 新命中的激活动效；恢复入场的模型标识不做翻页。 */
    highspeedEntranceAnimated?: boolean;
    /** 模型翻页完成并静置后播放一次扫光。 */
    highspeedSweepActive?: boolean;
    /** Highspeed 卡片过期时间；有值时在模型与 Think 之间显示倒计时。 */
    highspeedExpiresAt?: number;
    /** draw 响应绑定的模型；只覆盖锁定期的触发器文案。 */
    highspeedModel?: string;
    /** 单个 composer 内的配置 picker 排他 owner；只属于 renderer-local presentation。 */
    activeConfigPicker: V4ComposerConfigPicker | null;
    onConfigPickerOpenChange: (picker: V4ComposerConfigPicker, open: boolean) => void;
    /**
     * 选中模型（providerId/modelId 来自目录 value 解码），由 Composer owner 更新并持久化。
     * sourceModel 只表达这次用户操作的来源，不从 Session 投影补 CAS 或思考档位。
     */
    onSelectModel: (provider: string, model: string, sourceModel: ModelSelectionSource | null) => void;
    /** 选中思考深度；modelContext 固定本次用户操作的目标模型。 */
    onSelectThought: (thought: string, modelContext: {
        provider: string;
        model: string;
    }) => void;
    onSwitchMode: (mode: string) => void;
    /** prepare/configOptions 失败时，custom provider 选择走 workspace recovery 链。 */
    onRecoverCustomModelSelection?: (value: string, sourceModel: ModelSelectionSource | null) => Promise<void> | void;
    onSendCompressionCommand?: (command: string) => void;
}
/** 模型 / 思考深度 / context usage 簇（渲染在发送键左侧，与旧 UI 同位）。 */
declare function V4ComposerModelControlsImpl({ workspacePath, workspaceIdentity, modelSelectionView, modelSelectionState, modelSelectionReload, provider, isWebRemoteControl, isMobileViewport, draftMode, draftConfig, usage, disabled, modelLocked, highspeedPresented, highspeedEntranceAnimated, highspeedSweepActive, highspeedExpiresAt, highspeedModel, activeConfigPicker, onConfigPickerOpenChange, onSelectModel, onSelectThought, onSendCompressionCommand, onRecoverCustomModelSelection, }: V4ComposerToolbarProps): import("react/jsx-runtime").JSX.Element;
export declare const V4ComposerModelControls: import("react").MemoExoticComponent<typeof V4ComposerModelControlsImpl>;
//# sourceMappingURL=V4ComposerToolbar.d.ts.map