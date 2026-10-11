import { type JsonObject } from "./types.js";
export interface NamedJsonMergePatch {
    readonly option: string;
    readonly patch: JsonObject;
}
export declare function applyOrderedJsonMergePatches(body: JsonObject, patches: readonly NamedJsonMergePatch[]): JsonObject;
//# sourceMappingURL=merge-patch.d.ts.map