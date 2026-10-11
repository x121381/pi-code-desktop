import { type ReactNode } from "react";
import type { ApplicationIconRequest } from "@zcode/shared";
export declare function CuaAppSummaryIcon({ bundleId, fallback, iconRequest, name, className, }: {
    bundleId?: string;
    /**
     * 图标取不到时显示什么（平台无 resolver、Linux 无 locator、读取失败）。
     * 默认沿用 CUA 图标；node_repl 工具卡传入自己的图标，避免同一张卡在解析失败时
     * 跳成另一个指针图形。
     */
    fallback?: ReactNode;
    iconRequest?: ApplicationIconRequest | string | null;
    name: string;
    className?: "size-4" | "size-5";
}): string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>;
//# sourceMappingURL=cuaAppSummaryIcon.d.ts.map