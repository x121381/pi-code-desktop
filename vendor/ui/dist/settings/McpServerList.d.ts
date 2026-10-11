import { type McpServerStatus, type ZCodeMcpServer } from "@zcode/shared";
export declare function McpStatusDot({ status, attention, disabled, reason, }: {
    status?: McpServerStatus;
    attention?: boolean;
    disabled?: boolean;
    reason: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function McpServerList({ servers, onCreate, onEdit, onToggle, onOpenAuthorization, emptyTitle, emptyDescription, hideMetadata, }: {
    servers: ZCodeMcpServer[];
    onCreate: () => void;
    onEdit: (server: ZCodeMcpServer) => void;
    onToggle: (id: string, enabled: boolean) => void;
    onOpenAuthorization?: (server: ZCodeMcpServer) => void;
    emptyTitle: string;
    emptyDescription: string;
    hideMetadata?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=McpServerList.d.ts.map