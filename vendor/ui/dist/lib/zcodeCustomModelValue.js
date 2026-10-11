import { decodeCustomModelValue as decodeSharedCustomModelValue, encodeCustomModelValue as encodeSharedCustomModelValue, } from "@zcode/shared";
export function encodeCustomModelValue(providerId, modelName) {
    return encodeSharedCustomModelValue(providerId, modelName);
}
export function decodeCustomModelValue(value) {
    return decodeSharedCustomModelValue(value);
}
//# sourceMappingURL=zcodeCustomModelValue.js.map