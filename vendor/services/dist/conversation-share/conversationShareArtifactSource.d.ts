import type { IFileService } from "#src/file/file.js";
export interface ConversationShareArtifactReadInput {
    workspacePath: string;
    ref: string;
    maxBytes: number;
}
export interface ConversationShareMaterializedArtifact {
    bytes: Uint8Array;
    canonicalPath: string;
}
export interface ConversationShareArtifactStat {
    canonicalPath: string;
    size: number;
    mtimeMs?: number;
}
export interface ConversationShareArtifactSource {
    read(input: ConversationShareArtifactReadInput): Promise<ConversationShareMaterializedArtifact>;
    stat?(input: Omit<ConversationShareArtifactReadInput, "maxBytes">): Promise<ConversationShareArtifactStat>;
}
/**
 * SSH/WSL/Docker 使用远端 fileService 完成 realpath/stat/range read；JWT 和 HTTP 上传仍留在 Desktop Host。
 */
export declare function createRemoteConversationShareArtifactSource(fileService: Pick<IFileService, "readFileRange" | "resolvePath" | "stat">): ConversationShareArtifactSource;
export declare function createLocalConversationShareArtifactSource(): ConversationShareArtifactSource;
//# sourceMappingURL=conversationShareArtifactSource.d.ts.map