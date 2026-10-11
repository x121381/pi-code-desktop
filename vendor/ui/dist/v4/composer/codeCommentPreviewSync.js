import { CODE_COMMENT_REMOVE_BROADCAST_CHANNEL, markCodeCommentRemoved, } from "../../lib/codeCommentContext.js";
import { logger } from "../../logger.js";
import { useCodeCommentPreviewStore } from "../../store/codeCommentPreviewStore.js";
export function removeCodeCommentPreview(attachment, port) {
    const payload = {
        id: attachment.id,
        workspacePath: attachment.workspacePath,
        ...(attachment.workspaceIdentity ? { workspaceIdentity: attachment.workspaceIdentity } : {}),
    };
    markCodeCommentRemoved(payload);
    useCodeCommentPreviewStore.getState().removeCommentBySource(payload);
    if (!port)
        return;
    try {
        void Promise.resolve(port.send({
            channel: CODE_COMMENT_REMOVE_BROADCAST_CHANNEL,
            payload,
        })).catch((error) => {
            logger.warn(`[v4-composer] code comment preview 广播失败: ${String(error)}`);
        });
    }
    catch (error) {
        logger.warn(`[v4-composer] code comment preview 广播失败: ${String(error)}`);
    }
}
//# sourceMappingURL=codeCommentPreviewSync.js.map