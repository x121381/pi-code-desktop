import type { ReactNode } from "react";
interface RootStartupLoadingProps {
    label: string;
    children?: ReactNode;
    busy?: boolean;
}
export declare function RootStartupLoading({ label, children, busy }: RootStartupLoadingProps): import("react/jsx-runtime").JSX.Element;
/** 初始化与引导共用品牌图标，保持底色、描边、圆角和标志比例一致。 */
export declare function ZCodeStartupLogoBadge({ animated }: {
    animated?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function ZCodeStartupLogo({ className, animated, }: {
    className?: string;
    animated?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=RootStartupLoading.d.ts.map