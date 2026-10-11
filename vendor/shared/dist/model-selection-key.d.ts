import type { ModelSelectionGhostReason } from "./model-selection-types.js";
import type { ZCodeProvider } from "./zcode-task-types-core.js";
export declare const NATIVE_SUPPLIER_KEY_PREFIX = "native:";
export declare const CUSTOM_SUPPLIER_KEY_PREFIX = "custom:";
export declare const GHOST_SUPPLIER_KEY_PREFIX = "ghost:";
export declare function normalizeSupplierBaseUrl(baseUrl: string): string;
export declare function buildNativeSupplierKey(zcodeProvider: ZCodeProvider): string;
export declare function buildCustomSupplierKey(providerId: string): string;
export declare function buildGhostSupplierIdentity(rawIdentity: string): string;
export declare function buildGhostSupplierKey(zcodeProvider: ZCodeProvider, reason: ModelSelectionGhostReason, rawIdentity: string): string;
export declare function resolveSupplierKeyFromModelDisplayValue(zcodeProvider: ZCodeProvider, value: string | boolean | undefined): string;
//# sourceMappingURL=model-selection-key.d.ts.map