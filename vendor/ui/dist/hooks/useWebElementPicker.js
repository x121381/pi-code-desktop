import { useCallback, useEffect, useRef, useState } from "react";
import { logger } from "@/logger.js";
import { dispatchWebElementContextAddToChat, isWebElementContextPayload, } from "@/lib/webElementContext.js";
import { buildCancelWebElementPickerScript, buildWebElementPickerScript, } from "@/lib/webElementPickerScript.js";
function isWebElementPickerScriptResult(result) {
    if (typeof result !== "object" || result === null) {
        return false;
    }
    const candidate = result;
    return (candidate.status === "cancelled" ||
        (candidate.status === "selected" &&
            typeof candidate.element === "object" &&
            candidate.element !== null));
}
function buildPayload(params) {
    const payload = {
        ...params.result.element,
        workspacePath: params.workspacePath,
        ...(params.workspaceIdentity ? { workspaceIdentity: params.workspaceIdentity } : {}),
    };
    return isWebElementContextPayload(payload) ? payload : null;
}
function sanitizeUrlForLog(url) {
    try {
        const parsed = new URL(url);
        return `${parsed.origin}${parsed.pathname}`;
    }
    catch {
        return url.split(/[?#]/u)[0] ?? "";
    }
}
export function useWebElementPicker({ executeJs, workspacePath, workspaceIdentity, labels, }) {
    const [isPicking, setIsPicking] = useState(false);
    const activePickerRunRef = useRef(0);
    // executeJs 引用可能随每次渲染变化；用 ref 固定，避免 useCallback 依赖它而频繁重建。
    const executeJsRef = useRef(executeJs);
    executeJsRef.current = executeJs;
    const cancelPicking = useCallback(async () => {
        activePickerRunRef.current += 1;
        setIsPicking(false);
        try {
            await executeJsRef.current(buildCancelWebElementPickerScript());
        }
        catch (error) {
            logger.debug("[UnifiedBrowserView] 取消网页元素选择失败", {
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }, []);
    const startPicking = useCallback(async () => {
        const runId = activePickerRunRef.current + 1;
        activePickerRunRef.current = runId;
        setIsPicking(true);
        logger.info("[UnifiedBrowserView] 开始网页元素选择");
        try {
            const result = await executeJsRef.current(buildWebElementPickerScript(labels ? { labels } : {}));
            if (activePickerRunRef.current !== runId) {
                return;
            }
            if (!isWebElementPickerScriptResult(result)) {
                logger.warn("[UnifiedBrowserView] 网页元素选择返回了无法识别的结果");
                return;
            }
            if (result.status === "cancelled") {
                logger.info("[UnifiedBrowserView] 网页元素选择已取消");
                return;
            }
            const payload = buildPayload({
                result,
                workspacePath,
                workspaceIdentity,
            });
            if (!payload) {
                logger.warn("[UnifiedBrowserView] 网页元素上下文无效，已丢弃");
                return;
            }
            dispatchWebElementContextAddToChat(payload);
            logger.info("[UnifiedBrowserView] 网页元素上下文已加入聊天", {
                tagName: payload.tagName,
                url: sanitizeUrlForLog(payload.pageUrl),
            });
        }
        catch (error) {
            logger.warn("[UnifiedBrowserView] 网页元素选择失败", {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
        finally {
            if (activePickerRunRef.current === runId) {
                setIsPicking(false);
            }
        }
    }, [labels, workspaceIdentity, workspacePath]);
    const togglePicking = useCallback(async () => {
        if (isPicking) {
            await cancelPicking();
            return;
        }
        await startPicking();
    }, [cancelPicking, isPicking, startPicking]);
    useEffect(() => {
        if (!isPicking) {
            return;
        }
        const handleWindowKeyDown = (event) => {
            if (event.key !== "Escape") {
                return;
            }
            event.preventDefault();
            // 受控视图获得焦点时由注入脚本处理 Esc；焦点还在外层工具栏时，
            // 这里兜底取消，保证选择态不会因为焦点位置不同而卡住。
            void cancelPicking();
        };
        window.addEventListener("keydown", handleWindowKeyDown, true);
        return () => {
            window.removeEventListener("keydown", handleWindowKeyDown, true);
        };
    }, [cancelPicking, isPicking]);
    useEffect(() => {
        return () => {
            void cancelPicking();
        };
    }, [cancelPicking]);
    return {
        cancelPicking,
        isPicking,
        startPicking,
        togglePicking,
    };
}
//# sourceMappingURL=useWebElementPicker.js.map