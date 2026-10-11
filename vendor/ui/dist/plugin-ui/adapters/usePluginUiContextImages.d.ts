import type { PluginUiModelContext } from "../domain/pluginUiModelContext.js";
export interface PluginUiContextImagesPort {
    addAttachmentFiles(files: File[]): string[];
    removeAttachment(id: string): void;
}
/**
 * 把插件上下文里的 image 块物化成 composer 图片附件（与粘贴截图同一条上传链路）。
 * 每条上下文的附件 id 记在这里：同一实例再次 updateModelContext（同 id、新对象）或用户移除该上下文时，
 * 旧附件一并撤掉；发送后附件由 composer 自己按冻结 id 清理，这里的撤销对已清理的 id 是 no-op。
 */
export declare function usePluginUiContextImages(contexts: readonly PluginUiModelContext[], port: PluginUiContextImagesPort): void;
//# sourceMappingURL=usePluginUiContextImages.d.ts.map