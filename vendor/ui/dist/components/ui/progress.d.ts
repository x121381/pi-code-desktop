import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
    segments?: readonly ProgressSegment[];
};
export interface ProgressSegment {
    className?: string;
    id: string;
    percent: number;
    style?: React.CSSProperties;
}
declare function Progress({ className, indicatorClassName, segments, value, ...props }: ProgressProps): import("react/jsx-runtime").JSX.Element;
export { Progress };
//# sourceMappingURL=progress.d.ts.map