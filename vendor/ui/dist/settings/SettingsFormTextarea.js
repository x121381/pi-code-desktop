import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/components/lib/utils.js";
import { Textarea } from "@/components/ui/textarea.js";
export function SettingsFormTextarea({ className, ...props }) {
    return (_jsx(Textarea, { className: cn("rounded-lg border border-input-border bg-input px-2 py-2 text-ui-base shadow-none placeholder:text-foreground-subtlest hover:border-input-border-hover focus-visible:border-input-border-focused focus-visible:bg-input-focused focus-visible:ring-0", className), ...props }));
}
//# sourceMappingURL=SettingsFormTextarea.js.map