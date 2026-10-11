import { type ReactNode } from "react";
export declare const COLLAPSED_USER_INPUT_CONTENT_MAX_HEIGHT_PX = 120;
export declare function isUserInputContentOverflowing(scrollHeight: number): boolean;
export declare function resolveUserInputContentMaxHeight(expanded: boolean, contentScrollHeight: number): string;
export declare function ConversationUserInputBody({ children, contentText, rowId, }: {
    children: ReactNode;
    contentText: string;
    rowId: string | number;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConversationUserInputBody.d.ts.map