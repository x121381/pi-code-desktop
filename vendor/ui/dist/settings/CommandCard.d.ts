import type { UserCommand, ZCodeCommand } from "@zcode/shared";
import type { StorePluginItem } from "@/settings/pluginStoreListing.js";
export declare function isEditableUserCommand(command: ZCodeCommand): command is UserCommand;
interface CommandCardProps {
    command: ZCodeCommand;
    onEdit?: (command: ZCodeCommand) => void;
    onToggle?: (command: ZCodeCommand, enabled: boolean) => void;
    isOperating?: boolean;
    pluginIconItem?: Pick<StorePluginItem, "name" | "listing">;
}
export declare function CommandCard({ command, onEdit, onToggle, isOperating, pluginIconItem, }: CommandCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CommandCard.d.ts.map