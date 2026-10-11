import type { ProviderConfigObject } from "@zcode/provider";
import { type ResolvedTheme } from "@/useTheme.js";
type ProviderLogoRef = NonNullable<ProviderConfigObject["logo"]>;
export declare function resolveBuiltinProviderLogoAsset(logo: ProviderLogoRef | null | undefined, theme: ResolvedTheme): string | null;
export declare function ProviderLogo({ logo, className, }: {
    logo?: ProviderLogoRef | null;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ProviderLogo.d.ts.map