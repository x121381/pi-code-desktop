/** 窗口级页面 owner。视图只持锚点租约，切位置不会销毁 controller 或活页面。 */
export interface ManagedPluginPage {
    readonly key: string;
    readonly task: string;
    visible: boolean;
    busy(): boolean;
    running(): boolean;
    suspend(): void | Promise<boolean | void>;
    destroy(): void;
}
export declare class PluginUiPageManager<T extends ManagedPluginPage> {
    private readonly timer;
    private readonly clearTask;
    private readonly changed;
    private readonly allocated;
    private admission;
    private readonly pages;
    private readonly tasks;
    private readonly timers;
    private readonly pendingAdds;
    constructor(timer: (run: () => void, ms: number) => () => void, clearTask: (task: string) => void, changed?: (key: string) => void);
    get(key: string): T | undefined;
    add(page: T): Promise<void>;
    reserve(page: T): Promise<void>;
    released(page: T): void;
    visibility(page: T, visible: boolean): void;
    settled(page: T): void;
    removeTask(task: string): void;
    clear(): void;
}
//# sourceMappingURL=pluginUiPageManager.d.ts.map