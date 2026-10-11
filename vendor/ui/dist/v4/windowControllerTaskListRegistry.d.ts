import type { IWindowControllerService, WindowHostControllerTaskListResult, ZCodeTaskListQuery } from "@zcode/services";
export interface WindowControllerTaskListRegistry {
    subscribe(listener: () => void): () => void;
    getRevision(): number;
    list(queryKey: string, version: WindowControllerTaskListVersion, query: ZCodeTaskListQuery): Promise<WindowHostControllerTaskListResult>;
}
export interface WindowControllerTaskListVersion {
    controllerRevision: number;
    taskListVersionSignature: string;
    /** 只用于让连接前缓存随 remote session 换代失效，不参与 workspace identity。 */
    workspaceSourceGenerationSignature?: string;
    manualRefreshSerial?: number;
}
/** 一个 Controller proxy 对应一个共享观察器；所有列表 hook 只消费其 revision。 */
export declare function getWindowControllerTaskListRegistry(controller: IWindowControllerService): WindowControllerTaskListRegistry;
//# sourceMappingURL=windowControllerTaskListRegistry.d.ts.map