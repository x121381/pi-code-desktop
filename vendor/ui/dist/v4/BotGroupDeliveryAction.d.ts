import { type ReactNode } from "react";
import type { BotGroupDelivery } from "@zcode/shared";
export declare function BotGroupDeliveryProvider({ taskId, workspacePath, workspaceIdentity, children, }: {
    taskId: string | null;
    workspacePath: string;
    workspaceIdentity?: string;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function BotGroupDeliveryAction({ turnId, sourceCommandIds, syncing, results, busyId, onRetry, onReconcile, }: {
    turnId: string;
    sourceCommandIds: readonly string[];
    syncing: boolean;
    results: BotGroupDelivery[];
    busyId?: string | null;
    onRetry: (id: string) => void;
    onReconcile: (id: string, received: boolean) => void;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function ConnectedBotGroupDeliveryAction({ turnId, sourceCommandIds, }: {
    turnId: string;
    sourceCommandIds: readonly string[];
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=BotGroupDeliveryAction.d.ts.map