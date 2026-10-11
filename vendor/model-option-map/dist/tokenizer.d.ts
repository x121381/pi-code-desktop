export type RestrictedCelTokenKind = "identifier" | "string" | "number" | "operator" | "punctuation" | "eof";
export interface RestrictedCelToken {
    readonly kind: RestrictedCelTokenKind;
    readonly value: string;
    readonly offset: number;
    readonly end: number;
}
export declare function tokenizeRestrictedCel(source: string): readonly RestrictedCelToken[];
//# sourceMappingURL=tokenizer.d.ts.map