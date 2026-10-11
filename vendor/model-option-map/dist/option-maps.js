import { compileModelOptionMap } from "./compiler.js";
import { applyOrderedJsonMergePatches } from "./merge-patch.js";
import { ModelOptionMapError } from "./types.js";
/** Model 创建时编译一次；每个请求只绑定本轮冻结的 Option value。 */
export function compileModelOptionMaps(specs) {
    const reasoningLevel = compileModelOptionMap(specs.reasoningLevel.map, "reasoningLevel");
    const maxOutputTokens = compileModelOptionMap(specs.maxOutputTokens.map, "maxOutputTokens");
    return Object.freeze({
        apply(body, values) {
            const patches = [];
            if (values.reasoningLevel === undefined) {
                throw new ModelOptionMapError("reasoningLevel requires an effective value");
            }
            patches.push(optionPatch("reasoningLevel", reasoningLevel, values.reasoningLevel));
            patches.push(optionPatch("maxOutputTokens", maxOutputTokens, values.maxOutputTokens));
            return applyOrderedJsonMergePatches(body, patches);
        },
    });
}
function optionPatch(option, program, value) {
    return { option, patch: program.evaluate(value) };
}
//# sourceMappingURL=option-maps.js.map