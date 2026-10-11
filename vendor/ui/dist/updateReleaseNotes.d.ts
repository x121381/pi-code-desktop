import type { Locale, PostUpdateReleaseNotesPayload } from "@zcode/shared";
export type LocalizedUpdateReleaseNotes = {
    title: string;
    markdown: string;
};
export declare function getLocalizedUpdateReleaseNotes(payload: PostUpdateReleaseNotesPayload | undefined, locale: Locale): LocalizedUpdateReleaseNotes | null;
export declare function formatUpdateReleaseDate(releaseDate: string | undefined, locale: Locale): string | null;
//# sourceMappingURL=updateReleaseNotes.d.ts.map