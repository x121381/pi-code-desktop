import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
    checkIconStrokeWidth?: number;
};
declare function Checkbox({ className, checkIconStrokeWidth, ...props }: CheckboxProps): import("react/jsx-runtime").JSX.Element;
export { Checkbox };
//# sourceMappingURL=checkbox.d.ts.map