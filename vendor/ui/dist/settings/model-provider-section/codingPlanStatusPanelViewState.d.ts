import type { CodingPlanStatus } from "./constants.js";
export interface CodingPlanStatusPanelViewState {
    displayStatus: CodingPlanStatus;
    actionStatus: CodingPlanStatus;
    balanceStatus: CodingPlanStatus;
    loginLoading: boolean;
}
export declare function resolveCodingPlanStatusPanelViewState({ status, loginPending, }: {
    status: CodingPlanStatus;
    loginPending: boolean;
}): CodingPlanStatusPanelViewState;
//# sourceMappingURL=codingPlanStatusPanelViewState.d.ts.map