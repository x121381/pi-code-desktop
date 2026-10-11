import type { Page } from "./pluginUiHostTypes.js";
export declare const pluginUiPages: {
    get(key: string): Page | undefined;
    add: (page: Page) => Promise<void>;
    reserve: (page: Page) => Promise<void>;
    released: (page: Page) => void;
    visibility: (page: Page, visible: boolean) => void;
    settled: (page: Page) => void;
    removeTask: (task: string) => void;
    clear: () => void;
};
export declare function subscribePage(key: string, listener: () => void): () => void;
export declare function bindPluginUiPage(key: string, node: HTMLElement, sidebar: boolean): () => void;
export declare function notifyPluginUiPageCreated(key: string): void;
export declare function acquirePluginUiPage(key: string, create: () => Page): Promise<Page>;
//# sourceMappingURL=pluginUiPageRegistry.d.ts.map