import { RestrictedCelError } from "./types.js";
export function parseRestrictedCel(tokens, variableName) {
    return new Parser(tokens, variableName).parse();
}
class Parser {
    tokens;
    variableName;
    #index = 0;
    constructor(tokens, variableName) {
        this.tokens = tokens;
        this.variableName = variableName;
    }
    parse() {
        const expression = this.parseConditional();
        const trailing = this.current();
        if (trailing.kind !== "eof") {
            if (trailing.value === ".") {
                throw new RestrictedCelError("member access is not supported", trailing.offset);
            }
            if (trailing.value === "(") {
                throw new RestrictedCelError("function calls are not supported", trailing.offset);
            }
            throw new RestrictedCelError(`unexpected token ${JSON.stringify(trailing.value)}`, trailing.offset);
        }
        return expression;
    }
    parseConditional() {
        const condition = this.parseLogicalOr();
        if (!this.consume("?"))
            return condition;
        const whenTrue = this.parseConditional();
        this.expect(":");
        const whenFalse = this.parseConditional();
        return { type: "conditional", condition, whenTrue, whenFalse, offset: condition.offset };
    }
    parseLogicalOr() {
        return this.parseBinary(() => this.parseLogicalAnd(), new Set(["||"]));
    }
    parseLogicalAnd() {
        return this.parseBinary(() => this.parseEquality(), new Set(["&&"]));
    }
    parseEquality() {
        return this.parseBinary(() => this.parseRelational(), new Set(["==", "!="]));
    }
    parseRelational() {
        return this.parseBinary(() => this.parseAdditive(), new Set(["<", "<=", ">", ">="]));
    }
    parseAdditive() {
        return this.parseBinary(() => this.parseMultiplicative(), new Set(["+", "-"]));
    }
    parseMultiplicative() {
        return this.parseBinary(() => this.parseUnary(), new Set(["*", "/", "%"]));
    }
    parseBinary(parseOperand, operators) {
        let expression = parseOperand();
        while (this.current().kind === "operator" && operators.has(this.current().value)) {
            const operator = this.advance();
            expression = {
                type: "binary",
                operator: operator.value,
                left: expression,
                right: parseOperand(),
                offset: operator.offset,
            };
        }
        return expression;
    }
    parseUnary() {
        const token = this.current();
        if (token.kind === "operator" &&
            (token.value === "!" || token.value === "-" || token.value === "+")) {
            this.advance();
            return {
                type: "unary",
                operator: token.value,
                operand: this.parseUnary(),
                offset: token.offset,
            };
        }
        return this.parsePrimary();
    }
    parsePrimary() {
        const token = this.advance();
        if (token.kind === "number") {
            const value = Number(token.value);
            if (!Number.isFinite(value) || (Number.isInteger(value) && !Number.isSafeInteger(value))) {
                throw new RestrictedCelError("number literal is not JSON-safe", token.offset);
            }
            return { type: "literal", value, offset: token.offset };
        }
        if (token.kind === "string")
            return { type: "literal", value: token.value, offset: token.offset };
        if (token.kind === "identifier") {
            if (this.current().value === "(") {
                throw new RestrictedCelError("function calls are not supported", this.current().offset);
            }
            if (token.value === this.variableName)
                return { type: "input", offset: token.offset };
            if (token.value === "true" || token.value === "false") {
                return { type: "literal", value: token.value === "true", offset: token.offset };
            }
            if (token.value === "null")
                return { type: "literal", value: null, offset: token.offset };
            throw new RestrictedCelError(`unknown identifier ${JSON.stringify(token.value)}`, token.offset);
        }
        if (token.value === "(") {
            const expression = this.parseConditional();
            this.expect(")");
            return expression;
        }
        if (token.value === "[")
            return this.parseArray(token.offset);
        if (token.value === "{")
            return this.parseObject(token.offset);
        throw new RestrictedCelError(`unexpected token ${JSON.stringify(token.value)}`, token.offset);
    }
    parseArray(offset) {
        const elements = [];
        if (!this.consume("]")) {
            do
                elements.push(this.parseConditional());
            while (this.consume(","));
            this.expect("]");
        }
        return { type: "array", elements: Object.freeze(elements), offset };
    }
    parseObject(offset) {
        const entries = [];
        const keys = new Set();
        if (!this.consume("}")) {
            do {
                const key = this.advance();
                if (key.kind !== "string") {
                    throw new RestrictedCelError("object keys must be string literals", key.offset);
                }
                if (keys.has(key.value)) {
                    throw new RestrictedCelError(`duplicate object key ${JSON.stringify(key.value)}`, key.offset);
                }
                keys.add(key.value);
                this.expect(":");
                entries.push({ key: key.value, value: this.parseConditional(), offset: key.offset });
            } while (this.consume(","));
            this.expect("}");
        }
        return { type: "object", entries: Object.freeze(entries), offset };
    }
    consume(value) {
        if (this.current().value !== value)
            return false;
        this.#index += 1;
        return true;
    }
    expect(value) {
        const token = this.current();
        if (token.value !== value) {
            throw new RestrictedCelError(`expected ${JSON.stringify(value)}`, token.offset);
        }
        this.#index += 1;
        return token;
    }
    advance() {
        const token = this.current();
        if (token.kind !== "eof")
            this.#index += 1;
        return token;
    }
    current() {
        return this.tokens[this.#index] ?? this.tokens[this.tokens.length - 1];
    }
}
//# sourceMappingURL=parser.js.map