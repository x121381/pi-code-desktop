import type { ReactNode } from "react";
export declare function SettingsResourceGroupHeader({ actions, count, title, }: {
    actions?: ReactNode;
    count: number;
    title: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function SettingsResourceList<T>({ getKey, items, renderItem, }: {
    getKey: (item: T) => string;
    items: readonly T[];
    renderItem: (item: T) => ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=SettingsResourceGroup.d.ts.map