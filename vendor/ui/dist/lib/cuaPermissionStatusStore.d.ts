import type { CuaPermissionStatusQueryOptions, CuaPermissionStatusResult, ICuaPermissionService } from "@zcode/services";
export interface CuaPermissionStatusSnapshot {
    /** 上次成功查询的结果；null = 该 workspace 尚未拿到过任何状态。 */
    status: CuaPermissionStatusResult | null;
    /**
     * status 是否可用于决策。查询进行中或最近一次查询失败时为 false——
     * 展示可以继续沿用 lastKnown，但「打开系统设置」这类动作必须等新结果。
     */
    fresh: boolean;
    /**
     * 是否已有可展示的确定内容。冷启动缓存命中即成立，拿到过真实结果后只升不降。
     *
     * 与 fresh 的分工：fresh 表达「当前值是否刚确认」，每次查询开始都会落回 false；
     * 展示若跟着它走，授权按钮就会在「打开系统设置」与「验证中…」之间反复切换、
     * 按钮宽度随之跳变。settled 专供展示，避免这种抖动。
     */
    settled: boolean;
}
/**
 * 与设置页 helperContextKey 同构：权限归属于 (workspace 路径, workspace identity)。
 * 用 NUL 分隔，避免路径里的空格让不同 workspace 撞进同一槽位。
 */
export declare function cuaPermissionStatusKey(workspacePath: string, workspaceIdentity?: string): string;
export declare function subscribeCuaPermissionStatus(listener: () => void): () => void;
export declare function getCuaPermissionStatusSnapshot(key: string | null): CuaPermissionStatusSnapshot;
/** 测试复位：模块级缓存会跨用例存活。 */
export declare function resetCuaPermissionStatusStoreForTest(): void;
/**
 * 展示态就绪：TCC 双项 granted。设置页权限行与输入框入口按钮共用这一口径，
 * 保证同一份授权在两处显示一致。
 *
 * 为什么展示态不看功能探针：只读刷新按上游约定永不运行截图探针
 * （shouldRunCuaScreenCaptureProbe 要求显式 includeFunctionalProbes，主动抓屏必须是
 * 用户意图），screenCaptureProbeOk 因而恒为 false，拿它判展示等于把已授权用户恒判成
 * 待授权。真实不可用（TCC 记了授权但 WindowServer 未放行像素等）由工具调用的普通
 * MCP error 暴露给模型，Renderer 不靠常驻查询或错误文本猜权限。
 */
export declare function isCuaPermissionTccGranted(result: CuaPermissionStatusResult | null): boolean;
export interface FetchCuaPermissionStatusParams {
    service: ICuaPermissionService;
    workspacePath: string;
    workspaceIdentity?: string;
    options?: CuaPermissionStatusQueryOptions;
    /**
     * "refresh"（默认）= 外部状态可能刚变（焦点返回、Helper 重启、插件开关），进行中的查询
     * 可能读的是旧世界，必须补一次；
     * "ensure" = 只要求「有一份新鲜结果」（组件挂载），已有查询在飞时直接搭车，
     * 否则设置页与输入框入口先后挂载会各自排队，白白多打一次 host RPC；
     * "retry" = store 自己排的退避重试，**不重置重试计数**——否则每次重试都拿回满额度，
     * 有界退避会退化成固定间隔的无限轮询。
     */
    mode?: "refresh" | "ensure" | "retry";
}
/**
 * 拉一次权限状态并写入共享缓存。同一 workspace 的并发调用会被合并：进行中时至多记一个补查，
 * 避免原生授权 prompt / 系统设置来回切换连续产生 focus 时把 AX + 截图探针叠成一串。
 */
export declare function fetchCuaPermissionStatus(params: FetchCuaPermissionStatusParams): void;
//# sourceMappingURL=cuaPermissionStatusStore.d.ts.map