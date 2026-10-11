import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button.js";
export declare function useCodingPlanEntryGate(): {
    status: "error" | "ready" | "loading";
    label: string | undefined;
    retry: (() => void) | undefined;
};
/** 各入口共享同一查询状态；失败时按钮只重试，不继续执行购买动作。 */
export declare function CodingPlanEntryButton({ children, disabled, onClick, bypassGate, ...props }: ComponentProps<typeof Button> & {
    bypassGate?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CodingPlanEntryButton.d.ts.map