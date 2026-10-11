import { type ZCodeConfigOption } from "@zcode/shared";
import { type ModelSelectGroup, type ModelSelectGroupItem } from "@/ModelConfigSelect.js";
/**
 * 子代理模型：composer 的同一份模型菜单，「会话模型」排第一；所选模型有思考档时，触发器旁边是
 * 设置页子代理那一格用的同一个思考档控件。清单为空时整格换成一句话（上限仍可调）。
 */
export declare function WorkflowRunSettingsModelField({ badge, disabled, groups, leadingItem, noCatalog, onLevelChange, onValueChange, thoughtOption, triggerLabel, value, }: {
    /** 触发器里的徽标：「会话模型」或「不可用」；缺席即无。 */
    badge?: {
        text: string;
        tone: "subtle" | "warning";
    };
    disabled: boolean;
    groups: readonly ModelSelectGroup[];
    leadingItem: ModelSelectGroupItem;
    /** 当前 agent 没有可选模型：整格退成一句话。 */
    noCatalog: boolean;
    onLevelChange: (level: string) => void;
    onValueChange: (value: string) => void;
    /** 所选模型的思考档；缺席即不画思考档控件。 */
    thoughtOption: ZCodeConfigOption | null;
    triggerLabel: string;
    value: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 「最大并发数」步进器：减、等宽数字、加，从 1 起、**没有上限**——默认并发 D 是起点不是天花板
 * （docs/dynamic-workflow/presentation.md「The settings popover」）。提示写「默认 N」，停在 D 上即
 * 「本 run 没有自己的界」，提示改写成「= 默认」。D 未知（老 CLI）时没有提示，数字照样可以直接敲。
 */
export declare function WorkflowRunSettingsBoundField({ bound, defaultConcurrency, disabled, onChange, }: {
    bound: number | null;
    defaultConcurrency: number | undefined;
    disabled: boolean;
    onChange: (bound: number) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowRunSettingsFields.d.ts.map