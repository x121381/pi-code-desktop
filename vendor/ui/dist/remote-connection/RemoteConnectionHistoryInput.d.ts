import { type ComponentProps } from "react";
import { Input } from "@/components/ui/input.js";
export declare function RemoteConnectionHistoryInput({ containerClassName, suggestionWidth, label, placeholder, value, suggestions, emptyText, onChange, ...inputProps }: {
    containerClassName?: string;
    suggestionWidth?: string;
    label?: string;
    placeholder: string;
    value: string;
    suggestions: string[];
    emptyText: string;
    onChange: (value: string) => void;
} & Omit<ComponentProps<typeof Input>, "children" | "onChange" | "placeholder" | "size" | "value">): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=RemoteConnectionHistoryInput.d.ts.map