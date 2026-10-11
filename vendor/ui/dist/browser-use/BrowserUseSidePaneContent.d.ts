import type { BrowserViewScreenshotSurfacePreparePayload } from "@zcode/shared";
import type { BrowserSidePaneMetadata, BrowserUseSidePaneTab } from "@/lib/workspaceSidePane.js";
export interface BrowserUseSidePaneContentProps {
    tab: BrowserUseSidePaneTab;
    onOpenPermissionSettings?: (origin: string) => void;
    isPanelVisible: boolean;
    isSelected: boolean;
    isCurrentTask: boolean;
    screenshotSurfaceRequest: BrowserViewScreenshotSurfacePreparePayload | null;
    initialUrl?: string;
    workspacePath: string;
    workspaceIdentity?: string;
    residencyGeneration?: number;
    onUrlChange(url: string): void;
    onPageMetadataChange(metadata: BrowserSidePaneMetadata): void;
}
/** browser-use 专用 TabsContent：非活动 tab 仅在截图准备期间保留真实合成布局。 */
export declare function BrowserUseSidePaneContent({ tab, onOpenPermissionSettings, isPanelVisible, isSelected, isCurrentTask, screenshotSurfaceRequest, initialUrl, workspacePath, workspaceIdentity, residencyGeneration, onUrlChange, onPageMetadataChange, }: BrowserUseSidePaneContentProps): React.JSX.Element;
//# sourceMappingURL=BrowserUseSidePaneContent.d.ts.map