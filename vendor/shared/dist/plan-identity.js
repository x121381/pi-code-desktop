export function resolvePlanIdentitySnapshot(input) {
    const unknown = createPlanIdentitySnapshot(input.now, "unknown", "");
    if (!input.providerFamilyDomain) {
        return unknown;
    }
    const codingState = resolvePlanEntitlementState({
        snapshot: input.codingPlanEntitlement,
        now: input.now,
        entitlementCacheTtlMs: input.entitlementCacheTtlMs,
    });
    if (codingState.kind === "active") {
        return createPlanIdentitySnapshot(codingState.generatedAt, "coding_plan", codingState.planProductId);
    }
    if (codingState.kind !== "none") {
        return unknown;
    }
    const startState = resolvePlanEntitlementState({
        snapshot: input.startPlanEntitlement,
        now: input.now,
        entitlementCacheTtlMs: input.entitlementCacheTtlMs,
    });
    if (startState.kind === "active") {
        return createPlanIdentitySnapshot(startState.generatedAt, "start_plan", startState.planProductId);
    }
    if (startState.kind === "none") {
        return createPlanIdentitySnapshot(input.now, "no_plan", "");
    }
    return unknown;
}
function createPlanIdentitySnapshot(generatedAt, planStatus, planProductId) {
    return {
        generatedAt,
        planStatus,
        planProductId,
    };
}
function resolvePlanEntitlementState(input) {
    const snapshot = input.snapshot;
    if (!snapshot) {
        return { kind: "unknown" };
    }
    if (input.now - snapshot.generatedAt > input.entitlementCacheTtlMs) {
        return { kind: "unknown" };
    }
    if (!snapshot.authenticated || snapshot.unavailableReason === "unavailable") {
        return { kind: "unknown" };
    }
    if (snapshot.unavailableReason === "not_authenticated" ||
        snapshot.unavailableReason === "not_configured") {
        return { kind: "unknown" };
    }
    if (snapshot.unavailableReason === "no_plan") {
        return { kind: "none" };
    }
    if (snapshot.quota || snapshot.subscription || snapshot.remaining) {
        return {
            kind: "active",
            generatedAt: snapshot.generatedAt,
            planProductId: snapshot.subscription?.details[0]?.productId ?? "",
        };
    }
    return { kind: "unknown" };
}
//# sourceMappingURL=plan-identity.js.map