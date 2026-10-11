interface WorkflowRunArtifactBytesState {
    bytes: Uint8Array<ArrayBuffer> | null;
    blob: Blob | null;
    /** Blob 的 object URL；`<img src>` / PdfViewer 用。卸载与换版本时自动 revoke。 */
    objectUrl: string | null;
    /** journal 记录上的 contentType（不是 store 重新嗅探出来的那个）——渲染器分派的精确匹配契约。 */
    mediaType: string | null;
    totalBytes: number | null;
    loading: boolean;
    error: string | null;
    /**
     * `bytes` 属于哪一版。换版本后、effect 清空旧状态之前有一帧 `version` 已是新值而 `bytes`
     * 还是旧版的；查看器闪一帧无妨，但「作为文件打开」的副本只写一次，拿错字节就永久错了——
     * 这类消费方必须核对它，而不是信任「当前渲染的 version」。
     */
    bytesVersion: number | null;
}
/**
 * 字节 → base64。office 查看器只吃 `FileBinaryPreview.dataBase64`，所以这条回程路是必要的。
 *
 * 分段（8 KiB）而不是 `String.fromCharCode(...bytes)`：后者在 20 MiB 上会以
 * "Maximum call stack size exceeded" 炸掉——展开成 2000 万个实参。
 */
export declare function encodeBytesToBase64(bytes: Uint8Array<ArrayBuffer>): string;
export declare function useWorkflowRunArtifactBytes(options: {
    sessionId: string;
    runId: string;
    artifactId: string;
    version: number;
    /** 关掉即不读，也不留下任何 object URL（预置看板与折叠态都靠它省掉整条链路）。 */
    enabled?: boolean;
}): WorkflowRunArtifactBytesState;
export {};
//# sourceMappingURL=useWorkflowRunArtifactBytes.d.ts.map