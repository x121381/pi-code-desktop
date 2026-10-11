import { type SubagentRuntimeConfig, type SubagentRuntimeState } from "@zcode/shared";
interface Workspace {
    workspacePath: string;
    workspaceIdentity?: string;
}
interface ConfigReader {
    readUserRoot(): Promise<string>;
    readStatePath(): Promise<string>;
    readState(path: string): Promise<SubagentRuntimeState>;
}
/** Host 是解析结果的唯一 owner；每个父 turn 的 RPC 只复制已完成的内存 snapshot。 */
export declare function createSubagentRuntimeConfigCache(reader: ConfigReader): {
    prepare(workspace?: Workspace): Promise<void>;
    read(workspace: Workspace): Promise<SubagentRuntimeConfig>;
    dispose(): void;
};
export {};
//# sourceMappingURL=subagentRuntimeConfig.d.ts.map