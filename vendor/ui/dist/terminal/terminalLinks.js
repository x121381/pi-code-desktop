const HTTP_URL_PATTERN = /\bhttps?:\/\/[^\s<>"'`]+/gi;
const TRAILING_PUNCTUATION_PATTERN = /[.,;:!?]+$/;
const CLOSING_BRACKET_PAIRS = {
    ")": "(",
    "]": "[",
    "}": "{",
};
function countChar(value, char) {
    let count = 0;
    for (const current of value) {
        if (current === char) {
            count += 1;
        }
    }
    return count;
}
function trimTerminalUrlCandidate(value) {
    let trimmed = value.replace(TRAILING_PUNCTUATION_PATTERN, "");
    for (;;) {
        const last = trimmed.at(-1);
        const opening = last ? CLOSING_BRACKET_PAIRS[last] : undefined;
        if (!last || !opening) {
            return trimmed;
        }
        if (countChar(trimmed, last) <= countChar(trimmed, opening)) {
            return trimmed;
        }
        trimmed = trimmed.slice(0, -1).replace(TRAILING_PUNCTUATION_PATTERN, "");
    }
}
export function findHttpLinksInTerminalText(text) {
    const links = [];
    for (const match of text.matchAll(HTTP_URL_PATTERN)) {
        const raw = match[0];
        const startIndex = match.index ?? 0;
        const trimmed = trimTerminalUrlCandidate(raw);
        if (!trimmed) {
            continue;
        }
        links.push({
            text: trimmed,
            startIndex,
            endIndex: startIndex + trimmed.length - 1,
        });
    }
    return links;
}
function appendCellText(snapshot, chars, position) {
    const text = chars || " ";
    snapshot.text += text;
    for (let index = 0; index < text.length; index += 1) {
        snapshot.positions.push(position);
    }
}
function appendBufferLine(snapshot, line, bufferLine, cols) {
    const reusableCell = line.getCell(0);
    for (let cellX = 0; cellX < cols; cellX += 1) {
        const current = line.getCell(cellX, reusableCell);
        if (!current || current.getWidth() === 0) {
            continue;
        }
        appendCellText(snapshot, current.getChars(), { bufferLine, cellX });
    }
}
function getWrappedLineRange(buffer, bufferLineNumber) {
    let start = bufferLineNumber - 1;
    while (start > 0 && buffer.getLine(start)?.isWrapped) {
        start -= 1;
    }
    let end = bufferLineNumber - 1;
    while (end + 1 < buffer.length && buffer.getLine(end + 1)?.isWrapped) {
        end += 1;
    }
    return { start, end };
}
function readWrappedLineSnapshot(buffer, bufferLineNumber, cols) {
    const { start, end } = getWrappedLineRange(buffer, bufferLineNumber);
    const snapshot = { text: "", positions: [] };
    for (let lineIndex = start; lineIndex <= end; lineIndex += 1) {
        const line = buffer.getLine(lineIndex);
        if (!line) {
            return null;
        }
        appendBufferLine(snapshot, line, lineIndex + 1, cols);
    }
    return snapshot;
}
export function getHttpLinksForTerminalBufferLine(buffer, bufferLineNumber, cols) {
    const snapshot = readWrappedLineSnapshot(buffer, bufferLineNumber, cols);
    if (!snapshot || !snapshot.text) {
        return undefined;
    }
    const links = [];
    for (const match of findHttpLinksInTerminalText(snapshot.text)) {
        const start = snapshot.positions[match.startIndex];
        const end = snapshot.positions[match.endIndex];
        if (!start || !end) {
            continue;
        }
        const link = {
            text: match.text,
            range: {
                start: { x: start.cellX + 1, y: start.bufferLine },
                end: { x: end.cellX + 1, y: end.bufferLine },
            },
            decorations: {
                // 交互说明：xterm 的 link provider 只在 hover 时绘制装饰。
                // 这里显式打开下划线和手型，避免 http 链接看起来只是普通终端文本。
                underline: true,
                pointerCursor: true,
            },
        };
        if (link.range.start.y <= bufferLineNumber && link.range.end.y >= bufferLineNumber) {
            links.push(link);
        }
    }
    return links.length > 0 ? links : undefined;
}
//# sourceMappingURL=terminalLinks.js.map