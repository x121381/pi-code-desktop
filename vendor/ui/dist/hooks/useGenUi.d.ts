import { type GenUiCardTarget, type RetainedGenUiPage } from "@/gen-ui/host.js";
export declare function useGenUi(target: GenUiCardTarget, confirm: (prompt: string) => Promise<string | null>, retry: number): {
    page: RetainedGenUiPage | null;
    error: string | undefined;
    supported: boolean;
    online: boolean;
};
//# sourceMappingURL=useGenUi.d.ts.map