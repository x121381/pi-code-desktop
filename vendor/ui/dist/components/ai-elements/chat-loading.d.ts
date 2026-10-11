import type { ComponentPropsWithoutRef } from "react";
export interface ChatLoadingProps extends ComponentPropsWithoutRef<"div"> {
    loading: boolean;
    size?: "default" | "sm";
    className?: string;
}
export declare function ChatLoading({ loading, size, className, ...props }: ChatLoadingProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=chat-loading.d.ts.map