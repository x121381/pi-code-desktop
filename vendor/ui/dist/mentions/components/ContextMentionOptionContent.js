import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MessagesSquare } from "lucide-react";
import { FileDisplayInline } from "@/lib/fileDisplay.js";
export function ContextMentionOptionContent({ item, workspacePath, }) {
    return item.category === "files" ? (_jsx(FileDisplayInline, { path: item.data?.path ?? item.data?.relativePath ?? item.value, options: {
            basePath: workspacePath,
            // 这里只给 file/directory 传 kind，让 fileDisplay 继续按文件和文件夹图标渲染；
            // whiteboard 等非文件类候选不应该伪装成文件路径。
            kind: item.data?.kind === "file" || item.data?.kind === "directory"
                ? item.data.kind
                : undefined,
            showFilePath: true,
        } })) : (_jsxs("span", { className: "min-w-0 flex flex-1 items-center gap-2", children: [_jsx(MessagesSquare, { className: "size-3.5 shrink-0 text-foreground" }), _jsx("span", { className: "min-w-0 truncate text-ui-base font-medium text-foreground", children: item.label }), _jsx("span", { className: "min-w-0 truncate text-ui-xs text-foreground-subtlest", children: item.description })] }));
}
//# sourceMappingURL=ContextMentionOptionContent.js.map