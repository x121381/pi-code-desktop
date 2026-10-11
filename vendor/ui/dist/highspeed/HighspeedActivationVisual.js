import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useState } from "react";
import { FloatingParticles } from "../components/ui/floating-particles.js";
import { HighSpeedDiffusionCanvas } from "../v4/highspeed/HighSpeedDiffusionCanvas.js";
const HIGHSPEED_HANDOFF_FALLBACK_MS = 1_000;
/**
 * 仅渲染 Highspeed 输入壳的视觉层；激活资格、有效期和模型仍由外部卡片快照决定。
 */
export const HighspeedComposerBackground = memo(function HighspeedComposerBackground({ animated, onModelTransitionStart, }) {
    const [phase, setPhase] = useState(animated ? "diffusing" : "stable");
    const handleHandoffStart = useCallback(() => setPhase("handoff"), []);
    const handleDiffusionComplete = useCallback(() => setPhase("stable"), []);
    useEffect(() => {
        if (phase !== "handoff")
            return;
        // Bug 根因：窗口后台化或 Renderer 忙碌时，Canvas 的 opacity transitionend 可能丢失，
        // 动画状态会永久停在 handoff，使只在 stable 生效的紫色边框和阴影一起消失。
        // 正常路径仍由 transitionend 精确收口；超时只负责把丢事件的状态机推进到稳定态。
        const fallbackTimer = window.setTimeout(handleDiffusionComplete, HIGHSPEED_HANDOFF_FALLBACK_MS);
        return () => window.clearTimeout(fallbackTimer);
    }, [handleDiffusionComplete, phase]);
    return (_jsxs("div", { "data-testid": "highspeed-composer-background", "data-phase": phase, "aria-hidden": "true", className: "highspeed-composer-background pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", children: [phase !== "stable" ? (_jsx(HighSpeedDiffusionCanvas, { onModelTransitionStart: onModelTransitionStart, onHandoffStart: handleHandoffStart, onComplete: handleDiffusionComplete })) : null, _jsx(FloatingParticles, { className: "highspeed-particle-layer z-0", settled: !animated })] }));
});
//# sourceMappingURL=HighspeedActivationVisual.js.map