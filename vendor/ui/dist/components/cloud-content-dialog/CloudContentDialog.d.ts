import { type RefObject } from "react";
import type { CloudContentAction, CloudContentDialogPayload } from "@/components/cloud-content-dialog/cloudContentDialogTypes.js";
export type CloudDialogActionHandlers = {
    [K in Exclude<CloudContentAction["type"], "close">]?: (action: Extract<CloudContentAction, {
        type: K;
    }>, actionId?: string) => void | Promise<void>;
};
type CloudContentDialogProps = {
    payload: CloudContentDialogPayload;
    open: boolean;
    onClose: () => void;
    handlers: CloudDialogActionHandlers;
    labels: {
        actionFailed: string;
        copySucceeded?: string;
    };
    actionPending?: boolean;
    returnFocusRef?: RefObject<HTMLElement | null>;
};
export declare function CloudContentDialog(props: CloudContentDialogProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=CloudContentDialog.d.ts.map