import { type ReactNode } from "react";
import type { LucideProps } from "lucide-react";
interface ClientSceneLucideIconProps extends Omit<LucideProps, "children"> {
    fallback: ReactNode;
    name?: string;
}
/** 按 Client Scenes 下发的 Lucide canonical 名称加载图标，未知名称保留调用方语义回退。 */
export declare function ClientSceneLucideIcon({ fallback, name, ...iconProps }: ClientSceneLucideIconProps): string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
export {};
//# sourceMappingURL=ClientSceneLucideIcon.d.ts.map