import type { GoalState } from "@zcode/shared/zcode-protocol-v4";
export interface ConversationGoalBannerProps {
    goal: GoalState;
}
/**
 * M4 goal 横幅：展示 sendGoalCommand/resumeGoal 的 goal 状态投影（objective/status/iteration）。
 * memo：goal 不变时不随 SessionPane 其他状态重渲染。
 */
declare function ConversationGoalBannerImpl({ goal }: ConversationGoalBannerProps): import("react/jsx-runtime").JSX.Element;
export declare const ConversationGoalBanner: import("react").MemoExoticComponent<typeof ConversationGoalBannerImpl>;
export {};
//# sourceMappingURL=ConversationGoalBanner.d.ts.map