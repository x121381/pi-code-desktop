import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
export interface SharedContextFormatterInputV1 {
    share: {
        shareId: string;
        title: string;
    };
    rows: ConversationRow[];
    installedArtifacts: Array<{
        artifactId: string;
        workspaceRelativePath: string;
        displayName: string;
        mimeType: string;
        sha256: string;
    }>;
}
export interface SharedContextDocumentV1 {
    formatterVersion: 1;
    markdown: string;
    markdownSha256: string;
    /** 本 build 认不出、没能进 Markdown 的 row kind；调用方负责记日志。 */
    unsupportedKinds: string[];
}
export declare function formatSharedContextV1(input: SharedContextFormatterInputV1): SharedContextDocumentV1;
//# sourceMappingURL=sharedContextFormatter.d.ts.map