export type ConversationSharePermission = "private" | "link-viewer" | "link-editor";
export declare function ConversationSharePermissionPicker({ permission, onChange, disabled, variant, }: {
    permission: ConversationSharePermission;
    onChange: (permission: ConversationSharePermission) => void;
    disabled?: boolean;
    variant?: "default" | "compact";
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConversationSharePermissionPicker.d.ts.map