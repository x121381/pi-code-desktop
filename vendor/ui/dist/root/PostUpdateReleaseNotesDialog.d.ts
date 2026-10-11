import type { PostUpdateReleaseNotesPayload } from "@zcode/shared";
interface PostUpdateReleaseNotesDialogProps {
    payload: PostUpdateReleaseNotesPayload | null;
    onAcknowledge: () => void;
    onOpenExternalUrl?: (url: string) => void;
}
export declare function PostUpdateReleaseNotesDialog({ payload, onAcknowledge, onOpenExternalUrl, }: PostUpdateReleaseNotesDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PostUpdateReleaseNotesDialog.d.ts.map