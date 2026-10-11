import { type ReactNode } from "react";
import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
import type { ConversationCuaGroupEvent } from "@/v4/conversationCuaGroups.js";
export declare function scrollCuaGroupToBottom(viewport: Pick<HTMLElement, "scrollHeight" | "scrollTop">): void;
export declare function isCuaGroupViewportAtBottom(viewport: Pick<HTMLElement, "clientHeight" | "scrollHeight" | "scrollTop">): boolean;
interface CuaGroupRenderProps extends ToolCallBlockRenderContext {
    events?: readonly ConversationCuaGroupEvent[];
    renderAssistantMessage?: (event: Extract<ConversationCuaGroupEvent, {
        kind: "assistantMessage";
    }>) => ReactNode;
    renderReasoning?: (event: Extract<ConversationCuaGroupEvent, {
        kind: "reasoning";
    }>) => ReactNode;
}
export declare function CuaGroupToolCallBlock(context: CuaGroupRenderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=cua-group.d.ts.map