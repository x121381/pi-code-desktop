import { createHash } from "node:crypto";
import { ConversationShareServiceError } from "../conversation-share/conversationShare.js";
function fenced(value) {
    const fence = value.includes("```") ? "````" : "```";
    return `${fence}\n${value}\n${fence}`;
}
export function formatSharedContextV1(input) {
    const paths = new Map(input.installedArtifacts.map((artifact) => [artifact.artifactId, artifact]));
    const sections = [`# Shared conversation: ${input.share.title}`];
    const unsupportedKinds = new Set();
    for (const row of input.rows) {
        switch (row.kind) {
            case "turnHeader":
                break;
            case "userInput":
                {
                    const attachmentLines = (row.attachments ?? []).flatMap((attachment) => {
                        const artifactId = attachment.ref.startsWith("zcode-artifact://share/")
                            ? attachment.ref.slice("zcode-artifact://share/".length)
                            : "";
                        const installed = paths.get(artifactId);
                        return installed
                            ? [
                                `- ${installed.displayName}`,
                                `  - Path: ${installed.workspaceRelativePath}`,
                                `  - MIME: ${installed.mimeType}`,
                                `  - SHA-256: ${installed.sha256}`,
                            ]
                            : [];
                    });
                    sections.push(`## User\n\n${row.text}${attachmentLines.length > 0
                        ? `\n\n### Attachments\n\n${attachmentLines.join("\n")}`
                        : ""}`);
                }
                break;
            case "assistantText":
                sections.push(`## Assistant\n\n${row.text}`);
                break;
            case "reasoning":
                sections.push(`## Reasoning\n\n${row.text}`);
                break;
            case "toolCall":
                sections.push(`## Tool: ${row.toolName}\n\n### Input\n\n${fenced(row.inputText)}${row.output?.text ? `\n\n### Output\n\n${fenced(row.output.text)}` : ""}`);
                break;
            case "timelineMarker":
                sections.push(`## Timeline\n\n${fenced(JSON.stringify(row.marker))}`);
                break;
            case "artifact": {
                const artifact = paths.get(row.artifactVersionId);
                if (!artifact) {
                    throw new ConversationShareServiceError("invalid_contract", "Shared context artifact was not installed");
                }
                sections.push([
                    `## Artifact: ${artifact.displayName}`,
                    `- Path: ${artifact.workspaceRelativePath}`,
                    `- MIME: ${artifact.mimeType}`,
                    `- SHA-256: ${artifact.sha256}`,
                ].join("\n"));
                break;
            }
            case "subagent":
            case "hookInvocation":
                throw new ConversationShareServiceError("invalid_contract", `Unsupported shared context row: ${row.kind}`);
            default:
                // 未来新增的 row kind：不抛（一行认不出不该让整次导入失败），但也不能静默——
                // 模型侧少内容必须留痕，否则只能靠用户发现回答漏了东西。
                unsupportedKinds.add(row.kind ?? "unknown");
                break;
        }
    }
    const markdown = `${sections.join("\n\n")}\n`;
    return {
        formatterVersion: 1,
        markdown,
        markdownSha256: createHash("sha256").update(markdown, "utf8").digest("hex"),
        unsupportedKinds: [...unsupportedKinds],
    };
}
//# sourceMappingURL=sharedContextFormatter.js.map