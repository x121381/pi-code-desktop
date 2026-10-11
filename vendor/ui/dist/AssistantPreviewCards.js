import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileTextIcon, GlobeIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWorkspaceServices } from "@/hooks/useWorkspaceServices.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { getAssistantPreviewCardFilePath, shouldOpenAssistantHtmlInBrowser, } from "@/lib/assistantPreviewCards.js";
import { getAssistantPreviewCardsValidationSignature, resolveAssistantPreviewCardsWithoutFileStat, resolveValidatedAssistantPreviewCards, } from "@/lib/assistantPreviewCardValidation.js";
import { FileDisplayIcon, resolveFileDisplayDescriptor } from "@/lib/fileDisplay.js";
import { OpenSplitButton } from "@/OpenSplitButton.js";
export function buildAssistantPreviewCardFileSource(card, scope) {
    return {
        type: "file",
        title: card.title,
        path: card.path,
        ...(scope.workspacePath ? { workspacePath: scope.workspacePath } : {}),
        ...(scope.workspaceIdentity ? { workspaceIdentity: scope.workspaceIdentity } : {}),
        ...(scope.workspaceRemoteSessionId
            ? { workspaceRemoteSessionId: scope.workspaceRemoteSessionId }
            : {}),
    };
}
export function buildAssistantPreviewPptxAutoOpenRequest(visibleCards, baseKey, scope) {
    const pptxCards = visibleCards.filter((card) => card.type === "file" && card.kind === "pptx");
    if (pptxCards.length === 0)
        return null;
    return {
        // stat 结果对应的最终卡片签名必须进入一次性 key；同一 turn 的候选若晚到，
        // 不会把旧的校验投影误当成已经消费的新结果。
        key: JSON.stringify([baseKey, getAssistantPreviewCardsValidationSignature(pptxCards)]),
        sources: pptxCards.map((card) => buildAssistantPreviewCardFileSource(card, scope)),
    };
}
export function shouldRenderAssistantPreviewCardAsFile(card, scope) {
    const filePath = getAssistantPreviewCardFilePath(card);
    return (card.type !== "website" ||
        (card.url.startsWith("file://") &&
            filePath !== null &&
            !shouldOpenAssistantHtmlInBrowser({ path: filePath, ...scope })));
}
export function useAssistantPreviewCardValidation(cards, scope = {}) {
    const { fileService } = useWorkspaceServices(scope.workspacePath, scope.workspaceRemoteSessionId, scope.workspaceIdentity);
    const cardsSignature = useMemo(() => getAssistantPreviewCardsValidationSignature(cards), [cards]);
    const validationCardsRef = useRef({ cards, signature: cardsSignature });
    // timeline 重建时会传入内容相同但引用不同的 cards 数组，effect 若依赖数组引用会重复发起 RPC。
    // 只在语义签名变化时替换校验快照；workspace fileService 变化仍会使用同一快照重新校验。
    if (validationCardsRef.current.signature !== cardsSignature) {
        validationCardsRef.current = { cards, signature: cardsSignature };
    }
    const validationCards = validationCardsRef.current.cards;
    const statFreeVisibleCards = useMemo(() => resolveAssistantPreviewCardsWithoutFileStat(validationCards), [validationCards]);
    const [validationResult, setValidationResult] = useState(() => ({
        fileService: null,
        signature: "",
        visibleCards: [],
    }));
    useEffect(() => {
        if (statFreeVisibleCards) {
            return;
        }
        let disposed = false;
        // 历史消息切换时，上一条消息的已通过 stat 结果会在 effect 清理前短暂复用。
        // 这里按当前候选签名批量二次校验，全部算完后一次发布，避免文件卡先闪一批再被替换。
        void resolveValidatedAssistantPreviewCards(validationCards, fileService).then((visibleCards) => {
            if (disposed)
                return;
            setValidationResult({
                fileService,
                signature: cardsSignature,
                visibleCards,
            });
        }, () => {
            if (disposed)
                return;
            setValidationResult({
                fileService,
                signature: cardsSignature,
                visibleCards: [],
            });
        });
        return () => {
            disposed = true;
        };
    }, [cardsSignature, fileService, statFreeVisibleCards, validationCards]);
    if (statFreeVisibleCards) {
        return {
            visibleCards: statFreeVisibleCards,
            settled: true,
        };
    }
    const hasCurrentValidation = validationResult.fileService === fileService && validationResult.signature === cardsSignature;
    return {
        visibleCards: hasCurrentValidation ? validationResult.visibleCards : [],
        settled: hasCurrentValidation,
    };
}
export function AssistantPreviewCards({ cards, workspacePath, workspaceIdentity, workspaceRemoteSessionId, onOpenBrowserUrl, onOpenFileLink, onOpenCodeViewer, autoOpenPptxKey, onAutoOpenPptx, compactForRemoteControl, }) {
    const { intl } = useZCodeIntl();
    const { visibleCards, settled } = useAssistantPreviewCardValidation(cards, {
        workspacePath,
        workspaceIdentity,
        workspaceRemoteSessionId,
    });
    useEffect(() => {
        if (!settled || !autoOpenPptxKey || !onAutoOpenPptx)
            return;
        const request = buildAssistantPreviewPptxAutoOpenRequest(visibleCards, autoOpenPptxKey, {
            workspacePath,
            workspaceIdentity,
            workspaceRemoteSessionId,
        });
        if (!request)
            return;
        // 自动打开只能消费最终可见卡片；这样与 15 个候选、10 张上限和 Host stat
        // 完全同源，不会打开卡片中并不存在的文件。
        onAutoOpenPptx(request);
    }, [
        autoOpenPptxKey,
        onAutoOpenPptx,
        settled,
        visibleCards,
        workspaceIdentity,
        workspacePath,
        workspaceRemoteSessionId,
    ]);
    if (!settled || visibleCards.length === 0) {
        return null;
    }
    return (_jsx("div", { className: "flex w-full flex-col gap-3", children: visibleCards.map((card, index) => (_jsx(AssistantPreviewCardRow, { card: card, animationDelayMs: Math.min(index * 36, 240), subtitle: intl.formatMessage({ id: card.subtitleId }), workspacePath: workspacePath, workspaceIdentity: workspaceIdentity, workspaceRemoteSessionId: workspaceRemoteSessionId, onOpenBrowserUrl: onOpenBrowserUrl, onOpenFileLink: onOpenFileLink, onOpenCodeViewer: onOpenCodeViewer, compactForRemoteControl: compactForRemoteControl }, card.id))) }));
}
function AssistantPreviewCardRow({ card, animationDelayMs, subtitle, workspacePath, workspaceIdentity, workspaceRemoteSessionId, onOpenBrowserUrl, onOpenFileLink, onOpenCodeViewer, compactForRemoteControl, }) {
    const filePath = getAssistantPreviewCardFilePath(card);
    const renderAsFile = shouldRenderAssistantPreviewCardAsFile(card, {
        workspaceIdentity,
        workspaceRemoteSessionId,
        compactForRemoteControl,
    });
    const descriptor = filePath ? resolveFileDisplayDescriptor(filePath) : null;
    const fileSource = renderAsFile && filePath
        ? {
            type: "file",
            title: card.title,
            path: filePath,
            ...(workspacePath ? { workspacePath } : {}),
            ...(workspaceIdentity ? { workspaceIdentity } : {}),
            ...(workspaceRemoteSessionId ? { workspaceRemoteSessionId } : {}),
        }
        : null;
    return (_jsxs("div", { className: "flex w-full items-center gap-3 rounded-xl border border-card-border bg-card p-3 pr-4 text-foreground", "data-zcode-stream-animate": "true", style: {
            "--zcode-stream-animation-delay": `${animationDelayMs}ms`,
        }, children: [_jsx("div", { className: "flex size-11 shrink-0 items-center justify-center rounded-md bg-background text-foreground-subtle", children: !renderAsFile && card.type === "website" ? (_jsx(GlobeIcon, { className: "size-6" })) : descriptor ? (_jsx(FileDisplayIcon, { src: descriptor.fileIconSrc, size: 24 })) : (_jsx(FileTextIcon, { className: "size-6" })) }), _jsxs("div", { className: "min-w-0 flex flex-1 flex-col gap-1", children: [_jsx("div", { className: "truncate text-ui-base font-medium leading-5", children: card.title }), _jsx("div", { className: "truncate text-ui-base leading-5 text-foreground-subtlest", children: subtitle })] }), _jsx(OpenSplitButton, { target: !renderAsFile && card.type === "website"
                    ? {
                        type: "website",
                        url: card.url,
                        // website 卡有两个来源——html 引用卡（file://）与 localhost
                        // 预览卡（http(s) 活服务）。localPath 直开只对前者生效；localhost 卡
                        // 必须继续把 URL 交给浏览器，否则丢路由/动态内容。
                        localPath: card.url.startsWith("file:") ? card.filePath : undefined,
                    }
                    : {
                        type: "file",
                        path: filePath,
                        title: card.title,
                        label: card.title,
                        // Preview Card 以前没有 CodeViewer scope，远程 Linux path
                        // 会被 OpenSplitButton 当成本地路径交给宿主编辑器。
                        previewSource: card.type === "website"
                            ? fileSource
                            : buildAssistantPreviewCardFileSource(card, {
                                workspacePath,
                                workspaceIdentity,
                                workspaceRemoteSessionId,
                            }),
                    }, onOpenBrowserUrl: onOpenBrowserUrl, onOpenFileLink: onOpenFileLink, onOpenCodeViewer: onOpenCodeViewer })] }));
}
//# sourceMappingURL=AssistantPreviewCards.js.map