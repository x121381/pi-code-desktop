/**
 * guestWebContentsId 是当前 tab 的 guest 身份：permission 请求带归属 id 且不匹配
 * 当前 tab 时不在本 tab 渲染（后台 tab 的请求不显示在当前 tab，避免误批准）。
 * 当前 tab 无 guest（空 tab）时任何带归属的请求都不属于它，同样不渲染；
 * 请求缺归属 id（device/screen-share 等无 tab 锚定语义的弹窗）兜底渲染，
 * 气泡正文始终展示 origin 供用户确认来源。
 */
export declare function EmbeddedBrowserPermissionPrompts({ guestWebContentsId, }: {
    guestWebContentsId?: number;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=EmbeddedBrowserPermissionPrompts.d.ts.map