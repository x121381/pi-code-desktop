import { type ReactNode } from "react";
import type { ApplicationIconRequest } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { type CuaDetailList } from "@/ToolCallBlocks/renderers/cuaListDetails.js";
import { type CuaScreenshotDetails } from "@/ToolCallBlocks/renderers/cuaScreenshotDetails.js";
import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
export declare function readCuaApplicationIconRequest(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): ApplicationIconRequest | string | null;
interface CuaDetailRow {
    labelId: string;
    value: string;
    code?: boolean;
    status?: boolean;
}
export interface CuaDetailsModel {
    actionRows: CuaDetailRow[];
    resultId: string;
    resultValues?: Record<string, string>;
    stateRows: CuaDetailRow[];
    success: boolean;
    list?: CuaDetailList;
    permissionRows?: CuaDetailRow[];
    environmentRows?: CuaDetailRow[];
    screenshot?: CuaScreenshotDetails;
    failureReasonId?: string;
    failureReason?: string;
    suggestedActionId?: string;
    suggestedAction?: string;
}
export declare function isCuaToolCall(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): boolean;
export interface CuaSummaryPresentation {
    toolName: string | null;
    icon: ReactNode;
    appName: string;
    primaryText: ReactNode;
    description: string;
    title: string;
    isFailed: boolean;
    failureText?: string;
}
type CuaIntl = ReturnType<typeof useZCodeIntl>["intl"];
export declare function buildCuaSummaryPresentation(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"], intl: CuaIntl, options?: {
    fallbackErrorText?: string;
    appIconClassName?: "size-4" | "size-5";
}): CuaSummaryPresentation;
export declare function CuaToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=cua.d.ts.map