import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { ZCodeIntlProvider } from "@/i18n/IntlProvider.js";
import { UpdateStatusDialogController } from "@/UpdateStatusDialogController.js";
import { ConfirmDialogHost } from "@/ConfirmDialog.js";
export function UpdateStatusWindowRoot({ platform, initialLocale, onRequestClose, }) {
    const [open, setOpen] = useState(true);
    const [locale, setLocale] = useState(initialLocale);
    const [updateState, setUpdateState] = useState(null);
    const [readyVersion, setReadyVersion] = useState(null);
    const revisionRef = useRef(0);
    const handleOpenChange = useCallback((nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            onRequestClose();
        }
    }, [onRequestClose]);
    useEffect(() => {
        const disposers = [];
        const eventRevision = () => {
            revisionRef.current += 1;
            return revisionRef.current;
        };
        // 独立更新窗口没有主窗口的 app chrome state，必须自己做一次
        // getUpdateState 快照补偿；同时用 revision 避免旧快照覆盖更晚的实时事件。
        const snapshotRevision = revisionRef.current;
        void platform.getUpdateState?.().then((payload) => {
            if (revisionRef.current !== snapshotRevision) {
                return;
            }
            setUpdateState(payload);
        });
        disposers.push(platform.onUpdateStateChanged?.((payload) => {
            eventRevision();
            setUpdateState(payload);
        }) ?? (() => { }));
        disposers.push(platform.onUpdateReady((version) => {
            setReadyVersion(version);
        }));
        disposers.push(platform.onApplicationLocaleChanged?.((nextLocale) => {
            setLocale(nextLocale);
        }) ?? (() => { }));
        return () => {
            for (const dispose of disposers) {
                dispose();
            }
        };
    }, [platform]);
    return (_jsx("div", { className: "min-h-screen bg-transparent text-foreground", children: _jsxs(ZCodeIntlProvider, { initialLocale: locale, children: [_jsx(UpdateStatusDialogController, { platform: platform, version: readyVersion, updateState: updateState, open: open, onOpenChange: handleOpenChange, edgeToEdge: true, showOverlay: false }), _jsx(ConfirmDialogHost, {})] }, locale) }));
}
//# sourceMappingURL=UpdateStatusWindowRoot.js.map