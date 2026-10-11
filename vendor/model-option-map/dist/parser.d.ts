import { type ModelOptionName } from "./types.js";
import type { RestrictedCelToken } from "./tokenizer.js";
export type RestrictedCelExpression = {
    readonly type: "literal";
    readonly value: string | number | boolean | null;
    readonly offset: number;
} | {
    readonly type: "input";
    readonly offset: number;
} | {
    readonly type: "array";
    readonly elements: readonly RestrictedCelExpression[];
    readonly offset: number;
} | {
    readonly type: "object";
    readonly entries: readonly {
        readonly key: string;
        readonly value: RestrictedCelExpression;
        readonly offset: number;
    }[];
    readonly offset: number;
} | {
    readonly type: "unary";
    readonly operator: "!" | "-" | "+";
    readonly operand: RestrictedCelExpression;
    readonly offset: number;
} | {
    readonly type: "binary";
    readonly operator: string;
    readonly left: RestrictedCelExpression;
    readonly right: RestrictedCelExpression;
    readonly offset: number;
} | {
    readonly type: "conditional";
    readonly condition: RestrictedCelExpression;
    readonly whenTrue: RestrictedCelExpression;
    readonly whenFalse: RestrictedCelExpression;
    readonly offset: number;
};
export declare function parseRestrictedCel(tokens: readonly RestrictedCelToken[], variableName: ModelOptionName): RestrictedCelExpression;
//# sourceMappingURL=parser.d.ts.map