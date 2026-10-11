export type RemoteWizardStep = "kind" | "settings" | "connecting" | "directory";
export declare function RemoteConnectionWizardSidebar({ currentStep }: {
    currentStep: RemoteWizardStep;
}): import("react/jsx-runtime").JSX.Element;
export declare function RemoteConnectionWizardHeader({ title, description, onMinimize, onClose, }: {
    title: string;
    description: string;
    onMinimize?: () => void;
    onClose?: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=RemoteConnectionWizardChrome.d.ts.map