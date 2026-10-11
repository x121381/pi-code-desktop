export type GroupInputReaction = "waiting" | "working" | "done" | "failed" | "cancelled";
export declare function createGroupInputReactionUpdater(apply: (key: string, state: GroupInputReaction) => Promise<void>): (key: string, state: GroupInputReaction) => Promise<void>;
//# sourceMappingURL=groupInputReaction.d.ts.map