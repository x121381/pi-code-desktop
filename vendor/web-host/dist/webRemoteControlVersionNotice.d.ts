/** 原页面保持挂载；原生 modal 阻止背景元素与其他 portal 的操作，全局快捷键由入口提前拦截。 */
export declare function showWebRemoteControlVersionNotice(version: string, onReload: () => void): () => void;
