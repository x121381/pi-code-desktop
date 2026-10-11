export interface CodingPlanEntryInventory {
    entryPlanList: string;
    status: "loading" | "error" | "ready";
    retry: () => void;
}
export declare function useCodingPlanEntryPlanList(): CodingPlanEntryInventory;
//# sourceMappingURL=useCodingPlanEntryPlanList.d.ts.map