import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../lib/utils.js";
import { LoaderIcon } from "lucide-react";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
function Spinner({ className, ...props }) {
    const { intl } = useZCodeIntl();
    return (_jsx(LoaderIcon, { role: "status", "aria-label": intl.formatMessage({ id: "common.loading" }), className: cn("size-4 animate-spin", className), ...props }));
}
export { Spinner };
//# sourceMappingURL=spinner.js.map