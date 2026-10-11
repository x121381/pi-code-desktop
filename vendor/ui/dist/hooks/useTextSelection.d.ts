import { type RefObject } from "react";
/** 统一鼠标、键盘和触控选区的监听；作用域变化后旧选区不能路由到新任务。 */
export declare function useTextSelection<T>({ rootRef, enabled, inspect, scopeKey, observeSelectionChange, }: {
    rootRef: RefObject<HTMLDivElement | null>;
    enabled: boolean;
    inspect: () => T | null;
    scopeKey: unknown;
    observeSelectionChange?: boolean;
}): {
    state: T | null;
    close: () => void;
};
//# sourceMappingURL=useTextSelection.d.ts.map