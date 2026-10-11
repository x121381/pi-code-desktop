import { type ZCodeConfigOption } from "@zcode/shared";
import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
export type SubagentReasoningFieldState = {
    kind: "not-applicable";
} | {
    kind: "unknown";
    status: "loading" | "unavailable";
} | {
    kind: "unsupported";
} | {
    kind: "supported";
    option: ZCodeConfigOption;
};
export declare function SubagentReasoningField({ disabled, intl, labelVisibilityClassName, onValueCommit, state, }: {
    disabled: boolean;
    intl: ReturnType<typeof useZCodeIntl>["intl"];
    labelVisibilityClassName: string;
    onValueCommit: (value: string) => void;
    state: SubagentReasoningFieldState;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=SubagentReasoningField.d.ts.map