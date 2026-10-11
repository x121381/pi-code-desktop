import { type ReactNode } from "react";
import type { WorkbenchSessionTarget } from "@/v4/workbenchSessionPlacement.js";
export type V4SplitPaneSessionTarget = WorkbenchSessionTarget;
interface V4SplitPaneEntryContextValue {
    readonly enabled: boolean;
    readonly canOpenSession: (target: V4SplitPaneSessionTarget) => boolean;
    readonly openSession: (target: V4SplitPaneSessionTarget) => void;
}
export declare function V4SplitPaneEntryProvider({ enabled, canOpenSession, onOpenSession, children, }: {
    enabled: boolean;
    canOpenSession: (target: V4SplitPaneSessionTarget) => boolean;
    onOpenSession: (target: V4SplitPaneSessionTarget) => void;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/** 右键入口由 shell 统一裁决，避免 task row 绕过 active group/draft pane owner。 */
export declare function useV4SplitPaneEntry(): V4SplitPaneEntryContextValue;
export {};
//# sourceMappingURL=splitPaneEntryContext.d.ts.map