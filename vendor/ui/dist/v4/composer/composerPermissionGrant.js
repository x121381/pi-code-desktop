/** 只消费明确审批事实；重复快照不能把用户后来改回的权限再刷成 yolo。 */
export function applyComposerPermissionGrant(draft, grant) {
    if (!grant || draft.lastPermissionGrantId === grant.interactionId)
        return draft;
    return { ...draft, mode: "yolo", lastPermissionGrantId: grant.interactionId };
}
//# sourceMappingURL=composerPermissionGrant.js.map