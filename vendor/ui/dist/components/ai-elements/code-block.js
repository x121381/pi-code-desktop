/*
 * Derived from vercel/ai-elements (packages/elements/src/code-block.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: local integration, formatting and adaptations.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from "../ui/button.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.js";
import { cn } from "../lib/utils.js";
import { CheckIcon, CopyIcon, Maximize2Icon, WrapTextIcon } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
import { CodeViewer } from "../../components/ui/code-viewer.js";
import { ControlHintTooltip } from "../../ControlHintTooltip.js";
import { FileDisplayIcon, resolveFileDisplayDescriptor } from "../../lib/fileDisplay.js";
import { isMermaidLanguage, shouldRenderMermaidCodeBlock } from "../../lib/mermaidLanguage.js";
import { getCurrentMermaidDocumentVisibility, resolveMermaidAutoRenderDecision, } from "../../lib/mermaidRenderBudget.js";
import { MermaidBlock } from "../../components/ai-elements/mermaid-block.js";
import { DiagramPreviewDialog } from "../../components/ai-elements/diagram-preview-dialog.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { logger } from "../../logger.js";
const LANGUAGE_DISPLAY_FILE_BY_LANGUAGE = {
    bash: "script.sh",
    cjs: "index.cjs",
    css: "style.css",
    go: "main.go",
    html: "index.html",
    javascript: "index.js",
    js: "index.js",
    jsx: "component.jsx",
    json: "data.json",
    markdown: "README.md",
    md: "README.md",
    mermaid: "diagram.mmd",
    mmd: "diagram.mmd",
    mjs: "index.mjs",
    python: "main.py",
    py: "main.py",
    rs: "main.rs",
    rust: "main.rs",
    sh: "script.sh",
    shell: "script.sh",
    toml: "config.toml",
    ts: "index.ts",
    tsx: "component.tsx",
    typescript: "index.ts",
    yaml: "config.yaml",
    yml: "config.yml",
    zsh: "script.zsh",
};
function resolveCodeBlockDisplayFile(language, displayFile) {
    const normalizedLanguage = language.trim().toLowerCase();
    return (displayFile ??
        LANGUAGE_DISPLAY_FILE_BY_LANGUAGE[normalizedLanguage] ??
        `code.${normalizedLanguage || "txt"}`);
}
function useDocumentVisibilityRevision(enabled) {
    const [revision, setRevision] = useState(0);
    useEffect(() => {
        // 普通代码块数量和消息流同量级，不能为非 Mermaid 块批量注册页面可见性监听。
        if (!enabled) {
            return;
        }
        if (typeof document === "undefined" || typeof document.addEventListener !== "function") {
            return;
        }
        const handleVisibilityChange = () => {
            setRevision((current) => current + 1);
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [enabled]);
    return revision;
}
// Context
const CodeBlockContext = createContext({
    code: "",
    mermaidPreviewAvailable: false,
    openMermaidPreview: () => { },
    toggleWrapLongLines: () => { },
    wrapLongLines: false,
});
export const CodeBlockContainer = ({ className, language, style, ...props }) => (_jsx("div", { className: cn("group relative w-full overflow-hidden rounded-xl bg-background text-foreground", className), "data-language": language, style: {
        containIntrinsicSize: "auto 200px",
        contentVisibility: "auto",
        ...style,
    }, ...props }));
export const CodeBlockHeader = ({ children, className, displayFile, language, showWrapButton = true, ...props }) => {
    const languageLabel = language?.trim() || "text";
    const descriptor = resolveFileDisplayDescriptor(resolveCodeBlockDisplayFile(languageLabel, displayFile));
    return (_jsx("div", { className: cn("flex items-center justify-between gap-3 px-3 py-2 text-ui-base text-muted-foreground", className), ...props, children: children ?? (_jsxs(_Fragment, { children: [_jsxs(CodeBlockTitle, { className: "min-w-0", children: [_jsx(FileDisplayIcon, { src: descriptor.fileIconSrc, size: 16, className: "shrink-0" }), _jsx(CodeBlockFilename, { className: "truncate lowercase", children: languageLabel })] }), _jsxs(CodeBlockActions, { children: [isMermaidLanguage(languageLabel) ? (_jsx(CodeBlockMermaidPreviewButton, {})) : showWrapButton ? (_jsx(CodeBlockWrapButton, {})) : null, _jsx(CodeBlockCopyButton, {})] })] })) }));
};
export const CodeBlockTitle = ({ children, className, ...props }) => (_jsx("div", { className: cn("flex items-center gap-2", className), ...props, children: children }));
export const CodeBlockFilename = ({ children, className, ...props }) => (_jsx("span", { className: cn("font-mono", className), ...props, children: children }));
export const CodeBlockActions = ({ children, className, ...props }) => (_jsx("div", { className: cn("-my-1 -mr-1 flex items-center gap-1", className), ...props, children: children }));
export const CodeBlock = ({ code, enableSyntaxHighlighting = true, language, showLineNumbers = false, theme, appTheme, wrapLongLines = false, fontSizePx = 14, renderMermaid = true, focusedRange = null, focusRequestId, markedLines, className, children, contentClassName, ...props }) => {
    const { intl } = useZCodeIntl();
    const [isWrapped, setIsWrapped] = useState(wrapLongLines);
    const [mermaidPreviewSvg, setMermaidPreviewSvg] = useState(null);
    const [mermaidPreviewOpen, setMermaidPreviewOpen] = useState(false);
    const canRenderMermaidCode = renderMermaid && shouldRenderMermaidCodeBlock(language, code);
    const documentVisibilityRevision = useDocumentVisibilityRevision(canRenderMermaidCode);
    const mermaidAutoRenderDecision = useMemo(() => {
        if (!canRenderMermaidCode) {
            return null;
        }
        return resolveMermaidAutoRenderDecision(code, {
            documentVisibilityState: getCurrentMermaidDocumentVisibility(),
        });
    }, [canRenderMermaidCode, code, documentVisibilityRevision]);
    const shouldRenderMermaid = canRenderMermaidCode && mermaidAutoRenderDecision?.shouldRender === true;
    useEffect(() => {
        setIsWrapped(wrapLongLines);
    }, [wrapLongLines]);
    const toggleWrapLongLines = useCallback(() => {
        setIsWrapped((current) => !current);
    }, []);
    const openMermaidPreview = useCallback(() => {
        setMermaidPreviewOpen(true);
    }, []);
    useEffect(() => {
        if (!shouldRenderMermaid) {
            setMermaidPreviewSvg(null);
            setMermaidPreviewOpen(false);
        }
    }, [shouldRenderMermaid]);
    useEffect(() => {
        if (!mermaidAutoRenderDecision || mermaidAutoRenderDecision.shouldRender) {
            return;
        }
        logger.debug("[CodeBlock] Mermaid 自动渲染跳过", {
            reason: mermaidAutoRenderDecision.reason,
            ...mermaidAutoRenderDecision.metrics,
        });
    }, [mermaidAutoRenderDecision]);
    const contextValue = useMemo(() => ({
        code,
        mermaidPreviewAvailable: Boolean(mermaidPreviewSvg),
        openMermaidPreview,
        toggleWrapLongLines,
        wrapLongLines: isWrapped,
    }), [code, isWrapped, mermaidPreviewSvg, openMermaidPreview, toggleWrapLongLines]);
    return (_jsx(CodeBlockContext.Provider, { value: contextValue, children: _jsxs(CodeBlockContainer, { className: className, language: language, ...props, children: [children, _jsx("div", { className: cn("p-2 pt-0 pb-3", contentClassName), children: shouldRenderMermaid ? (_jsx(MermaidBlock, { code: code, theme: appTheme, onOpenPreview: openMermaidPreview, onPreviewSvgChange: setMermaidPreviewSvg })) : (_jsx(CodeViewer, { code: code, enableSyntaxHighlighting: enableSyntaxHighlighting, language: language, showLineNumbers: showLineNumbers, theme: theme, wrapLongLines: isWrapped, focusedRange: focusedRange, focusRequestId: focusRequestId, markedLines: markedLines, className: "bg-transparent", fontSizePx: fontSizePx, 
                        // markdown 代码块外层是 bg-card，但 CodeViewer 默认把 @pierre/diffs 背景设成 background。
                        // 这里仅覆盖 markdown CodeBlock 入口，避免侧边栏文件预览的背景层级被一起改掉。
                        style: {
                            "--diffs-bg": "var(--color-card)",
                            "--diffs-light-bg": "var(--color-card)",
                            "--diffs-dark-bg": "var(--color-card)",
                            "--diffs-gap-block": "0px",
                        } })) }), shouldRenderMermaid && mermaidPreviewSvg ? (_jsx(DiagramPreviewDialog, { open: mermaidPreviewOpen, onOpenChange: setMermaidPreviewOpen, svg: mermaidPreviewSvg, title: intl.formatMessage({ id: "codeBlock.mermaid.ariaLabel" }) })) : null] }) }));
};
export const CodeBlockWrapButton = ({ "aria-label": ariaLabel, children, className, onClick, title, ...props }) => {
    const { toggleWrapLongLines, wrapLongLines } = useContext(CodeBlockContext);
    const { intl } = useZCodeIntl();
    const label = title ?? intl.formatMessage({ id: "codeBlock.wrapLines" });
    return (_jsx(ControlHintTooltip, { title: label, side: "top", children: _jsx(Button, { "aria-label": ariaLabel ?? label, "aria-pressed": wrapLongLines, className: cn("shrink-0", wrapLongLines && "bg-muted", className), onClick: (event) => {
                onClick?.(event);
                if (!event.defaultPrevented) {
                    toggleWrapLongLines();
                }
            }, size: "icon-md", type: "button", variant: "ghost", ...props, children: children ?? _jsx(WrapTextIcon, { className: "size-3.5" }) }) }));
};
export const CodeBlockMermaidPreviewButton = ({ "aria-label": ariaLabel, children, className, onClick, title, ...props }) => {
    const { intl } = useZCodeIntl();
    const { mermaidPreviewAvailable, openMermaidPreview } = useContext(CodeBlockContext);
    const label = title ?? intl.formatMessage({ id: "codeBlock.mermaid.openPreview" });
    return (_jsx(ControlHintTooltip, { title: label, side: "top", children: _jsx(Button, { "aria-label": ariaLabel ?? label, className: cn("shrink-0", className), disabled: !mermaidPreviewAvailable, onClick: (event) => {
                onClick?.(event);
                if (!event.defaultPrevented) {
                    openMermaidPreview();
                }
            }, size: "icon-md", type: "button", variant: "ghost", ...props, children: children ?? _jsx(Maximize2Icon, { className: "size-3.5" }) }) }));
};
export const CodeBlockCopyButton = ({ "aria-label": ariaLabel, onCopy, onError, title, timeout = 2000, children, className, ...props }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef(0);
    const { code } = useContext(CodeBlockContext);
    const { intl } = useZCodeIntl();
    const label = title ?? intl.formatMessage({ id: "codeBlock.copyCode" });
    const copyToClipboard = useCallback(async () => {
        if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
            onError?.(new Error("Clipboard API not available"));
            return;
        }
        try {
            if (!isCopied) {
                await navigator.clipboard.writeText(code);
                setIsCopied(true);
                onCopy?.();
                timeoutRef.current = window.setTimeout(() => setIsCopied(false), timeout);
            }
        }
        catch (error) {
            onError?.(error);
        }
    }, [code, onCopy, onError, timeout, isCopied]);
    useEffect(() => () => {
        window.clearTimeout(timeoutRef.current);
    }, []);
    const Icon = isCopied ? CheckIcon : CopyIcon;
    return (_jsx(ControlHintTooltip, { title: label, side: "top", children: _jsx(Button, { "aria-label": ariaLabel ?? label, className: cn("shrink-0", className), onClick: copyToClipboard, size: "icon-md", type: "button", variant: "ghost", ...props, children: children ?? _jsx(Icon, { className: "size-3.5" }) }) }));
};
export const CodeBlockLanguageSelector = (props) => (_jsx(Select, { ...props }));
export const CodeBlockLanguageSelectorTrigger = ({ className, ...props }) => (_jsx(SelectTrigger, { className: cn("h-7 border-none bg-transparent px-2 text-ui-base shadow-none", className), size: "sm", ...props }));
export const CodeBlockLanguageSelectorValue = (props) => (_jsx(SelectValue, { ...props }));
export const CodeBlockLanguageSelectorContent = ({ align = "end", ...props }) => _jsx(SelectContent, { align: align, ...props });
export const CodeBlockLanguageSelectorItem = (props) => (_jsx(SelectItem, { ...props }));
//# sourceMappingURL=code-block.js.map