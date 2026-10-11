import { type HTMLAttributes, type ReactNode } from "react";
import type { CloudContentDialogPayload } from "@/components/cloud-content-dialog/cloudContentDialogTypes.js";
export declare function CloudFormattedTextContent({ text, inline, onOpenExternal, }: {
    text: CloudContentDialogPayload["dialog"]["description"];
    inline?: boolean;
    onOpenExternal?: (url: string) => void;
}): ReactNode;
export declare function CloudDialogDescription({ description, onOpenExternal, ...props }: {
    description: CloudContentDialogPayload["dialog"]["description"];
    onOpenExternal?: (url: string) => void;
} & HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CloudDialogDescription.d.ts.map