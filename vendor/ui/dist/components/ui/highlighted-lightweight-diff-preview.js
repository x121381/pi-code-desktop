import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { getLightweightDiffLineParts, LightweightDiffPreview, } from "../../components/ui/lightweight-diff-preview.js";
import { highlightCode, shouldUseSyntaxHighlighting, } from "../../lib/shikiHighlighter.js";
import { logger } from "../../logger.js";
const HIGHLIGHTED_LIGHTWEIGHT_DIFF_MAX_CHARS = 120_000;
export function getHighlightedLightweightDiffLine(line) {
    const lineParts = getLightweightDiffLineParts(line);
    return {
        code: lineParts.content,
        marker: lineParts.marker,
    };
}
export function buildHighlightedLightweightDiffCode(lines) {
    return lines.map((line) => getHighlightedLightweightDiffLine(line).code).join("\n");
}
function useHighlightedLightweightDiffTokens({ code, language, path, theme, }) {
    const [tokenizedCode, setTokenizedCode] = useState(null);
    useEffect(() => {
        setTokenizedCode(null);
        if (!code || code.length > HIGHLIGHTED_LIGHTWEIGHT_DIFF_MAX_CHARS) {
            return;
        }
        const shouldHighlight = shouldUseSyntaxHighlighting(language);
        const startedAt = Date.now();
        let cancelled = false;
        if (shouldHighlight) {
            logger.debug("[HighlightedLightweightDiffPreview] 启动异步 diff 高亮", {
                chars: code.length,
                language,
                path,
                theme,
            });
        }
        const tokenized = highlightCode(code, language, theme, (result) => {
            if (cancelled) {
                return;
            }
            if (shouldHighlight) {
                logger.debug("[HighlightedLightweightDiffPreview] 异步 diff 高亮完成", {
                    durationMs: Date.now() - startedAt,
                    language,
                    path,
                    theme,
                });
            }
            setTokenizedCode(result);
        });
        if (tokenized) {
            setTokenizedCode(tokenized);
        }
        return () => {
            cancelled = true;
        };
    }, [code, language, path, theme]);
    return tokenizedCode;
}
function renderHighlightedLightweightDiffTokens(tokens) {
    if (!tokens || tokens.length === 0) {
        return null;
    }
    return tokens.map((token, index) => (_jsx("span", { style: token.color ? { color: token.color } : undefined, children: token.content }, `${index}:${token.content}`)));
}
function HighlightedLightweightDiffCodeLine({ code, tokens, }) {
    const tokenNodes = renderHighlightedLightweightDiffTokens(tokens);
    return _jsx(_Fragment, { children: tokenNodes ?? (code || " ") });
}
export function HighlightedLightweightDiffPreview({ codePreviewSettings, language, lines, path, theme, ...props }) {
    const highlightCodeText = useMemo(() => buildHighlightedLightweightDiffCode(lines), [lines]);
    const tokenizedCode = useHighlightedLightweightDiffTokens({
        code: highlightCodeText,
        language,
        path,
        theme,
    });
    return (_jsx(LightweightDiffPreview, { codePreviewSettings: codePreviewSettings, "data-lightweight-diff-highlight-language": language, "data-lightweight-diff-highlight-theme": theme, "data-lightweight-diff-highlighted": tokenizedCode ? "true" : "false", lines: lines, renderLineContent: (line, index) => (_jsx(HighlightedLightweightDiffCodeLine, { code: line.content, tokens: tokenizedCode?.tokens[index] })), ...props }));
}
//# sourceMappingURL=highlighted-lightweight-diff-preview.js.map