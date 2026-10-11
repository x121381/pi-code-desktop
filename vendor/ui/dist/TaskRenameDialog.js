import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { Button } from "./components/ui/button.js";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "./components/ui/dialog.js";
import { Input } from "./components/ui/input.js";
import { isImeComposingKeyEvent } from "./lib/imeComposition.js";
import { logger } from "./logger.js";
export function TaskRenameDialog({ open, value, inputRef, intl, onOpenChange, onChange, onCancel, onConfirm, }) {
    const compositionActiveRef = useRef(false);
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsx(DialogContent, { className: "max-w-xl overflow-hidden rounded-2xl p-0", children: _jsxs("div", { className: "flex min-w-0 flex-col gap-6 p-6", children: [_jsx(DialogHeader, { className: "space-y-2", children: _jsx(DialogTitle, { children: intl.formatMessage({ id: "taskList.rename" }) }) }), _jsx("div", { className: "flex min-w-0 flex-col space-y-4", children: _jsx(Input, { ref: inputRef, value: value, size: "lg", placeholder: intl.formatMessage({ id: "taskList.renamePlaceholder" }), onChange: (event) => {
                                onChange(event.target.value);
                            }, onCompositionEnd: () => {
                                compositionActiveRef.current = false;
                            }, onCompositionStart: () => {
                                compositionActiveRef.current = true;
                            }, onKeyDown: (event) => {
                                if (event.key === "Enter") {
                                    if (isImeComposingKeyEvent({
                                        compositionActive: compositionActiveRef.current,
                                        nativeEvent: event.nativeEvent,
                                    })) {
                                        // task 重命名里中文输入法 Enter 是候选确认，不是确认按钮。
                                        // 同时读取本地 composition 状态，避免平台事件时序让 isComposing 提前变 false。
                                        logger.debug("[TaskRenameDialog] ignore rename enter during IME", {
                                            valueLength: value.length,
                                        });
                                        return;
                                    }
                                    event.preventDefault();
                                    logger.info("[TaskRenameDialog] rename confirm via enter", {
                                        valueLength: value.length,
                                        trimmedLength: value.trim().length,
                                    });
                                    onConfirm();
                                }
                            } }) }), _jsxs(DialogFooter, { className: "flex items-center justify-end gap-3", children: [_jsx(Button, { type: "button", variant: "secondary", size: "lg", className: "h-10 min-w-0 px-5", onClick: onCancel, children: intl.formatMessage({ id: "common.cancel" }) }), _jsx(Button, { type: "button", size: "lg", className: "h-10 min-w-0 px-5", onClick: () => {
                                    logger.info("[TaskRenameDialog] rename confirm via button", {
                                        valueLength: value.length,
                                        trimmedLength: value.trim().length,
                                    });
                                    onConfirm();
                                }, children: intl.formatMessage({ id: "common.confirm" }) })] })] }) }) }));
}
//# sourceMappingURL=TaskRenameDialog.js.map