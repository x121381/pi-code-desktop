import type { PluginSandboxHandle } from "@zcode/shared/mcp-apps";
import type { SandboxPagePlacement } from "../contract.js";
/** 实例与锚点分离；普通内联与正文在同一滚动树内，不用屏幕坐标追赶滚动。 */
export declare function createPluginUiPagePlane(events: {
    onVisibility(visible: boolean): void;
    onCrash(): void;
}): {
    bind(placement: SandboxPagePlacement): () => void;
    preview(node: HTMLElement | null): void;
    captureBounds(gutter?: number): {
        viewportSize: {
            width: number;
            height: number;
        };
        captureRect: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
    focus(): void;
    mount(handle: PluginSandboxHandle): void;
    prepareUnmount: (expectedId?: string) => void;
    unmount: (expectedId?: string) => void;
    dispose(): void;
};
//# sourceMappingURL=pluginUiPagePlane.d.ts.map