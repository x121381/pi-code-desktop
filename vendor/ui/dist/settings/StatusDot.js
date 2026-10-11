import { jsx as _jsx } from "react/jsx-runtime";
// 通用状态圆点：tone 映射颜色，spinning 用旋转 loader。复用于设置页多处状态指示
// (McpServerList 的连接态、Computer Use 的权限 / Helper 运行态)，统一圆点样式与配色，避免各处重写。
import { CircleIcon, Loader2Icon } from "lucide-react";
const TONE_CLASS = {
    green: "text-green-500",
    amber: "text-yellow-500",
    red: "text-red-500",
    muted: "text-muted-foreground",
    subtle: "text-foreground-subtle",
};
export function StatusDot({ tone, spinning }) {
    const color = TONE_CLASS[tone];
    if (spinning) {
        return _jsx(Loader2Icon, { className: `size-3 animate-spin ${color}` });
    }
    return _jsx(CircleIcon, { className: `size-2 fill-current ${color}` });
}
//# sourceMappingURL=StatusDot.js.map