import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const inputVariants: (props?: ({
    size?: "default" | "xs" | "sm" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type InputVariantProps = VariantProps<typeof inputVariants>;
interface InputProps extends Omit<React.ComponentProps<"input">, "size">, InputVariantProps {
    htmlSize?: number;
}
declare const Input: React.ForwardRefExoticComponent<Omit<InputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
export { Input, inputVariants, type InputProps };
//# sourceMappingURL=input.d.ts.map