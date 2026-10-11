import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
export type OpenSplitButtonTarget = {
    type: "website";
    url: string;
    localPath?: string;
} | {
    type: "file";
    path: string;
    title: string;
    label: string;
    previewSource?: CodeViewerSource;
};
interface OpenSplitButtonProps {
    target: OpenSplitButtonTarget;
    onOpenBrowserUrl?: (url: string) => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    hideOpenWithMenu?: boolean;
    stopPropagation?: boolean;
}
export declare function OpenSplitButton({ target, onOpenBrowserUrl, onOpenFileLink, onOpenCodeViewer, hideOpenWithMenu, stopPropagation, }: OpenSplitButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=OpenSplitButton.d.ts.map