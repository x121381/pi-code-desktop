import type { V4UserInputViewModel } from "@/v4/pendingInteractionAdapter.js";
export interface V4UserInputDialogProps {
    model: V4UserInputViewModel;
    onSubmit: (answer: {
        optionId?: string;
        freeText?: string;
    }) => void;
}
/** v4 userInput 交互最小弹窗（竖切）。 */
export declare function V4UserInputDialog({ model, onSubmit }: V4UserInputDialogProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=V4UserInputDialog.d.ts.map