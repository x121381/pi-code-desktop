import type { WebRemoteControlWorkspaceTarget } from "@zcode/shared";
import { type WindowTabState } from "@/store/tabStore.js";
export declare function buildWebRemoteControlWorkspaceTargets({ tabs, reconnectingRemoteWorkspaceKeys, remoteWorkspaceErrorByWorkspaceKey, }: {
    tabs: WindowTabState[];
    reconnectingRemoteWorkspaceKeys?: string[];
    remoteWorkspaceErrorByWorkspaceKey?: Record<string, string>;
}): WebRemoteControlWorkspaceTarget[];
export declare function buildConnectedRemoteWorkspaceSessionTargets({ tabs, }: {
    tabs: WindowTabState[];
}): WebRemoteControlWorkspaceTarget[];
export declare function shouldPublishCompleteWorkspaceSnapshot(hasCompletedFullTabRestore: boolean): boolean;
//# sourceMappingURL=rootPlatformWorkspaceSync.d.ts.map