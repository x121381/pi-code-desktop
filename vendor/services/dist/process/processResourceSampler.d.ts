import { type HostResourceUsageProcess, type ZCodeProcessChildProcess } from "@zcode/shared";
export interface ProcessResourceRow {
    pid: number;
    ppid: number;
    rssKb: number;
    /** 进程累计 CPU 时间（user + system），毫秒 */
    cpuTimeMs: number;
    /** 命令名或可执行路径（平台原样） */
    command: string;
}
export type ProcessResourceTableReader = (signal?: AbortSignal) => Promise<ProcessResourceRow[] | undefined>;
interface ExecFileResult {
    error?: unknown;
    stdout: string;
}
type ExecFileFn = (file: string, args: readonly string[], options: {
    timeout: number;
    maxBuffer: number;
    windowsHide?: boolean;
    signal?: AbortSignal;
}) => Promise<ExecFileResult>;
/**
 * 解析 ps 的 cputime 文本：macOS `[[dd-]hh:]mm:ss.cc`、Linux `[dd-]hh:mm:ss`。
 * 返回毫秒；无法解析返回 undefined。
 */
export declare function parseCpuTimeText(text: string): number | undefined;
/** `ps -axo pid=,ppid=,rss=,cputime=,comm=` 的输出；comm 可能含空格，取前 4 列后剩余全部为 comm */
export declare function parseDarwinProcessTable(stdout: string): ProcessResourceRow[];
/** 解析 `/proc/<pid>/stat`：comm 用括号包裹且可含空格/括号，按最后一个 `)` 切分 */
export declare function parseLinuxProcStat(content: string): {
    pid: number;
    ppid: number;
    command: string;
    cpuTimeMs: number;
} | undefined;
/** 解析 `/proc/<pid>/status` 里的 `VmRSS:\t 1234 kB` */
export declare function parseLinuxVmRssKb(content: string): number;
/** PowerShell 输出：`pid ppid workingSetBytes cpu100ns name...` */
export declare function parseWindowsProcessTable(stdout: string): ProcessResourceRow[];
export interface CreateProcessResourceTableReaderOptions {
    platform?: NodeJS.Platform;
    execFile?: ExecFileFn;
    readdir?: (path: string) => Promise<string[]>;
    readFile?: (path: string) => Promise<string>;
}
/** 按平台读取整机进程表；任何失败都返回 undefined（本轮跳过），不抛错 */
export declare function createProcessResourceTableReader(options?: CreateProcessResourceTableReaderOptions): ProcessResourceTableReader;
export interface ProcessResourceSample {
    pid: number;
    ppid: number;
    rssKb: number;
    /** 整机归一化 CPU 百分比；首个样本无差分基线记 0 */
    cpuPercent: number;
    command: string;
}
export interface ProcessResourceSampler {
    sample(signal?: AbortSignal): Promise<Map<number, ProcessResourceSample> | undefined>;
}
export interface CreateProcessResourceSamplerOptions {
    readTable: ProcessResourceTableReader;
    now?: () => number;
    logicalCpuCount?: number;
}
export declare function createProcessResourceSampler(options: CreateProcessResourceSamplerOptions): ProcessResourceSampler;
export interface HostResourceUsageAgent {
    pid: number;
    provider: string;
    workspacePath: string;
    /** CLI `process/childProcesses` 的回报；请求失败时为空数组，其后代全部归入 cli */
    children: readonly ZCodeProcessChildProcess[];
}
export interface AttributeHostProcessTreeOptions {
    samples: ReadonlyMap<number, ProcessResourceSample>;
    hostPid: number;
    agents: readonly HostResourceUsageAgent[];
    /** Host 直接管理的内置插件进程（如 Windows CUA Helper）：pid → 插件名 */
    builtinPluginPids?: ReadonlyMap<number, string>;
}
/**
 * 把 Host 的全部后代按“最近的已知祖先”归属：
 * MCP 根 pid → 对应插件；Agent pid → 基础服务 cli；无归属 → 基础服务 host 子进程。
 * Host 自身不在结果里（它的指标由 main 的 app.getAppMetrics 提供）。
 */
export declare function attributeHostProcessTree(options: AttributeHostProcessTreeOptions): HostResourceUsageProcess[];
export {};
//# sourceMappingURL=processResourceSampler.d.ts.map