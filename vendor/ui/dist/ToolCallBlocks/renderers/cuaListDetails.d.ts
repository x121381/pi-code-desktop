import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
interface CuaAppItem {
    name: string;
    bundleId: string | null;
    active: boolean;
}
interface CuaWindowItem {
    title: string | null;
    width: number | null;
    height: number | null;
    main: boolean;
    focused: boolean;
}
export type CuaDetailList = {
    kind: "apps";
    items: CuaAppItem[];
} | {
    kind: "windows";
    items: CuaWindowItem[];
};
export declare function buildCuaDetailList(toolName: string, toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): CuaDetailList | undefined;
export declare function CuaDetailListSection({ list }: {
    list: CuaDetailList;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=cuaListDetails.d.ts.map