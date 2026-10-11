import { jsx as _jsx } from "react/jsx-runtime";
import { Hash } from "lucide-react";
import { cn } from "../components/lib/utils.js";
import { TASK_GROUP_COLOR_CLASS } from "../workspace-grouped-tasks/types.js";
function TaskGroupColorMark({ color }) {
    return (_jsx("span", { className: cn("flex size-5 shrink-0 items-center justify-center rounded-full", TASK_GROUP_COLOR_CLASS[color]), children: _jsx(Hash, { className: "size-3" }) }));
}
function TaskGroupColorDot({ color }) {
    return _jsx("span", { className: cn("size-2.5 shrink-0 rounded-full", TASK_GROUP_COLOR_CLASS[color]) });
}
export { TaskGroupColorDot, TaskGroupColorMark };
//# sourceMappingURL=colors.js.map