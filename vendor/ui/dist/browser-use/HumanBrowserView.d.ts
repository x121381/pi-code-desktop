import { type ComponentProps } from "react";
import { UnifiedBrowserView } from "@/browser-use/UnifiedBrowserView.js";
type HumanBrowserViewProps = Omit<ComponentProps<typeof UnifiedBrowserView>, "initialHumanViewportPreference" | "onHumanViewportPreferenceChange"> & {
    agentOpened?: boolean;
};
/** Browser 显示边界：普通 human tab 持久化偏好，Agent popup 使用独立默认 viewport。 */
export declare function HumanBrowserView(props: HumanBrowserViewProps): React.JSX.Element;
export {};
//# sourceMappingURL=HumanBrowserView.d.ts.map