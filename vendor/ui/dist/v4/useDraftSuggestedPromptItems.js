import { useEffect, useMemo } from "react";
import { isClientScenesBusinessError, useClientScenesResource, } from "../hooks/useClientScenesResource.js";
import { logger } from "../logger.js";
import { mapClientScenesToDraftSuggestedPromptItems, } from "../v4/draftSuggestedPromptItems.js";
export function useDraftSuggestedPromptItems({ clientScenesService, rpcReady, workspaceKey, }) {
    const clientScenes = useClientScenesResource(clientScenesService, {
        enabled: rpcReady,
    });
    useEffect(() => {
        const error = clientScenes.error;
        if (!error)
            return;
        if (isClientScenesBusinessError(error)) {
            logger.warn("[v4-suggested-prompts] Client scenes 返回失败，推荐列表保持为空", {
                code: error.code,
                message: error.responseMessage,
                workspaceKey,
            });
            return;
        }
        logger.warn("[v4-suggested-prompts] Client scenes 请求失败，推荐列表保持为空", {
            error: error.message,
            workspaceKey,
        });
    }, [clientScenes.error, workspaceKey]);
    return useMemo(() => mapClientScenesToDraftSuggestedPromptItems(clientScenes.scenes), [clientScenes.scenes]);
}
//# sourceMappingURL=useDraftSuggestedPromptItems.js.map