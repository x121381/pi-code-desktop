import type { ZCodeTimelineMeta } from "@zcode/shared";
export declare function getZCodeTimelineIdentityKeys(timeline: ZCodeTimelineMeta): string[];
export declare function hasSharedZCodeTimelineIdentity(left: readonly string[], right: readonly string[]): boolean;
export declare function mergeZCodeTimelineMeta(previousTimeline: ZCodeTimelineMeta | undefined, nextTimeline: ZCodeTimelineMeta): ZCodeTimelineMeta;
//# sourceMappingURL=zcodeTimelineIdentity.d.ts.map