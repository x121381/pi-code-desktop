import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo } from "react";
import { WorkerPoolContextProvider, useWorkerPool, } from "@pierre/diffs/react";
import { createDiffsWorkerHighlighterOptions } from "../lib/diffsHighlighterEngine.js";
import { logger } from "../logger.js";
import { DEFAULT_CODE_PREVIEW_SETTINGS } from "../store/index.js";
import { useZCodeStore } from "../store/StoreProvider.js";
function createDiffsWorker() {
    return new Worker(new URL("../workers/diffs.worker.js", import.meta.url), {
        type: "module",
        name: "zcode-diffs-worker",
    });
}
function resolveWorkerPoolSize() {
    if (typeof navigator === "undefined") {
        return 2;
    }
    const hardwareConcurrency = navigator.hardwareConcurrency;
    if (!Number.isFinite(hardwareConcurrency) || hardwareConcurrency <= 0) {
        return 2;
    }
    return Math.max(1, Math.min(4, Math.floor(hardwareConcurrency / 2)));
}
function WorkerRenderOptionsSync({ highlighterOptions, }) {
    const workerPool = useWorkerPool();
    useEffect(() => {
        if (!workerPool) {
            return;
        }
        void workerPool
            .setRenderOptions({
            theme: highlighterOptions.theme,
            lineDiffType: highlighterOptions.lineDiffType,
            maxLineDiffLength: highlighterOptions.maxLineDiffLength,
            tokenizeMaxLineLength: highlighterOptions.tokenizeMaxLineLength,
            useTokenTransformer: highlighterOptions.useTokenTransformer,
        })
            .catch((error) => {
            logger.warn("[DiffsWorkerPoolProvider] 同步渲染参数失败", {
                error: error instanceof Error ? error.message : String(error),
            });
        });
    }, [highlighterOptions, workerPool]);
    return null;
}
export function DiffsWorkerPoolProvider({ children }) {
    const codePreviewSettings = useZCodeStore((state) => state.codePreviewSettings ?? DEFAULT_CODE_PREVIEW_SETTINGS);
    const highlighterOptions = useMemo(() => createDiffsWorkerHighlighterOptions({
        lightTheme: codePreviewSettings.lightTheme,
        darkTheme: codePreviewSettings.darkTheme,
    }), [codePreviewSettings.darkTheme, codePreviewSettings.lightTheme]);
    const poolSize = useMemo(() => resolveWorkerPoolSize(), []);
    const canUseWorkerPool = typeof window !== "undefined" && typeof Worker !== "undefined";
    if (!canUseWorkerPool) {
        return _jsx(_Fragment, { children: children });
    }
    return (_jsxs(WorkerPoolContextProvider, { poolOptions: {
            workerFactory: createDiffsWorker,
            poolSize,
        }, highlighterOptions: highlighterOptions, children: [_jsx(WorkerRenderOptionsSync, { highlighterOptions: highlighterOptions }), children] }));
}
//# sourceMappingURL=DiffsWorkerPoolProvider.js.map