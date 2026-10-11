import { type UseCuaComposerEntryParams } from "@/hooks/useCuaComposerEntry.js";
export type V4ComposerCuaEntryProps = UseCuaComposerEntryParams;
/**
 * 平台门前置层：平台不支持（或宿主根本没提供 platform / services context）时连内层都不挂载。
 *
 * 拆两层的原因有二：
 * 1. 语义——「不可见就不该有任何后台开销」。平台门不过时不建立 settings 订阅、不读插件 store、
 *    不起权限轮询，比在内层判完再返回 null 更彻底。
 * 2. 健壮性——composer 会在没有 PlatformProvider / ServiceProvider 的宿主（含既有的组件级
 *    测试）里渲染。内层用的 usePlatform / useServices 在缺 provider 时会抛异常，把整个
 *    composer 拖崩。这里用 optional 变体判定，缺失即静默降级为不渲染。
 */
declare function V4ComposerCuaEntryImpl(props: V4ComposerCuaEntryProps): import("react/jsx-runtime").JSX.Element | null;
export declare const V4ComposerCuaEntry: import("react").MemoExoticComponent<typeof V4ComposerCuaEntryImpl>;
export {};
//# sourceMappingURL=V4ComposerCuaEntry.d.ts.map