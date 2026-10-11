import { evaluateRestrictedCel } from "./evaluator.js";
import { parseRestrictedCel } from "./parser.js";
import { tokenizeRestrictedCel } from "./tokenizer.js";
import { RestrictedCelError, } from "./types.js";
const programCache = new Map();
const optionMapCache = new Map();
const expressionCache = new Map();
export function compileRestrictedCel(source, variableName) {
    const normalizedSource = normalizeSource(source);
    const cacheKey = createCacheKey(normalizedSource, variableName);
    const cached = programCache.get(cacheKey);
    if (cached)
        return cached;
    const expression = parseExpression(normalizedSource, variableName);
    const program = Object.freeze({
        source: normalizedSource,
        evaluate: (input) => evaluateRestrictedCel(expression, input),
    });
    programCache.set(cacheKey, program);
    return program;
}
export function compileModelOptionMap(source, variableName) {
    const normalizedSource = normalizeSource(source);
    const cacheKey = createCacheKey(normalizedSource, variableName);
    const cached = optionMapCache.get(cacheKey);
    if (cached)
        return cached;
    const expression = parseExpression(normalizedSource, variableName);
    assertObjectResultExpression(expression);
    const program = Object.freeze({
        source: normalizedSource,
        evaluate(input) {
            const result = evaluateRestrictedCel(expression, input);
            if (!isJsonObject(result)) {
                throw new RestrictedCelError("model option map must return a JSON object", 0);
            }
            return result;
        },
    });
    optionMapCache.set(cacheKey, program);
    return program;
}
function normalizeSource(source) {
    const normalizedSource = source.trim();
    if (normalizedSource.length === 0) {
        throw new RestrictedCelError("expression must not be empty", 0);
    }
    return normalizedSource;
}
function parseExpression(source, variableName) {
    const cacheKey = createCacheKey(source, variableName);
    const cached = expressionCache.get(cacheKey);
    if (cached)
        return cached;
    const expression = parseRestrictedCel(tokenizeRestrictedCel(source), variableName);
    expressionCache.set(cacheKey, expression);
    return expression;
}
function createCacheKey(source, variableName) {
    return `${variableName}\0${source}`;
}
function assertObjectResultExpression(expression) {
    if (expression.type === "object")
        return;
    if (expression.type === "conditional") {
        assertObjectResultExpression(expression.whenTrue);
        assertObjectResultExpression(expression.whenFalse);
        return;
    }
    throw new RestrictedCelError("model option map must return a JSON object", expression.offset);
}
function isJsonObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
//# sourceMappingURL=compiler.js.map