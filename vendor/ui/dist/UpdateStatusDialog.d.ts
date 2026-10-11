import type { IntlInstance } from "@/i18n/IntlProvider.js";
import type { UpdateStatusDialogPhase } from "@/updateStatusModel.js";
type LocalizedUpdateReleaseNotes = {
    markdown: string;
    title: string;
};
export declare function UpdateStatusDialog({ displayVersion, edgeToEdge, intl, isUpdateActionPending, autoDownloadAndInstallUpdates, onAutoDownloadAndInstallUpdatesChange, onCancelDownload, onDownloadUpdate, onOpenChange, onRestartUpdate, onSkipUpdate, open, phase, progressLabel, progressValue, releaseDateLabel, showOverlay, skippableVersion, }: {
    displayVersion: string;
    edgeToEdge?: boolean;
    intl: IntlInstance;
    isUpdateActionPending: boolean;
    autoDownloadAndInstallUpdates: boolean;
    localizedUpdateReleaseNotes: LocalizedUpdateReleaseNotes | null;
    onAutoDownloadAndInstallUpdatesChange: (enabled: boolean) => Promise<void>;
    onCancelDownload: () => Promise<void>;
    onDownloadUpdate: () => Promise<void>;
    onOpenChange: (open: boolean) => void;
    onOpenReleaseNotesExternalUrl: (url: string) => void;
    onRestartUpdate: () => Promise<void>;
    onSkipUpdate: () => Promise<void>;
    open: boolean;
    phase: UpdateStatusDialogPhase;
    progressLabel: string | null;
    progressValue: number;
    releaseDateLabel: string | null;
    showOverlay?: boolean;
    skippableVersion: string | null;
}): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=UpdateStatusDialog.d.ts.map