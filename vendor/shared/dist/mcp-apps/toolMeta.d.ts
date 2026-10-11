import type { McpAppCspRelaxations, McpAppResourceMeta, McpAppsResourcePermission, McpAppsToolVisibility, McpToolUiDescriptor } from "./contract.js";
/**
 * 工具可见性与 UI 呈现解耦。只读 `_meta.ui.visibility`，缺省 `["model", "app"]`；
 * 没有 `ui://` 资源的纯数据工具同样按它决定进不进模型工具表，不再因为缺 resourceUri 而整体丢失。
 */
export declare function readMcpToolVisibility(meta: unknown): McpAppsToolVisibility[];
/**
 * 工具 `_meta` → UI 描述的归一化。纯函数。resourceUri 来源按优先级：`_meta.ui.resourceUri` →
 * 弃用扁平键 `_meta["ui/resourceUri"]`（规范 MUST 兼容）→ 兼容接口的 `openai/outputTemplate`。
 * 兼容 `openai/*` 别名；任何一项非法只丢弃该项，唯独 resourceUri 非法则整体为 null
 * （此时可见性由 readMcpToolVisibility 单独给出）。
 */
export declare function normalizeMcpToolUiMeta(meta: unknown): McpToolUiDescriptor | null;
/**
 * `ui://` HTML 资源项自己的 `_meta`（以被选中内容项的 `_meta.ui` 为准）。
 * csp 与 prefersBorder 兼容 `openai/widgetCSP` / `openai/widgetPrefersBorder` 别名；
 * 尺寸提示只有 `openai/widgetHeightHint` / `openai/widgetMinFrameHeight`；`openai/widgetShowCodexWidgetInline` → showInline；
 * 什么都没声明返回 null。
 */
export declare function normalizeMcpAppResourceMeta(meta: unknown): McpAppResourceMeta | null;
/** `_meta.ui.permissions`：只认规范四键且值为对象（`{}`），未知键丢弃；按固定顺序返回。 */
export declare function normalizeMcpAppResourcePermissions(value: unknown): McpAppsResourcePermission[];
/**
 * 资源级 `_meta["zcode/csp"]`：只认 `MCP_APPS_CSP_RELAXATION_FLAGS` 里的布尔键，未知键与非布尔值丢弃；
 * 没有任何为 true 的键返回 null（false 等于不声明）。
 */
export declare function normalizeMcpAppCspRelaxations(meta: unknown): McpAppCspRelaxations | null;
/** 面板 id：长度与字符集受限，非法即丢弃（工具结果退回内联卡片，不报错）。 */
export declare function readSurfaceId(value: unknown): string | undefined;
/**
 * 校验 CSP 允许列表中的单个 origin，返回归一化 origin（保留端口），非法返回 null。
 * - `https:` / `wss:`：任意 host。
 * - `http:` / `ws:`：仅当 hostname 恰为 `127.0.0.1`（openpencil H-B 回环放行），为的是插件自带的本机服务
 *   （例如插件 MCP server 进程里的 WebSocket 桥）能被沙箱页面连接。不放 `localhost`（可被 hosts 文件改写）、
 *   不放 `[::1]`（与我们 MCP 桥绑定的 127.0.0.1 不一致）、不放其他 IP。
 * - 一律不接受凭据、query、hash 与路径。
 */
export declare function normalizeCspOrigin(value: unknown): string | null;
//# sourceMappingURL=toolMeta.d.ts.map