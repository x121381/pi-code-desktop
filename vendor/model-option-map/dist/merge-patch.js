import { ModelOptionMapError } from "./types.js";
export function applyOrderedJsonMergePatches(body, patches) {
    const ownedPaths = [];
    let result = cloneJson(body);
    for (const namedPatch of patches) {
        const paths = collectWrittenPaths(namedPatch.patch);
        for (const path of paths) {
            const conflict = ownedPaths.find((owned) => pathsOverlap(owned.path, path));
            if (conflict) {
                throw new ModelOptionMapError(`Model option maps write conflicting JSON path ${formatPath(path)}: ${conflict.option} and ${namedPatch.option}`);
            }
            ownedPaths.push({ option: namedPatch.option, path });
        }
        result = mergeObject(result, namedPatch.patch);
    }
    return result;
}
function collectWrittenPaths(patch, prefix = []) {
    const paths = [];
    for (const [key, value] of Object.entries(patch)) {
        const path = [...prefix, key];
        if (isJsonObject(value) && Object.keys(value).length > 0) {
            paths.push(...collectWrittenPaths(value, path));
        }
        else {
            paths.push(path);
        }
    }
    return paths;
}
function pathsOverlap(left, right) {
    const sharedLength = Math.min(left.length, right.length);
    for (let index = 0; index < sharedLength; index += 1) {
        if (left[index] !== right[index])
            return false;
    }
    return true;
}
function formatPath(path) {
    return path.length === 0 ? "$" : `$.${path.join(".")}`;
}
function mergeObject(target, patch) {
    const result = cloneJson(target);
    for (const [key, patchValue] of Object.entries(patch)) {
        if (patchValue === null) {
            delete result[key];
            continue;
        }
        if (isJsonObject(patchValue)) {
            const targetValue = result[key];
            result[key] = mergeObject(isJsonObject(targetValue) ? targetValue : {}, patchValue);
            continue;
        }
        result[key] = cloneJson(patchValue);
    }
    return result;
}
function cloneJson(value) {
    if (Array.isArray(value))
        return value.map(cloneJson);
    if (!isJsonObject(value))
        return value;
    const result = Object.create(null);
    for (const [key, entry] of Object.entries(value)) {
        Object.defineProperty(result, key, {
            configurable: true,
            enumerable: true,
            value: cloneJson(entry),
            writable: true,
        });
    }
    return result;
}
function isJsonObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
//# sourceMappingURL=merge-patch.js.map