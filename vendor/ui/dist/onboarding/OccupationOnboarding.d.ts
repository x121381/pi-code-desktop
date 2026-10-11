import { type ReactNode } from "react";
export declare function OccupationOnboarding({ children, showWindowControls, showChildrenWhileLoading, isMacDesktop, isWindowsDesktop, }: {
    children: ReactNode;
    /** Windows/Linux 自绘窗控：引导全屏覆盖主界面（含标题栏），需在此补最小化/最大化/关闭。 */
    showWindowControls?: boolean;
    /** 独立设置页不依赖引导设置加载，避免应用级引导外层遮住设置内容。 */
    showChildrenWhileLoading?: boolean;
    isMacDesktop?: boolean;
    isWindowsDesktop?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=OccupationOnboarding.d.ts.map