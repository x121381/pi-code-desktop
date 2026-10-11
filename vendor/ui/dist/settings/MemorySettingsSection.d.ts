import { type IMemoryService } from "@zcode/services";
type MemoryCatalogService = Pick<IMemoryService, "listProjectMemories">;
export declare function MemorySettingsSection({ memoryEnabled, memoryService, onMemoryEnabledChange, projectMemoryViewerAvailable, workspaceDisplayNames, }: {
    memoryEnabled: boolean;
    memoryService: MemoryCatalogService;
    onMemoryEnabledChange: (enabled: boolean) => Promise<void>;
    projectMemoryViewerAvailable: boolean;
    workspaceDisplayNames?: readonly string[];
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MemorySettingsSection.d.ts.map