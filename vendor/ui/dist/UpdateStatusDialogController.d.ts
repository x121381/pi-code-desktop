import type { IPlatformService, UpdateStatePayload } from "@zcode/shared";
export declare function UpdateStatusDialogController({ platform, version, updateState, open, onOpenChange, edgeToEdge, showOverlay, }: {
    platform: IPlatformService;
    version: string | null;
    updateState: UpdateStatePayload | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    edgeToEdge?: boolean;
    showOverlay?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=UpdateStatusDialogController.d.ts.map