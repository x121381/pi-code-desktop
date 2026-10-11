import type { ZCodePermissionRequest } from "@zcode/shared";
import type { WorkflowAskSettingsContent } from "@/components/workflow-timeline/workflowAskSettings.js";
/**
 * CreateWorkflow / AmendWorkflow 的运行确认块（docs/dynamic-workflow/presentation.md「The confirmation window」）：表头（问句 +
 * 名字，右侧只有 `N phases`——2026-09-09 起没有「compiled」灯，也不再数子代理与步）+ lineage（只有修订有）+ 两项 run
 * 设置（模型在上、上界在下；agent 回填了 `adjustable_settings` 时句中的值可改）+ saved 徽标 + **时间线** + 折叠脚本。
 * Deny / Refine / Run 仍由 PermissionDialog 给；改过的设置经 `onSettingsChange` 交回给它，随 Allow 应答发出。
 *
 * 修订的确认窗只在前驱是**别的会话**的 run（或用户亲手停过的 run）时出现：问句换成「调整此工作流？」，lineage 行说要改哪个 run、它是否还在跑。
 *
 * 权限块通常禁止折叠（见 PermissionDialog getPermissionBlockInteraction 的注释）；时间线和名称
 * 是决策关键内容且不可折叠，脚本是审计细节层。
 */
export declare function WorkflowPermissionBlock({ onSettingsBlockedChange, onSettingsChange, remoteSessionId, request, sessionModel, settingsDisabled, workspaceIdentity, workspacePath, }: {
    /** 所选子代理模型不可用：Allow 要等用户换一个。 */
    onSettingsBlockedChange?: (blocked: boolean) => void;
    /** 用户在窗里改了设置：只含改过的字段；全改回去即 undefined。 */
    onSettingsChange?: (content: WorkflowAskSettingsContent | undefined) => void;
    remoteSessionId?: string;
    request: ZCodePermissionRequest;
    /** 会话当前模型：「会话模型」那一项的名字。 */
    sessionModel?: {
        providerId: string;
        modelId: string;
    };
    /** 应答在途：控件与选项一起禁用。 */
    settingsDisabled?: boolean;
    workspaceIdentity?: string;
    /** 会话模型清单的作用域（PermissionDialog 给）：模型菜单与 provider 名都从它读。 */
    workspacePath?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowPermissionBlock.d.ts.map