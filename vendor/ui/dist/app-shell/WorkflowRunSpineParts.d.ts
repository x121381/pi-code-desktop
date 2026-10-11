import type { StepRunStatus } from "@/components/workflow-graph/types.js";
import type { TimelineInk, TimelinePill, TimelineStation } from "@/components/workflow-timeline/timeline-model.js";
import { type SpineJoint, type SpineSection } from "@/app-shell/workflowRunSpine.js";
/**
 * 轨道段的一半。相邻两站之间的一段轨道拆成两截画：上一站从灯底到节底，下一站从节顶到灯顶——
 * 两截同一墨色，接在节的边界上。这样轨道随节的展开 / 折叠自己长短，不用量。
 *
 * 带里还有第三种：`full` 整节穿过（主轨经过分支站、分支轨经过别人的站），接头行里的主轨也是它。
 * 轨道 t > 0 的 x 用内联样式给（`21 + pitch·t`）——它是算出来的，Tailwind 生不出这个类。
 *
 * 行进段（`march`）是一条 1.5px 的**亮着的**轨道，不动：它说的是控制流已经走过的那条边，动作留给
 * 正在运行的灯。亮度沿着控制流的方向涨——`data-rail-position` 就是给样式表选渐变用的，两截都得带着
 * 它：`below`（上一节的下半截）从透明淡入到七成警示色，`above`（运行那一节的上半截）从七成涨到满，
 * 一直亮进灯里，`full` 是平的七成。
 */
export declare function SpineRail({ ink, overhang, pitch, position, stream, track, }: {
    ink: TimelineInk;
    position: "above" | "below" | "full";
    /** 流轨的一半：在节边界让出 `SPINE_STREAM_GAP_PX`，不叠行进的光。 */
    stream?: true;
    track?: number;
    /** 轨距（`workflowRunSpine.ts`）；只有 track > 0 才读它。 */
    pitch: number;
    /** 开口接头行的主轨：向行外伸出 `SPINE_STUB_PX`——根在上、汇点在下。 */
    overhang?: "top" | "bottom";
}): import("react/jsx-runtime").JSX.Element;
/**
 * 一节里全部的竖轨（`workflowRunSpine.ts` 算好的），一口气画出来。流轨的下半截在节底边的正中
 * 放两枚朝下的 chevron（presentation.md「The spine」）；z-index 1，下一节的节头悬停底色压不住它。
 */
export declare function SpinePieces({ pitch, section }: {
    pitch: number;
    section: SpineSection;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 接头行（presentation.md「The spine」）：分叉或汇合在两节**之间**占一行 16px。主轨从中直穿；每条
 * 分支沿同一根 y = 8 的母线离开（或回到）主轨——竖下、半径 min(6, pitch/2) 的一个转角、横到自己
 * 的列、再一个转角竖下到行底；只有一条分支时两个转角接成一个 S。汇合是分叉的镜像。
 *
 * 曲线一律先画底墨，行进的再沿同一条路径叠一条亮着的光（`MarchLight`）：从控制流来的那一头淡入、
 * 到灯那一头最亮，不动。渐变的两端就是画 `path` 的首尾两点；`id` 用 `useId()`，一张 SVG 里唯一。
 * 开口的行（没有前驱的分叉、没有汇合站的汇合）主轨不接上一节 / 下一节，而是朝行外伸出 4px 收成圆头：
 * 一个根、一个汇点（卡上的 TAIL / STUB）。整行是装饰（`aria-hidden`）：它说的事灯与节头已经说了。`joint` 缺席即这里没有接头，什么都不画。
 */
export declare function SpineJointRow({ joint, kind, pitch, }: {
    joint: SpineJoint | undefined;
    kind: "fork" | "merge";
    pitch: number;
}): import("react/jsx-runtime").JSX.Element | null;
/**
 * 轨道上的灯：空心 = 未到，绿 = 已过，红带环 = 失败，琥珀带搏动 = 正在运行。运行中的灯与卡上的灯
 * 同一条命（`wf-lamp-running`）：常亮的光晕加一下心跳；`motion-reduce` 时只剩光晕。
 */
export declare function SpineLamp({ pitch, status, track, }: {
    status: StepRunStatus;
    track?: number;
    pitch: number;
}): import("react/jsx-runtime").JSX.Element;
/** 折叠节头上的头像串：谁在这一站，一眼可见；子代理是按编号定色的瓦片脸，工作区是终端字形。 */
export declare function AvatarCluster({ pills, nameOf, }: {
    pills: readonly TimelinePill[];
    nameOf: (pill: TimelinePill) => string;
}): import("react/jsx-runtime").JSX.Element | null;
/** 轮次：`⟳ n`，只在回边两端且至少跑过一轮时在场（与卡上同一条规则）。 */
export declare function Rounds({ station }: {
    station: TimelineStation;
}): import("react/jsx-runtime").JSX.Element | null;
/**
 * 子代理行的尾巴：计数（「{n} 个任务 · {n} 次读取」），persona 点名了模型时再跟模型名
 * （presentation.md「The spine」）。模型名可以很长（自定义 provider 的「名字/模型」）：它与子代理名
 * 一起让位，计数不让。
 */
export declare function SpinePillTrailer({ counts, modelName, }: {
    counts: readonly string[];
    modelName: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
/** {@link workflowActorModelLabels} 按 actors 表与语言记忆一次（脊线每次重渲染都要查）。 */
export declare function useWorkflowActorModelLabels(actors: readonly {
    siteId: string;
    ordinal: number;
    model?: string;
}[] | undefined, providerName: ((providerId: string) => string | undefined) | undefined): ReadonlyMap<string, {
    name: string;
    canonical: string;
}>;
//# sourceMappingURL=WorkflowRunSpineParts.d.ts.map