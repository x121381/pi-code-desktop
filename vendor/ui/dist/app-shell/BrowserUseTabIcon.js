import { jsx as _jsx } from "react/jsx-runtime";
import { MousePointer2Icon } from "lucide-react";
import { BrowserTabFavicon } from "@/app-shell/BrowserTabFavicon.js";
import { useBrowserUseOperationActive } from "@/browser-use/useBrowserUseOperationActive.js";
export function BrowserUseTabIcon({ tab }) {
    const isAgentOperating = useBrowserUseOperationActive(tab.browserUseOperationUntil);
    if (isAgentOperating) {
        return (_jsx("span", { "aria-hidden": "true", "data-browser-use-operation-indicator": "active", className: "browser-use-operation-breathe inline-flex size-3.5 shrink-0 items-center justify-center", children: _jsx(MousePointer2Icon, { className: "size-3.5" }) }));
    }
    return _jsx(BrowserTabFavicon, { faviconUrl: tab.faviconUrl });
}
//# sourceMappingURL=BrowserUseTabIcon.js.map