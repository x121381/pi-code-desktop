/**
 * 终端生命周期管理 hook
 *
 * 封装 create/write/resize/dispose 和 onDynamicData/onDynamicExit 事件订阅。
 * 组件卸载时自动清理终端和事件订阅。
 */
export declare function useTerminal(opts: {
    cols: number;
    rows: number;
    cwd?: string;
    onData?: (data: string) => void;
    onExit?: (code: number) => void;
}): {
    terminalId: string | null;
    write: (data: string) => void;
    resize: (cols: number, rows: number) => void;
};
//# sourceMappingURL=useTerminalService.d.ts.map