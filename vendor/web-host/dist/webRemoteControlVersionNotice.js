import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import { Button } from "@zcode/ui";
import { resolveWebRemoteControlScreenLocale } from "./webRemoteControlFailureScreen.js";
/** 原页面保持挂载；原生 modal 阻止背景元素与其他 portal 的操作，全局快捷键由入口提前拦截。 */
export function showWebRemoteControlVersionNotice(version, onReload) {
    const dialog = document.createElement("dialog");
    dialog.className =
        "m-auto max-w-md rounded-2xl border border-popover-border bg-popover p-6 text-foreground shadow-lg";
    // Web 文件不在共享 UI 的 Tailwind 扫描目录内；流式宽度避免依赖未生成的响应式 utility。
    dialog.style.width = "calc(100% - 2rem)";
    // 已打开的 Radix 弹窗会给 body 设置 pointer-events:none；顶层原生 modal 必须显式恢复指针事件。
    dialog.style.pointerEvents = "auto";
    dialog.setAttribute("aria-labelledby", "remote-version-title");
    dialog.setAttribute("aria-describedby", "remote-version-description");
    dialog.addEventListener("cancel", (event) => event.preventDefault());
    const zh = resolveWebRemoteControlScreenLocale(navigator.language) === "zh-CN";
    document.body.append(dialog);
    const noticeRoot = createRoot(dialog);
    noticeRoot.render(_jsxs("div", { className: "flex min-w-0 flex-col gap-4", children: [_jsx("h2", { id: "remote-version-title", className: "text-ui-lg font-medium", children: zh ? "桌面版本已更新" : "Desktop version changed" }), _jsx("p", { id: "remote-version-description", className: "text-ui-base text-foreground-subtle break-words", children: zh
                    ? `桌面当前版本为 ${version}。任务操作已暂停，请重新加载以继续。未发送的附件不会保留。`
                    : `The desktop is now running ${version}. Task controls are paused. Reload to continue. Unsent attachments will not be retained.` }), _jsx(Button, { autoFocus: true, size: "lg", className: "self-end", onClick: onReload, children: zh ? "重新加载" : "Reload" })] }));
    dialog.showModal();
    // 原生 modal 的事件仍会冒泡到 document/window，阻止背景的全局快捷键处理。
    for (const type of [
        "keydown",
        "keyup",
        "keypress",
        "click",
        "pointerdown",
        "focusin",
        "focusout",
    ]) {
        dialog.addEventListener(type, (event) => event.stopPropagation());
    }
    return () => {
        noticeRoot.unmount();
        dialog.close();
        dialog.remove();
    };
}
//# sourceMappingURL=webRemoteControlVersionNotice.js.map