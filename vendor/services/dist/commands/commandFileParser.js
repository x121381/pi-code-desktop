function getCrossPlatformBasename(filePath) {
    return filePath.split(/[\\/]+/).pop() ?? "";
}
function splitMarkdownCommandContent(content) {
    const lines = content.split("\n");
    const frontmatterStart = lines.findIndex((line) => line.trim() === "---");
    const frontmatterEnd = lines.findIndex((line, index) => index > frontmatterStart && line.trim() === "---");
    if (frontmatterStart === -1 || frontmatterEnd === -1) {
        return { frontmatterLines: [], contentLines: lines };
    }
    return {
        frontmatterLines: lines.slice(frontmatterStart + 1, frontmatterEnd),
        contentLines: lines.slice(frontmatterEnd + 1),
    };
}
function readFrontmatterKey(line) {
    if (line.startsWith(" ") || line.startsWith("\t")) {
        return undefined;
    }
    const match = /^([A-Za-z0-9_-]+)\s*:/.exec(line.trim());
    return match?.[1]?.toLowerCase();
}
function readFrontmatterMultilineValue(lines, targetKey) {
    const collected = [];
    let collecting = false;
    for (const line of lines) {
        const key = readFrontmatterKey(line);
        if (key) {
            if (collecting) {
                break;
            }
            if (key === targetKey) {
                collecting = true;
                const value = line.split(":").slice(1).join(":").trim();
                if (value) {
                    collected.push(value);
                }
            }
            continue;
        }
        if (collecting && (line.startsWith(" ") || line.startsWith("\t"))) {
            collected.push(line.trim());
        }
    }
    const value = collected.join(" ").trim();
    return value || undefined;
}
function preserveFrontmatterLines(existingContent, replacedKeys) {
    const preserved = [];
    let skipUntilNextKey = false;
    for (const line of splitMarkdownCommandContent(existingContent ?? "").frontmatterLines) {
        const key = readFrontmatterKey(line);
        if (key) {
            skipUntilNextKey = replacedKeys.has(key);
        }
        if (!skipUntilNextKey) {
            preserved.push(line);
        }
    }
    return preserved;
}
function parseMarkdownCommandFile(content, filePath) {
    const { frontmatterLines, contentLines } = splitMarkdownCommandContent(content);
    const fileName = getCrossPlatformBasename(filePath);
    const name = `/${fileName.replace(/\.md$/i, "")}`;
    const prompt = contentLines.join("\n").trim();
    if (!name) {
        return null;
    }
    return {
        name,
        prompt,
        content: contentLines.join("\n"),
        filePath,
        description: readFrontmatterMultilineValue(frontmatterLines, "description"),
        argumentHint: readFrontmatterMultilineValue(frontmatterLines, "argument-hint"),
    };
}
function generateMarkdownCommandFileContent(config, existingContent) {
    const replacedKeys = new Set(["description", "argument-hint"]);
    const frontmatterLines = preserveFrontmatterLines(existingContent, replacedKeys);
    if (config.description?.trim()) {
        frontmatterLines.push(`description: ${config.description.trim()}`);
    }
    if (config.argumentHint?.trim()) {
        frontmatterLines.push(`argument-hint: ${config.argumentHint.trim()}`);
    }
    if (frontmatterLines.length === 0) {
        return config.prompt;
    }
    return `---
${frontmatterLines.join("\n")}
---

${config.prompt}`;
}
export class CommandFileParser {
    static parseCommandFile(content, filePath, _format = "markdown") {
        try {
            return parseMarkdownCommandFile(content, filePath);
        }
        catch {
            return null;
        }
    }
    static generateCommandFileContent(config, _format = "markdown", existingContent) {
        return generateMarkdownCommandFileContent(config, existingContent);
    }
}
//# sourceMappingURL=commandFileParser.js.map