import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * CUA 输入框常驻入口按钮。
 *
 * 纯展示件：所有状态判定都在 useCuaComposerEntry / cuaComposerEntryState，这里只负责
 * 「不可见就不渲染」以及把 view 映射成 DOM。视觉上刻意与 toolbar 其它控件同权重，避免在不可用场景误导用户以为装了就能用。
 */
import { memo } from "react";
import { MonitorCogIcon } from "lucide-react";
import { TID_V4_COMPOSER_CUA_ENTRY } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { useOptionalPlatform } from "@/hooks/usePlatform.js";
import { useOptionalServices } from "@/hooks/useServices.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { supportsLocalMacCuaPermissionOnboarding, supportsLocalWindowsCuaEntry, } from "@/lib/cuaPlatform.js";
import { useCuaComposerEntry, } from "@/hooks/useCuaComposerEntry.js";
/**
 * 平台门前置层：平台不支持（或宿主根本没提供 platform / services context）时连内层都不挂载。
 *
 * 拆两层的原因有二：
 * 1. 语义——「不可见就不该有任何后台开销」。平台门不过时不建立 settings 订阅、不读插件 store、
 *    不起权限轮询，比在内层判完再返回 null 更彻底。
 * 2. 健壮性——composer 会在没有 PlatformProvider / ServiceProvider 的宿主（含既有的组件级
 *    测试）里渲染。内层用的 usePlatform / useServices 在缺 provider 时会抛异常，把整个
 *    composer 拖崩。这里用 optional 变体判定，缺失即静默降级为不渲染。
 */
function V4ComposerCuaEntryImpl(props) {
    const platform = useOptionalPlatform();
    const services = useOptionalServices();
    const platformSupported = platform !== null &&
        services !== null &&
        (supportsLocalMacCuaPermissionOnboarding(platform) || supportsLocalWindowsCuaEntry(platform));
    if (!platformSupported)
        return null;
    return _jsx(V4ComposerCuaEntryMounted, { ...props });
}
function V4ComposerCuaEntryMounted(props) {
    const { intl } = useZCodeIntl();
    const { view, onActivate } = useCuaComposerEntry(props);
    const label = intl.formatMessage({ id: "chat.toolbar.computerUse.label" });
    // 余下三层可见性门（设置页隐藏 / mac 服务缺失 / 电脑控制未启用）→ 不渲染 DOM。
    if (!view.visible)
        return null;
    const tooltip = intl.formatMessage({ id: view.tooltipMessageId });
    return (_jsx(ControlHintTooltip, { title: tooltip, children: _jsxs(Button, { type: "button", variant: "ghost", size: "default", "data-testid": TID_V4_COMPOSER_CUA_ENTRY, "data-composer-collapse-priority": "0", "data-cua-state": view.uiState, "data-cua-interaction-disabled": view.interactionDisabled ? "true" : "false", "aria-label": label, "aria-disabled": view.interactionDisabled || undefined, onClick: view.clickAction === "open-settings" ? onActivate : undefined, className: "group/cua h-7 w-fit justify-center gap-1 rounded-lg px-1.5 py-1.5 text-ui-base data-[composer-compact=true]:size-7 data-[composer-compact=true]:gap-0 data-[composer-compact=true]:p-0 " +
                (view.interactionDisabled ? "opacity-50" : ""), children: [_jsx(MonitorCogIcon, { className: "size-4 shrink-0", "aria-hidden": true }), _jsx("span", { className: "inline-flex whitespace-nowrap group-data-[composer-compact=true]/cua:hidden", "data-cua-label": true, children: label })] }) }));
}
export const V4ComposerCuaEntry = memo(V4ComposerCuaEntryImpl);
//# sourceMappingURL=V4ComposerCuaEntry.js.map