import { jsx as _jsx } from "react/jsx-runtime";
import { BIGMODEL_PROVIDER_ID, ZAI_PROVIDER_ID } from "@zcode/shared";
import { LogInIcon } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import bigModelIcon from "@/assets/provider-icons/logo-bigmodel.svg";
import zaiIcon from "@/assets/provider-icons/logo-zai.svg";
const OAUTH_PROVIDER_ICON_SRC = {
    [BIGMODEL_PROVIDER_ID]: bigModelIcon,
    [ZAI_PROVIDER_ID]: zaiIcon,
};
export function renderOAuthProviderIcon(provider, className) {
    const src = OAUTH_PROVIDER_ICON_SRC[provider];
    if (!src) {
        return _jsx(LogInIcon, { className: cn("shrink-0", className) });
    }
    return (_jsx("img", { src: src, alt: "", "aria-hidden": "true", className: cn("shrink-0 object-contain", className) }));
}
//# sourceMappingURL=oauthProviderIcon.js.map