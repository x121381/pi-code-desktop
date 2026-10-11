import { z } from "zod";
export declare const zcodeTaskModeSchema: z.ZodEnum<{
    default: "default";
    plan: "plan";
    build: "build";
    edit: "edit";
    yolo: "yolo";
    guarded: "guarded";
    auto: "auto";
    acceptEdits: "acceptEdits";
    dontAsk: "dontAsk";
    bypassPermissions: "bypassPermissions";
    autoEdit: "autoEdit";
}>;
//# sourceMappingURL=zcode-task-mode-schema.d.ts.map