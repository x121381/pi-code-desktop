import { type DatabaseStartupState } from "@zcode/shared";
export declare function GlobalDatabaseStartupLoading({ state, onRetry, onCopy, onExit, }: {
    state: DatabaseStartupState | null;
    onRetry: () => void;
    onCopy: (details: string) => Promise<void>;
    onExit: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GlobalDatabaseStartupLoading.d.ts.map