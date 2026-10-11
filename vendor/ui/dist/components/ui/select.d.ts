import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
declare const selectTriggerVariants: (props?: ({
    variant?: "input" | "default" | "outline" | "secondary" | "ghost" | "destructive" | null | undefined;
    size?: "default" | "xs" | "sm" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function SelectGroup({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Group>): import("react/jsx-runtime").JSX.Element;
declare function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>): import("react/jsx-runtime").JSX.Element;
declare function SelectTrigger({ className, variant, size, children, indicator, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger> & VariantProps<typeof selectTriggerVariants> & {
    indicator?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
declare function SelectContent({ className, children, position, align, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>): import("react/jsx-runtime").JSX.Element;
declare function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>): import("react/jsx-runtime").JSX.Element;
type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item> & {
    trailing?: React.ReactNode;
};
declare const SelectItem: React.ForwardRefExoticComponent<Omit<SelectItemProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
type SelectRichItemProps = Omit<React.ComponentProps<typeof SelectPrimitive.Item>, "children"> & {
    /** 左侧 16–18px 图标。 */
    icon?: React.ReactNode;
    /** 进入 ItemText：触发器（SelectValue）只显示这一段。 */
    title: React.ReactNode;
    /** 标题同一行的标记（例如「默认」），不进触发器。 */
    titleAdornment?: React.ReactNode;
    /** 标题下一行的说明，不进触发器。 */
    description?: React.ReactNode;
};
/**
 * 两行选项：图标 + 标题 + 说明，选中态用尾部对勾（与输入框权限模式菜单同一版式）。
 * 用于选项需要解释后果的设置；列表宜配 `position="popper"`，避免 item-aligned 盖住行标签。
 */
declare const SelectRichItem: React.ForwardRefExoticComponent<Omit<SelectRichItemProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>): import("react/jsx-runtime").JSX.Element;
declare function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>): import("react/jsx-runtime").JSX.Element;
declare function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): import("react/jsx-runtime").JSX.Element;
export { Select, SelectContent, SelectGroup, SelectItem, SelectRichItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, selectTriggerVariants, };
//# sourceMappingURL=select.d.ts.map