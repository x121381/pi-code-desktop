import { type SandboxPageOwner } from "@/plugin-ui/hostPrimitives.js";
import { type GenUiPage } from "../contract.js";
import { type GenUiPageInput } from "./page.js";
export interface RetainedGenUiPage extends GenUiPage, SandboxPageOwner {
    readonly kind: "gen-ui";
    attachConfirmation(confirm: GenUiPageInput["confirm"]): () => void;
    retry(): void;
}
export declare function acquireGenUiPage(input: Omit<GenUiPageInput, "confirm"> & {
    watchTaskRemoved(run: () => void): () => void;
}): Promise<RetainedGenUiPage>;
//# sourceMappingURL=retainedPage.d.ts.map